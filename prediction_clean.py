import sys
import subprocess
import numpy as np

try:
    import pandas as pd
    from prophet import Prophet
    import openpyxl
    from openpyxl.styles import PatternFill, Font, Alignment
    from openpyxl.utils import get_column_letter
except ModuleNotFoundError:
    print("Missing required libraries. Installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pandas", "prophet", "openpyxl"])
    import pandas as pd
    from prophet import Prophet
    import openpyxl
    from openpyxl.styles import PatternFill, Font, Alignment
    from openpyxl.utils import get_column_letter

import warnings
import logging

warnings.filterwarnings('ignore')
logging.getLogger('cmdstanpy').setLevel(logging.ERROR)
logging.getLogger('prophet').setLevel(logging.ERROR)
RANGE_PCT = 0.10

try:
    print("\n--- Artimus 2026 Booking Forecast ---")
    print("Reading data from Prediction.xlsx...")
    excel_file = pd.ExcelFile("Prediction.xlsx")
    dfs = []
    for sheet_name in excel_file.sheet_names:
        sheet_df = pd.read_excel(excel_file, sheet_name=sheet_name)
        dfs.append(sheet_df)
    
    df = pd.concat(dfs, ignore_index=True)
    
    df['Date'] = pd.to_datetime(df['created_at'], format='mixed', dayfirst=True)
    if 'Id' in df.columns and 'org_id' in df.columns:
        org_col = df['org_id'].fillna(df['Id'])
    elif 'Id' in df.columns:
        org_col = df['Id']
    else:
        org_col = df['org_id']
        
    df['Client Name'] = org_col.astype(str).str.replace(r'\.0$', '', regex=True)
    
    df['Number of Bookings'] = 1
except Exception as e:
    print(f"Error loading Prediction.xlsx: {e}")
    sys.exit(1)

df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month
df['Month Name'] = df['Date'].dt.strftime('%B')

historical_summary = df.groupby(['Client Name', 'Year', 'Month', 'Month Name']).agg(
    Bookings=('Number of Bookings', 'sum')
).reset_index()

historical_summary = historical_summary.sort_values(by=['Client Name', 'Year', 'Month'])
historical_summary['YTD Bookings'] = historical_summary.groupby(['Client Name', 'Year'])['Bookings'].cumsum()
historical_summary['YoY Growth %'] = historical_summary.groupby(['Client Name', 'Month'])['Bookings'].pct_change() * 100
historical_summary['YoY Growth %'] = historical_summary['YoY Growth %'].apply(
    lambda x: f"+{x:.1f}%" if x > 0 else (f"{x:.1f}%" if pd.notna(x) else "+0.0%")
)
historical_summary = historical_summary.rename(columns={'Bookings': 'Number of Bookings'})
historical_summary = historical_summary.drop(columns=['Month'])

monthly_forecast_results = []
yearly_forecast_results = []
customer_patterns_results = []  
clients = df['Client Name'].unique()

global_max_year = df['Year'].max()
global_last_year_months = list(range(1, 13))
global_next_dates = [
    pd.Timestamp(year=global_max_year + 1, month=m, day=1)
    for m in global_last_year_months
]

print("\n" + "="*40)
print("       DATASET SYNOPSIS")
print("="*40)
print(f"Date Range:  {df['Date'].min().strftime('%b %Y')} to {df['Date'].max().strftime('%b %Y')}")
print(f"Bookings:    {len(df):,}")
print(f"Customers:   {len(clients)}")
top_3 = historical_summary.groupby('Client Name')['Number of Bookings'].sum().nlargest(3)
print(f"Top Clients: {', '.join(top_3.index.astype(str))}")
print("="*40 + "\n")

total_clients = len(clients)
print(f"Starting detailed analysis for {total_clients} customers...\n")

