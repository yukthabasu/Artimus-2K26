from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes so the frontend can communicate with it

DB_FILE = str(__import__("pathlib").Path(__file__).resolve().parent.parent / "registrations.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
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
    ''')
    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    # Basic validation for required fields
    required_fields = ['full_name', 'email', 'phone', 'college', 'year', 'department', 'events']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400

    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        
        c.execute('''
            INSERT INTO registrations (
                full_name, email, phone, college, year, department, events,
                team_member_1_name, team_member_1_email,
                team_member_2_name, team_member_2_email,
                team_member_3_name, team_member_3_email
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('full_name'), data.get('email'), data.get('phone'),
            data.get('college'), data.get('year'), data.get('department'),
            data.get('events'),
            data.get('team_member_1_name'), data.get('team_member_1_email'),
            data.get('team_member_2_name'), data.get('team_member_2_email'),
            data.get('team_member_3_name'), data.get('team_member_3_email')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Registration successful!", "status": "success"}), 201
        
    except sqlite3.Error as e:
        return jsonify({"error": "Database error occurred. Please try again later."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on localhost, port 5000
    app.run(debug=True, port=5000)

