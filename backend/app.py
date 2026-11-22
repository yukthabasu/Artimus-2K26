import os
import sqlite3
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from openpyxl import load_workbook

app = Flask(__name__)
# Enable CORS for all routes so the frontend can communicate seamlessly
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Project paths
PROJECT_DIR = Path(__file__).resolve().parent.parent
DB_FILE = PROJECT_DIR / "registrations.db"
FORECAST_FILE = PROJECT_DIR / "Artimus_2027_Forecast_Workbook.xlsx"

# Excel sheet names
FORECAST_SHEET = "2027 Forecast"
HISTORICAL_SHEET = "Historical Data"
METHOD_SHEET = "Read Me - Method"

# In-memory cache tracking file modification time
_cache = {
    "mtime": None,
    "forecast_records": None,
    "historical_records": None
}


def init_db():
    """Initialize SQLite database for student registrations if not present."""
    conn = sqlite3.connect(str(DB_FILE))
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            college TEXT NOT NULL,
            year TEXT NOT NULL,
            department TEXT NOT NULL,
            events TEXT NOT NULL,
            team_member_1_name TEXT,
            team_member_1_email TEXT,
            team_member_2_name TEXT,
            team_member_2_email TEXT,
            team_member_3_name TEXT,
            team_member_3_email TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


init_db()


def load_workbook_data():
    """Load and cache forecast and historical records from the Excel workbook."""
    if not FORECAST_FILE.exists():
        raise FileNotFoundError(
            f"Forecast workbook '{FORECAST_FILE.name}' not found at {FORECAST_FILE}."
        )

    current_mtime = os.path.getmtime(FORECAST_FILE)
    if _cache["mtime"] == current_mtime and _cache["forecast_records"] is not None:
        return _cache["forecast_records"], _cache["historical_records"]

    wb = load_workbook(FORECAST_FILE, read_only=True, data_only=True)
    try:
        if FORECAST_SHEET not in wb.sheetnames:
            raise ValueError(
                f"Required sheet '{FORECAST_SHEET}' is missing from the forecast workbook."
            )

        # 1. Parse 2027 Forecast Sheet
        ws_forecast = wb[FORECAST_SHEET]
        headers_forecast = [
            ws_forecast.cell(7, col).value
            for col in range(1, ws_forecast.max_column + 1)
        ]

        forecast_records = []
        for row in ws_forecast.iter_rows(min_row=8, values_only=True):
            if not row or row[0] is None:
                continue
            rec = dict(zip(headers_forecast, row))
            forecast_records.append({
                "customer_id": rec.get("Customer ID"),
                "year": rec.get("Forecast Year"),
                "month_number": rec.get("Month Number"),
                "month": rec.get("Month"),
                "forecast_bookings": rec.get("Forecast Bookings"),
                "historical_low": rec.get("Historical Low"),
                "historical_high": rec.get("Historical High"),
                "years_with_recorded_bookings": rec.get("Years with Recorded Bookings"),
                "confidence": rec.get("Confidence"),
                "status": rec.get("Forecast Status"),
                "calculation_basis": rec.get("Calculation Basis")
            })

        # 2. Parse Historical Data Sheet (if present)
        historical_records = []
        if HISTORICAL_SHEET in wb.sheetnames:
            ws_hist = wb[HISTORICAL_SHEET]
            headers_hist = [
                ws_hist.cell(4, col).value
                for col in range(1, ws_hist.max_column + 1)
            ]
            for row in ws_hist.iter_rows(min_row=5, values_only=True):
                if not row or row[0] is None:
                    continue
                rec = dict(zip(headers_hist, row))
                historical_records.append({
                    "customer_id": rec.get("Customer ID"),
                    "year": rec.get("Year"),
                    "month_number": rec.get("Month Number"),
                    "month": rec.get("Month"),
                    "actual_bookings": rec.get("Actual Bookings") or 0,
                    "data_status": rec.get("Data Status")
                })

        _cache["mtime"] = current_mtime
        _cache["forecast_records"] = forecast_records
        _cache["historical_records"] = historical_records

        return forecast_records, historical_records

    finally:
        wb.close()


def read_forecast():
    """Helper to retrieve forecast records."""
    f_records, _ = load_workbook_data()
    return f_records


def read_historical():
    """Helper to retrieve historical records."""
    _, h_records = load_workbook_data()
    return h_records


# ==========================================
# ENDPOINT: HEALTH CHECK
# ==========================================
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "Artimus Flask backend is running."
    })