for i, client in enumerate(clients, 1):
    print(f"[{i}/{total_clients}] Analyzing patterns for customer: {client}...", end='\r')
    client_data = df[df['Client Name'] == client].copy()
    target_val = None # Initialize for all clients

    if len(client_data) >= 1:
        try:
            prophet_df = client_data[['Date', 'Number of Bookings']].copy()
            prophet_df.set_index('Date', inplace=True)

            client_min = prophet_df.index.min().replace(day=1)
            client_max = prophet_df.index.max().replace(day=1)
            client_date_range = pd.date_range(client_min, client_max, freq='MS')

            prophet_df = prophet_df.resample('MS').sum()
            prophet_df = prophet_df.reindex(client_date_range, fill_value=0).reset_index()
            prophet_df = prophet_df.rename(columns={'index': 'ds', 'Number of Bookings': 'y'})

            active_months_df = prophet_df[prophet_df['y'] > 0]
            historical_monthly_avg = active_months_df['y'].mean() if len(active_months_df) > 0 else prophet_df['y'].mean()

            prophet_df['month_num'] = pd.to_datetime(prophet_df['ds']).dt.month
            month_hist_avg = prophet_df.groupby('month_num')['y'].mean()
            month_hist_std = prophet_df.groupby('month_num')['y'].std().fillna(0)
            overall_avg = prophet_df['y'].mean()

            n_months = len(prophet_df)
            
            client_max_year = prophet_df['ds'].dt.year.max()
            next_dates = pd.Series(global_next_dates)
            n_predict = len(next_dates)

            if n_months >= 12:
                # Extreme Case Tuning: High flexibility and seasonal detail to capture spikes and drops
                model = Prophet(
                    yearly_seasonality=10, 
                    weekly_seasonality=False, 
                    daily_seasonality=False,
                    changepoint_prior_scale=0.5, 
                    seasonality_prior_scale=10.0
                )
                max_cap = prophet_df['y'].max() * 5.0 # High cap for growth
                model.fit(prophet_df)
                
                future = pd.DataFrame({'ds': next_dates})
                forecast = model.predict(future)
                prophet_preds = forecast['yhat'].values

                recent_year_data = prophet_df[prophet_df['ds'].dt.year == client_max_year]
                recent_month_dict = dict(zip(recent_year_data['ds'].dt.month, recent_year_data['y']))

                blended = []
                # ANOMALY DETECTION: Identify and dampen extreme spikes
                median_y = prophet_df[prophet_df['y'] > 0]['y'].median() if len(prophet_df[prophet_df['y'] > 0]) > 0 else 0
                prophet_df_clean = prophet_df.copy()
                if median_y > 0:
                    # If a value is >10x the median, it's a spike. Cap it for momentum calc.
                    prophet_df_clean['y'] = prophet_df_clean['y'].clip(upper=median_y * 10)

                # MOMENTUM CALC (on cleaned data)
                latest_year_months = prophet_df_clean[prophet_df_clean['ds'].dt.year == client_max_year]['ds'].dt.month.unique()
                total_2024 = prophet_df_clean[(prophet_df_clean['ds'].dt.year == (client_max_year - 1)) & (prophet_df_clean['ds'].dt.month.isin(latest_year_months))]['y'].sum()
                total_2025 = prophet_df_clean[(prophet_df_clean['ds'].dt.year == client_max_year)]['y'].sum()
                
                raw_momentum = (total_2025 / total_2024) if total_2024 > 0 else 1.05
                
                # S-Curve Dampening for high growth
                if raw_momentum > 1.3:
                    momentum = 1.3 + (np.log10(raw_momentum / 1.3) * 0.3)
                else:
                    momentum = raw_momentum
                
                # Strict limits for clients with short history (< 24 months)
                if n_months < 24:
                    momentum = min(1.2, momentum)
                else:
                    momentum = min(1.8, max(0.01, raw_momentum))

                hist_max = prophet_df['y'].max()
                baseline_avg = median_y if median_y > 0 else historical_monthly_avg

            # Experimental forecast: no predefined customer targets
            target_val = None
            calibrated_momentum = momentum if n_months >= 12 else 1.05

            # Final Prediction
            blended = []
            for i, d in enumerate(next_dates):
                if target_val is not None:
                    actual_val_last_year = recent_month_dict.get(d.month, 0) if 'recent_month_dict' in locals() else (prophet_df['y'].mean())
                    recent_val = actual_val_last_year if actual_val_last_year > 0 else (median_y if 'median_y' in locals() else 1)
                    p_noise = prophet_preds[i] if 'prophet_preds' in locals() else recent_val
                    prediction = (0.02 * p_noise) + (0.98 * recent_val * calibrated_momentum)
                else:
                    if n_months >= 12:
                        actual_val_last_year = recent_month_dict.get(d.month, 0)
                        val_2024 = prophet_df[(prophet_df['ds'].dt.year == (client_max_year - 1)) & (prophet_df['ds'].dt.month == d.month)]['y'].sum()
                        is_proven_peak = (val_2024 > 0 and actual_val_last_year > 0 and (actual_val_last_year / val_2024) < 15)
                        if is_proven_peak:
                            recent_val = actual_val_last_year
                            tf = 0.0
                        elif actual_val_last_year > median_y * 10:
                            recent_val = median_y * 1.1
                            tf = 0.0
                        else:
                            recent_val = actual_val_last_year if actual_val_last_year > 0 else median_y
                            tf = 0.05
                        prediction = tf * prophet_preds[i] + (1.0 - tf) * (recent_val * (momentum if 'momentum' in locals() else 1.05))
                    else:
                        prediction = (prophet_df['y'].mean() if n_months > 0 else 0) * 1.05
                blended.append(prediction)
            
            raw_preds = blended
            client_accuracy = None
            max_cap = 1000000 
 
            future_predictions = pd.DataFrame({'ds': next_dates, 'yhat': raw_preds})
            future_predictions['Client Name'] = client
            future_predictions['Year'] = future_predictions['ds'].dt.year
            future_predictions['Month Name'] = future_predictions['ds'].dt.strftime('%B')

            min_floor = max(1, int(historical_monthly_avg * 0.20))
            if target_val is not None:
                # Bypass floor/cap but ensure no negative values
                future_predictions['Predicted Monthly Bookings'] = future_predictions['yhat'].apply(lambda x: max(0, round(x))).astype(int)
            else:
                future_predictions['Predicted Monthly Bookings'] = future_predictions['yhat'].clip(lower=min_floor, upper=max_cap).round().astype(int)
            
            future_predictions['Min Predicted Bookings'] = (future_predictions['Predicted Monthly Bookings'] * (1 - RANGE_PCT)).apply(lambda x: max(1, round(x))).astype(int)
            future_predictions['Max Predicted Bookings'] = (future_predictions['Predicted Monthly Bookings'] * (1 + RANGE_PCT)).apply(lambda x: round(x)).astype(int)

            def season_label(val):
                if val >= overall_avg * 1.3:
                    return 'Peak'
                elif val <= overall_avg * 0.7:
                    return 'Low'
                return 'Normal'

            future_predictions['Season'] = future_predictions['Predicted Monthly Bookings'].apply(season_label)

            def confidence_label(row):
                m = pd.to_datetime(row['ds']).month
                std = month_hist_std.get(m, 0)
                avg = month_hist_avg.get(m, historical_monthly_avg)
                cv = std / avg if avg > 0 else 1
                if cv < 0.2:
                    return 'High'
                elif cv < 0.4:
                    return 'Medium'
                return 'Low'

            future_predictions['Confidence'] = future_predictions.apply(confidence_label, axis=1)

            last_year_actuals = prophet_df[pd.to_datetime(prophet_df['ds']).dt.year == client_max_year]
            last_year_by_month = last_year_actuals.set_index('month_num')['y']
            last_year_monthly_avg = last_year_actuals['y'].mean() if len(last_year_actuals) > 0 else historical_monthly_avg

            def predicted_growth(row):
                m = pd.to_datetime(row['ds']).month
                actual = last_year_by_month.get(m, last_year_monthly_avg)
                if actual is None or actual == 0:
                    actual = last_year_monthly_avg
                if actual > 0:
                    pct = (row['Predicted Monthly Bookings'] - actual) / actual * 100
                    return f"+{pct:.1f}%" if pct > 0 else f"{pct:.1f}%"
                return "+0.0%"

            future_predictions['Predicted Growth %'] = future_predictions.apply(predicted_growth, axis=1)

            future_predictions['Accuracy %'] = "Not Evaluated"
            
            monthly_preds = future_predictions[[
                'Client Name', 'Year', 'Month Name',
                'Min Predicted Bookings', 'Predicted Monthly Bookings', 'Max Predicted Bookings',
                'Season', 'Confidence', 'Accuracy %', 'Predicted Growth %'
            ]]
            monthly_forecast_results.append(monthly_preds)
            last_year_total = prophet_df[prophet_df['ds'].dt.year == client_max_year]['y'].sum()
            yearly_total = monthly_preds['Predicted Monthly Bookings'].sum()
            yearly_growth = None  # Incomplete historical year; annual growth is not comparable
            best_month = monthly_preds.loc[monthly_preds['Predicted Monthly Bookings'].idxmax(), 'Month Name']
            worst_month = monthly_preds.loc[monthly_preds['Predicted Monthly Bookings'].idxmin(), 'Month Name']
            peak_months = monthly_preds[monthly_preds['Season'] == 'Peak']['Month Name'].tolist()

            yearly_pred = pd.DataFrame([{
                'Client Name': client,
                'Min Predicted Bookings': int(yearly_total * (1 - RANGE_PCT)),
                'Predicted Next Months Bookings': yearly_total,
                'Max Predicted Bookings': int(yearly_total * (1 + RANGE_PCT)),
                'Overall Accuracy %': "Not Evaluated",
                'Predicted Growth % vs Last Year': "Not Comparable",
                'Avg Monthly Bookings': round(yearly_total / n_predict if n_predict > 0 else 0, 1),
                'Best Month': best_month,
                'Worst Month': worst_month,
                'Peak Months': ', '.join(peak_months) if peak_months else 'None',
            }])
            yearly_forecast_results.append(yearly_pred)

            total_bookings = prophet_df['y'].sum()
            first_booking_idx = prophet_df[prophet_df['y'] > 0].index.min()
            tracked_df = prophet_df.loc[first_booking_idx:] if pd.notna(first_booking_idx) else prophet_df
            
            total_months_tracked = len(tracked_df)
            active_months = len(tracked_df[tracked_df['y'] > 0])
            
            booking_frequency = "Every Month" if active_months == total_months_tracked else f"1 in every {round(total_months_tracked/active_months, 1)} months" if active_months > 0 else "None"
            best_historical_month = month_hist_avg.idxmax() if not month_hist_avg.empty else "N/A"
            best_historical_month_name = pd.to_datetime(f"2000-{int(best_historical_month)}-01").strftime('%B') if best_historical_month != "N/A" else "N/A"

            if active_months == total_months_tracked:
                pattern = "Highly Consistent"
            elif active_months > total_months_tracked / 2:
                pattern = "Regularly Active"
            else:
                pattern = "Sporadic / Seasonal"

            customer_patterns_results.append({
                'Client Name': client,
                'Booking Pattern': pattern,
                'Favorite Month': best_historical_month_name,
                'Booking Frequency': booking_frequency,
                'Total Historical Bookings': total_bookings
            })

        except Exception as e:
            print(f"Skipping prediction for {client} due to error: {e}")
    else:
        print(f"Not enough historical data for {client} (only {len(client_data)} records).")

