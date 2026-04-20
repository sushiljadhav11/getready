from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection, init_db
import json
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})

init_db()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields."}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, hashed_password))
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"error": "Email already exists or DB error."}), 409
    
    conn.close()
    return jsonify({"message": "User registered successfully."}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email == 'ece018@gmail.com' and password == 'ece504':
        return jsonify({
            "message": "Teacher Login successful.",
            "user": {
                "id": 9999,
                "name": "System Admin",
                "email": email,
                "role": "teacher"
            }
        }), 200

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        return jsonify({
            "message": "Login successful.",
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "role": "student"
            }
        }), 200
    else:
        return jsonify({"error": "Invalid email or password."}), 401

@app.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    users = conn.execute('SELECT id, name, email, enrolledDate FROM users').fetchall()
    conn.close()

    students_list = [dict(row) for row in users]
    return jsonify(students_list), 200

@app.route('/api/questions/mock', methods=['GET'])
def get_mock_questions():
    topics = request.args.get('topics')
    if not topics:
        return jsonify({"error": "No topics provided."}), 400
    
    topic_list = topics.split(',')
    placeholders = ','.join('?' for _ in topic_list)
    
    conn = get_db_connection()
    query = f"SELECT * FROM questions WHERE topic_id IN ({placeholders}) ORDER BY RANDOM() LIMIT 10"
    questions = conn.execute(query, topic_list).fetchall()
    conn.close()

    formatted_questions = []
    for q in questions:
        formatted_questions.append({
            "id": q["id"],
            "topic_id": q["topic_id"],
            "q": q["question_text"],
            "options": json.loads(q["options"]),
            "answer": q["correct_index"]
        })
    return jsonify(formatted_questions), 200

@app.route('/api/questions/<topic_id>', methods=['GET'])
def get_questions(topic_id):
    conn = get_db_connection()
    # Select randomly up to 10 questions for the topic
    questions = conn.execute('SELECT * FROM questions WHERE topic_id = ? ORDER BY RANDOM() LIMIT 10', (topic_id,)).fetchall()
    conn.close()

    formatted_questions = []
    for q in questions:
        formatted_questions.append({
            "id": q["id"],
            "q": q["question_text"],
            "options": json.loads(q["options"]),
            "answer": q["correct_index"]
        })
    return jsonify(formatted_questions), 200