# ==========================================
# ENDPOINT: STUDENT REGISTRATION
# ==========================================
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    required_fields = [
        "full_name", "email", "phone", "college",
        "year", "department", "events"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "status": "error",
                "error": f"Missing required field: {field}"
            }), 400

    try:
        conn = sqlite3.connect(str(DB_FILE))
        c = conn.cursor()
        c.execute("""
            INSERT INTO registrations (
                full_name, email, phone, college, year,
                department, events,
                team_member_1_name, team_member_1_email,
                team_member_2_name, team_member_2_email,
                team_member_3_name, team_member_3_email
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("full_name"),
            data.get("email"),
            data.get("phone"),
            data.get("college"),
            data.get("year"),
            data.get("department"),
            data.get("events"),
            data.get("team_member_1_name"),
            data.get("team_member_1_email"),
            data.get("team_member_2_name"),
            data.get("team_member_2_email"),
            data.get("team_member_3_name"),
            data.get("team_member_3_email")
        ))
        conn.commit()
        reg_id = c.lastrowid
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Registration successful!",
            "registration_id": reg_id
        }), 201

    except sqlite3.Error as e:
        app.logger.exception("Database registration error")
        return jsonify({
            "status": "error",
            "error": "Database error occurred. Please try again."
        }), 500


# ==========================================
# ENDPOINT: FORECAST SUMMARY
# ==========================================
@app.route("/api/forecast/summary", methods=["GET"])
def forecast_summary():
    try:
        records = read_forecast()
        available = [r for r in records if r["forecast_bookings"] is not None]

        total_bookings = sum(r["forecast_bookings"] for r in available)
        customers = sorted(set(r["customer_id"] for r in records))

        # Sort months by chronological month_number
        months_dict = {}
        for r in available:
            if r["month"] not in months_dict:
                months_dict[r["month"]] = r["month_number"]
        sorted_months = sorted(months_dict.keys(), key=lambda m: months_dict[m])

        # Monthly breakdown
        monthly_breakdown = {}
        for m in sorted_months:
            monthly_breakdown[m] = sum(
                r["forecast_bookings"] for r in available if r["month"] == m
            )

        return jsonify({
            "status": "success",
            "forecast_year": 2027,
            "customers_analysed": len(customers),
            "months_forecasted": len(sorted_months),
            "forecasted_months": sorted_months,
            "total_estimated_bookings": total_bookings,
            "accuracy": "Not evaluated",
            "data_type": "Baseline estimates, not confirmed bookings",
            "unavailable_months": [
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ],
            "monthly_breakdown": monthly_breakdown,
            "historical_transactions": 5876,
            "historical_years": [2024, 2025]
        })

    except FileNotFoundError as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 404
    except ValueError as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500
    except Exception:
        app.logger.exception("Forecast summary failed")
        return jsonify({
            "status": "error",
            "error": "Unable to calculate forecast summary."
        }), 500


# ==========================================
# ENDPOINT: MONTHLY / DETAILED FORECAST
# ==========================================
@app.route("/api/forecast", methods=["GET"])
def get_forecast():
    try:
        records = read_forecast()

        # Optional customer_id filter
        customer_id = request.args.get("customer_id")
        if customer_id:
            try:
                customer_id = int(customer_id)
            except ValueError:
                return jsonify({
                    "status": "error",
                    "error": "customer_id must be an integer."
                }), 400
            records = [r for r in records if r["customer_id"] == customer_id]

        # Optional month filter
        month_param = request.args.get("month")
        if month_param:
            records = [
                r for r in records
                if r["month"].lower() == month_param.lower() or str(r["month_number"]) == month_param
            ]

        # Compute aggregate totals for the forecasted months
        available = [r for r in records if r["forecast_bookings"] is not None]
        month_totals = []
        for m_num, m_name in [(1, "January"), (2, "February"), (3, "March")]:
            m_sum = sum(
                r["forecast_bookings"] for r in available if r["month_number"] == m_num
            )
            month_totals.append({
                "month": m_name,
                "month_number": m_num,
                "forecast_bookings": m_sum
            })

        return jsonify({
            "status": "success",
            "forecast_year": 2027,
            "forecast_coverage": "January-March",
            "forecast_records": len(records),
            "total_estimated_bookings": sum(r["forecast_bookings"] for r in available),
            "monthly_totals": month_totals,
            "data": records
        })

    except FileNotFoundError as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 404
    except ValueError as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500
    except Exception:
        app.logger.exception("Forecast retrieval failed")
        return jsonify({
            "status": "error",
            "error": "Unable to read forecast workbook."
        }), 500


# ==========================================
# ENDPOINT: CUSTOMER-WISE FORECAST
# ==========================================
@app.route("/api/forecast/customers", methods=["GET"])
def forecast_customers():
    try:
        records = read_forecast()
        customer_ids = sorted(set(r["customer_id"] for r in records))

        customers = []
        for cid in customer_ids:
            c_rows = [r for r in records if r["customer_id"] == cid]
            avail = [r for r in c_rows if r["forecast_bookings"] is not None]

            # Monthly breakdown for this customer
            breakdown = {}
            for r in avail:
                breakdown[r["month"]] = r["forecast_bookings"]

            confidence_list = [r["confidence"] for r in avail if r.get("confidence")]
            dominant_confidence = confidence_list[0] if confidence_list else "Low"

            customers.append({
                "customer_id": cid,
                "forecast_year": 2027,
                "estimated_bookings": sum(r["forecast_bookings"] for r in avail),
                "months_forecasted": len(avail),
                "forecasted_months": [r["month"] for r in avail],
                "monthly_breakdown": breakdown,
                "confidence": dominant_confidence,
                "forecast_status": "Partial baseline estimate"
            })

        # Sort customers by estimated_bookings descending by default for ease of analysis
        return jsonify({
            "status": "success",
            "forecast_year": 2027,
            "total_customers": len(customers),
            "customers": customers
        })

    except FileNotFoundError as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 404
    except Exception:
        app.logger.exception("Customer forecast failed")
        return jsonify({
            "status": "error",
            "error": "Unable to retrieve customer forecasts."
        }), 500


# ==========================================
# ENDPOINT: HISTORICAL DATA & TRENDS
# ==========================================
@app.route("/api/forecast/historical", methods=["GET"])
def forecast_historical():
    try:
        hist_records = read_historical()
        forecast_records = read_forecast()

        # Monthly trends aggregated across all customers
        monthly_trends = []
        for year in [2024, 2025]:
            for m_num, m_name in [(1, "January"), (2, "February"), (3, "March")]:
                sum_bookings = sum(
                    r["actual_bookings"]
                    for r in hist_records
                    if r["year"] == year and r["month_number"] == m_num
                )
                monthly_trends.append({
                    "year": year,
                    "month": m_name,
                    "month_number": m_num,
                    "actual_bookings": sum_bookings
                })

        # Comparison between 2024 actual, 2025 actual, and 2027 forecast
        f_avail = [r for r in forecast_records if r["forecast_bookings"] is not None]
        comparison = []
        for m_num, m_name in [(1, "January"), (2, "February"), (3, "March")]:
            act_2024 = sum(
                r["actual_bookings"]
                for r in hist_records
                if r["year"] == 2024 and r["month_number"] == m_num
            )
            act_2025 = sum(
                r["actual_bookings"]
                for r in hist_records
                if r["year"] == 2025 and r["month_number"] == m_num
            )
            fc_2027 = sum(
                r["forecast_bookings"]
                for r in f_avail
                if r["month_number"] == m_num
            )
            comparison.append({
                "month": m_name,
                "month_number": m_num,
                "actual_2024": act_2024,
                "actual_2025": act_2025,
                "forecast_2027": fc_2027
            })

        # Customer pattern summaries (top historical customers)
        customer_ids = sorted(set(r["customer_id"] for r in hist_records))
        customer_patterns = []
        for cid in customer_ids:
            c_hist = [r for r in hist_records if r["customer_id"] == cid]
            total_2024 = sum(r["actual_bookings"] for r in c_hist if r["year"] == 2024)
            total_2025 = sum(r["actual_bookings"] for r in c_hist if r["year"] == 2025)
            c_f = [r for r in f_avail if r["customer_id"] == cid]
            f_2027 = sum(r["forecast_bookings"] for r in c_f)

            customer_patterns.append({
                "customer_id": cid,
                "actual_2024": total_2024,
                "actual_2025": total_2025,
                "total_historical": total_2024 + total_2025,
                "forecast_2027": f_2027
            })

        customer_patterns.sort(key=lambda x: x["total_historical"], reverse=True)

        return jsonify({
            "status": "success",
            "total_historical_transactions": 5876,
            "years": [2024, 2025],
            "months": ["January", "February", "March"],
            "yearly_totals": {
                "2024": sum(r["actual_bookings"] for r in hist_records if r["year"] == 2024),
                "2025": sum(r["actual_bookings"] for r in hist_records if r["year"] == 2025)
            },
            "monthly_trends": monthly_trends,
            "comparison": comparison,
            "customer_patterns": customer_patterns
        })

    except FileNotFoundError as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 404
    except Exception:
        app.logger.exception("Historical retrieval failed")
        return jsonify({
            "status": "error",
            "error": "Unable to retrieve historical analytics."
        }), 500


# ==========================================
# STATIC FRONTEND SERVING
# ==========================================
@app.route("/", methods=["GET"])
def index():
    return send_from_directory(PROJECT_DIR, "index.html")


@app.route("/<path:path>", methods=["GET"])
def static_files(path):
    safe_extensions = (
        ".html", ".css", ".js", ".png", ".jpg", ".jpeg",
        ".gif", ".svg", ".ico", ".otf", ".ttf", ".woff", ".woff2"
    )
    file_path = PROJECT_DIR / path
    if (
        file_path.exists()
        and file_path.is_file()
        and any(path.lower().endswith(ext) for ext in safe_extensions)
    ):
        return send_from_directory(PROJECT_DIR, path)
    return jsonify({"status": "error", "error": "Not found"}), 404


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