if monthly_forecast_results:
    all_monthly_df = pd.concat(monthly_forecast_results, ignore_index=True)
    all_yearly_df = pd.concat(yearly_forecast_results, ignore_index=True)
    all_patterns_df = pd.DataFrame(customer_patterns_results)
else:
    all_monthly_df = pd.DataFrame()
    all_yearly_df = pd.DataFrame()
    all_patterns_df = pd.DataFrame()

output_file = "forecast_clean_2026.xlsx"

def style_sheet(ws):
    header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    header_font = Font(color="FFFFFF", bold=True)
    green_fill = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")
    red_fill   = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")
    gray_fill  = PatternFill(start_color="F2F2F2", end_color="F2F2F2", fill_type="solid")

    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', wrap_text=True)

    headers = [cell.value for cell in ws[1]]

    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        row_fill = gray_fill if row_idx % 2 == 0 else PatternFill()
        for cell in row:
            if row_idx % 2 == 0:
                cell.fill = row_fill
            col_name = headers[cell.column - 1] if cell.column - 1 < len(headers) else ''
            if 'Growth' in str(col_name) and cell.value and isinstance(cell.value, str):
                if cell.value.startswith('+') and cell.value != '+0.0%':
                    cell.fill = green_fill
                elif cell.value.startswith('-'):
                    cell.fill = red_fill
            if 'Season' in str(col_name) and cell.value:
                if cell.value == 'Peak':
                    cell.fill = PatternFill(start_color="FFEB9C", end_color="FFEB9C", fill_type="solid")
                elif cell.value == 'Low':
                    cell.fill = PatternFill(start_color="DAEEF3", end_color="DAEEF3", fill_type="solid")
            if 'Confidence' in str(col_name) or 'Accuracy' in str(col_name) and cell.value:
                if cell.value in ['High', '90.0%', '95.0%'] or (isinstance(cell.value, str) and '%' in cell.value and float(cell.value.strip('%')) >= 85):
                    cell.fill = green_fill
                elif cell.value == 'Low' or (isinstance(cell.value, str) and '%' in cell.value and float(cell.value.strip('%')) < 80):
                    cell.fill = red_fill
            if 'Booking Pattern' in str(col_name) and cell.value:
                if cell.value == 'Highly Consistent':
                    cell.fill = green_fill
                elif cell.value == 'Sporadic / Seasonal':
                    cell.fill = PatternFill(start_color="FFEB9C", end_color="FFEB9C", fill_type="solid")

    for col_idx, col in enumerate(ws.columns, 1):
        max_len = max((len(str(cell.value)) if cell.value else 0) for cell in col)
        ws.column_dimensions[get_column_letter(col_idx)].width = min(max_len + 4, 30)

    ws.freeze_panes = 'A2'

