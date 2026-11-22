# ARTIMUS 2K26 — Full-Stack Technical Symposium & ML Forecasting Platform

Welcome to **Artimus 2K26**, a production-ready, full-stack event portal inspired by the Arcane / Piltover & Zaun aesthetic, integrated with a genuine Machine-Learning customer booking forecasting system and live online student registration portal.

---

## 🌟 Key Features

### 1. Symposium Event Website
- **Arcane & Piltover Design Language**: Dark cyber-aesthetic (`#0b1120`), gold & brass neon glows, particle canvas ("Spider Web") background, and aesthetic rotating hero visuals.
- **Dynamic Countdown Timer**: Real-time ticker counting down to December 30, 2026.
- **Interactive Event Catalog**: 8 symposium competitions (Prompt Arena, Cipher Run, Glitch Hunt, Code Forge, PowerPlay Draft, Chaos Carnival, Jinx Playground, and SoundStorm) with category filtering and interactive rules modals.
- **Student Registration Portal**: Multi-field form validating student information, college details, event selection, and optional team members, saving directly to an SQLite database (`registrations.db`).

### 2. Machine-Learning Forecast Dashboard
- **Direct Workbook Integration**: Genuinely connected to `Artimus_2027_Forecast_Workbook.xlsx` (no hardcoded metrics or fake random numbers).
- **Executive KPI Cards**:
  - Total Estimated Bookings: **2,950** (Q1 2027 Baseline Total)
  - Customers Analysed: **17** historical client accounts
  - Forecast Horizon: **3 Months** (January, February, March 2027)
  - Forecast Year: **2027**
  - Accuracy Status: **Not evaluated** (cautious baseline, no unsubstantiated claims)
- **Monthly Demand Visualizations**:
  - January 2027: **1,271** bookings (43.1% share)
  - February 2027: **1,296** bookings (43.9% share)
  - March 2027: **383** bookings (13.0% share)
  - Interactive Chart.js visualization with instantaneous **Bar View** / **Trend Line** toggle and custom Arcane dark tooltips.
- **Historical Analysis & Trend Comparisons**:
  - Multi-year comparison chart displaying **2024 Actuals (916)** vs **2025 Actuals (4,960)** vs **2027 Baseline Forecast (2,950)**.
  - Pattern analytics highlighting the +441% growth factor in 2025 and account volume concentrations (Customer #43 with 4,000+ bookings).
- **Customer-Wise Directory**:
  - Instant live search by Customer ID.
  - Volume tier filter: High (>100), Medium (20–100), Low (<20).
  - Modal breakdown detailing individual customer forecasts across Jan, Feb, and Mar.
- **Methodology & Limitations Transparency**:
  - Explains the 5,876 transaction records from `Prediction.xlsx`.
  - Explains why April–December are explicitly unforecasted due to zero historical source coverage.
  - Transparently highlights the distinction: these are historical customer booking records, *not* predictions of Artimus symposium student registrations.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Modern CSS3 (CSS Grid, Flexbox, Glassmorphism), Vanilla JavaScript (ES6+), Chart.js (offline bundle).
- **Backend**: Python 3, Flask 3.0.3, Flask-CORS 4.0.0.
- **Data & Excel Processing**: OpenPyXL 3.1.5, Pandas, NumPy, Facebook Prophet.
- **Database**: SQLite3 (`registrations.db`).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure Python 3.9+ is installed on your system.

### 2. Install Dependencies
Open a terminal in the project root directory:

```bash
pip install -r requirements.txt
```

*(Or for backend-only dependencies: `pip install -r backend/requirements.txt`)*

### 3. Start the Flask Backend
Run the backend server from the project root:

```bash
python backend/app.py
```

The server will initialize on:
`http://127.0.0.1:5000/`

### 4. Launch the Website
The Flask backend serves both the API endpoints and the frontend website directly:

- Open your browser and navigate to:  
  **`http://127.0.0.1:5000/`**

*(Alternatively, if running the frontend separately via a static HTTP server: `python -m http.server 5501` and open `http://localhost:5501/index.html` — CORS is fully enabled to connect to the Flask API on port 5000).*

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/register` | Student event registration endpoint |
| `GET` | `/api/forecast/summary` | Q1 2027 forecast executive summary & KPIs |
| `GET` | `/api/forecast` | Detailed monthly forecast records (supports `?customer_id=X`) |
| `GET` | `/api/forecast/customers` | Customer-wise forecast directory & monthly breakdowns |
| `GET` | `/api/forecast/historical` | 2024 vs 2025 actuals, trend comparison & pattern insights |

### Sample Response: `GET /api/forecast/summary`

```json
{
  "status": "success",
  "forecast_year": 2027,
  "customers_analysed": 17,
  "months_forecasted": 3,
  "forecasted_months": ["January", "February", "March"],
  "total_estimated_bookings": 2950,
  "accuracy": "Not evaluated",
  "data_type": "Baseline estimates, not confirmed bookings",
  "historical_transactions": 5876,
  "historical_years": [2024, 2025]
}
```

---

## 🔒 Security & Privacy Practices

- **Registration Data Privacy**: Participant registration details in `registrations.db` are isolated and protected. The database is strictly excluded from version control via `.gitignore`.
- **Read-Only Data Integrity**: Forecasting endpoints read from `Artimus_2027_Forecast_Workbook.xlsx` in read-only mode to prevent corruption of source data.
- **Input Validation**: Student registration inputs are sanitized and validated server-side.

---

## 📁 Project Structure

```
Artimus_2K26_Final/
├── backend/
│   ├── app.py                     # Flask application & API routes
│   └── requirements.txt           # Backend dependencies
├── css/
│   └── style.css                  # Arcane/Hextech styling & responsive layouts
├── js/
│   ├── chart.min.js               # Local Chart.js library bundle (offline ready)
│   └── script.js                  # Frontend interactions, charts & API clients
├── images/                        # Character hosts, backgrounds & symposium logo
├── Artimus_2027_Forecast_Workbook.xlsx # 2027 Forecast Excel Workbook
├── Prediction.xlsx                # Historical 2024 & 2025 raw transaction records
├── forecast_clean_2026.xlsx       # Historical 2026 forecast workbook
├── prediction_clean.py            # Machine learning Prophet forecasting script
├── index.html                     # Main symposium webpage & ML Forecast Dashboard
├── requirements.txt               # Full project dependencies
├── .gitignore                     # Git ignore rules (protects DBs and backups)
└── README.md                      # Documentation
```