@app.route('/api/leaderboard', methods=['POST'])
def submit_score():
    data = request.json
    user_id = data.get('user_id')
    topic_id = data.get('topic_id')
    score = data.get('score')
    time_taken = data.get('time_taken')

    if not all([user_id, topic_id, score is not None, time_taken is not None]):
         return jsonify({"error": "Missing required fields."}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute('INSERT INTO leaderboard (user_id, topic_id, score, time_taken) VALUES (?, ?, ?, ?)', (user_id, topic_id, score, time_taken))
    conn.commit()
    conn.close()

    return jsonify({"message": "Score submitted successfully."}), 201

@app.route('/api/leaderboard/<topic_id>', methods=['GET'])
def get_leaderboard(topic_id):
    conn = get_db_connection()
    # Rank by score DESC, time_taken ASC
    query = '''
        SELECT u.name, l.score, l.time_taken, l.created_at
        FROM leaderboard l
        JOIN users u ON l.user_id = u.id
        WHERE l.topic_id = ?
        ORDER BY l.score DESC, l.time_taken ASC
        LIMIT 10
    '''
    leaders = conn.execute(query, (topic_id,)).fetchall()
    conn.close()

    return jsonify([dict(row) for row in leaders]), 200

@app.route('/api/notes/<topic_id>', methods=['GET'])
def get_notes(topic_id):
    try:
        with open(f"notes/{topic_id}.html", "r", encoding="utf-8") as f:
            return jsonify({"html": f.read()}), 200
    except FileNotFoundError:
        return jsonify({"html": "<p>Deep dive notes for this topic are currently being engineered.</p>"}), 404

@app.route('/api/dsa/progress/<user_id>', methods=['GET'])
def get_dsa_progress(user_id):
    conn = get_db_connection()
    progress = conn.execute('SELECT question_id, is_done FROM dsa_progress WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in progress]), 200

@app.route('/api/dsa/progress', methods=['POST'])
def toggle_dsa_progress():
    data = request.json
    user_id = data.get('user_id')
    question_id = data.get('question_id')
    is_done = data.get('is_done')

    if not user_id or not question_id or is_done is None:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''
            INSERT INTO dsa_progress (user_id, question_id, is_done)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, question_id) DO UPDATE SET is_done = excluded.is_done
        ''', (user_id, question_id, is_done))
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500
    conn.close()

    return jsonify({"message": "Progress updated"}), 200

@app.route('/api/teacher/student/<int:student_id>/analytics', methods=['GET'])
def get_student_analytics(student_id):
    conn = get_db_connection()
    
    # Get all leaderboard entries
    leaderboard_data = conn.execute('SELECT topic_id, score, time_taken, created_at FROM leaderboard WHERE user_id = ? ORDER BY created_at DESC', (student_id,)).fetchall()
    
    # Get all completed DSA questions
    dsa_data = conn.execute('SELECT question_id FROM dsa_progress WHERE user_id = ? AND is_done = 1', (student_id,)).fetchall()
    
    conn.close()

    formatted_leaderboard = [dict(row) for row in leaderboard_data]
    formatted_dsa = [row['question_id'] for row in dsa_data]

    return jsonify({
        "leaderboard": formatted_leaderboard,
        "dsa_completed": len(formatted_dsa),
        "dsa_questions": formatted_dsa
    }), 200

# ── Teacher Test APIs ─────────────────────────────────────────────────

@app.route('/api/teacher/tests', methods=['POST'])
def create_teacher_test():
    data = request.json
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    questions = data.get('questions', [])

    if not title or not questions:
        return jsonify({"error": "Title and questions are required."}), 400

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO teacher_tests (title, description, questions) VALUES (?, ?, ?)',
        (title, description, json.dumps(questions))
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Test created successfully."}), 201

@app.route('/api/teacher/tests', methods=['GET'])
def list_teacher_tests():
    conn = get_db_connection()
    tests = conn.execute('SELECT id, title, description, created_at FROM teacher_tests ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(t) for t in tests]), 200

@app.route('/api/teacher/tests/<int:test_id>', methods=['GET'])
def get_teacher_test(test_id):
    conn = get_db_connection()
    test = conn.execute('SELECT * FROM teacher_tests WHERE id = ?', (test_id,)).fetchone()
    conn.close()
    if not test:
        return jsonify({"error": "Test not found."}), 404
    t = dict(test)
    t['questions'] = json.loads(t['questions'])
    return jsonify(t), 200

@app.route('/api/teacher/tests/<int:test_id>/submit', methods=['POST'])
def submit_teacher_test(test_id):
    data = request.json
    user_id = data.get('user_id')
    score = data.get('score')
    total = data.get('total')
    time_taken = data.get('time_taken', 0)

    if user_id is None or score is None or total is None:
        return jsonify({"error": "Missing fields."}), 400

    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT OR REPLACE INTO teacher_test_results (test_id, user_id, score, total, time_taken) VALUES (?, ?, ?, ?, ?)',
            (test_id, user_id, score, total, time_taken)
        )
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500
    conn.close()
    return jsonify({"message": "Score submitted."}), 200

@app.route('/api/teacher/tests/<int:test_id>/results', methods=['GET'])
def get_teacher_test_results(test_id):
    conn = get_db_connection()
    rows = conn.execute('''
        SELECT u.name, u.email, r.score, r.total, r.time_taken, r.submitted_at
        FROM teacher_test_results r
        JOIN users u ON u.id = r.user_id
        WHERE r.test_id = ?
        ORDER BY r.score DESC, r.time_taken ASC
    ''', (test_id,)).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows]), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