try:
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        historical_summary.to_excel(writer, sheet_name='Historical Summary', index=False)
        all_monthly_df.to_excel(writer, sheet_name='Monthly Predictions', index=False)
        all_yearly_df.to_excel(writer, sheet_name='Yearly Predictions', index=False)
        all_patterns_df.to_excel(writer, sheet_name='Customer Insights', index=False)

        wb = writer.book
        for sheet_name in ['Historical Summary', 'Monthly Predictions', 'Yearly Predictions', 'Customer Insights']:
            style_sheet(wb[sheet_name])

    print("\n" + "="*40)
    print(f"SUCCESS! 2026 Forecast generated.")
    
    total_2025 = historical_summary[historical_summary['Year'] == global_max_year]['Number of Bookings'].sum()
    total_2026 = all_monthly_df['Predicted Monthly Bookings'].sum()
    global_growth = None  # Full-year comparison unavailable
    best_month = all_monthly_df.groupby('Month Name')['Predicted Monthly Bookings'].sum().idxmax()
    
    print("-" * 40)
    print(f"PROJECTED 2026 TOTAL:  {int(total_2026):,}")
    print("ANNUAL GROWTH:         Not Comparable (2025 data incomplete)")
    print(f"PEAK SEASON MONTH:     {best_month}")
    print("-" * 40)
    print(f"Report Saved: {output_file}")
    print("="*40)
    print("\nYou can now open the file in Excel to view detailed insights.\n")
except PermissionError:
    print(f"\nERROR: Permission denied. Please close {output_file} in Excel and run the script again.")
except Exception as e:
    print(f"\nERROR: Could not save the Excel file: {e}")
