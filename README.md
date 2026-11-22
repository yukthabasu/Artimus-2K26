# ARTIMUS 2K26

A college technical symposium website featuring event information, online registrations and a machine learning-based booking forecasting system.

## Project Features

- Responsive symposium website
- Event information and interactive event popups
- Student coordinator contact information
- Online event registration
- Flask backend
- SQLite database for registration storage
- Machine learning-based booking demand forecasting
- Monthly and yearly booking predictions
- Excel forecasting reports

## Technologies Used

- HTML, CSS and JavaScript
- Python
- Flask and Flask-CORS
- SQLite
- Pandas and NumPy
- Facebook Prophet
- OpenPyXL

## Event Details

**Event:** Artimus 2K26  
**Date:** 30–31 December 2026  
**Time:** 10:00 AM – 10:00 AM  
**Venue:** Seminar Hall, Student Activity Center (SAC)  
**College:** Dayananda Sagar Academy of Technology and Management

## Machine Learning Module

The forecasting module analyses historical customer booking data and uses Prophet time-series forecasting to estimate monthly booking demand for 2026.

It generates:
- Monthly predictions
- Yearly summaries
- Customer insights
- Forecast confidence labels
- Excel reports

## Installation

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the forecasting module:

```bash
python prediction_clean.py
```

Run the Flask backend:

```bash
python backend/app.py
```

Run the frontend:

```bash
python -m http.server 5501
```

Open `http://localhost:5501/index.html` in your browser.

## Repository

GitHub: https://github.com/yukthabasu/Artimus-2K26

## Note

The registration database is excluded from the public Git tracking rules to protect registration information. Create a local database through the backend before testing registrations.