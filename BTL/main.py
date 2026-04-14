import flask
from flask import request, jsonify
from flask_cors import CORS
import pyodbc

app = flask.Flask(__name__)
CORS(app)

# ================= KẾT NỐI DATABASE =================
conn = pyodbc.connect(
    "DRIVER={SQL Server};SERVER=127.0.0.1;DATABASE=QuizDB;UID=sa;PWD=HuyPhu@999;TrustServerCertificate=yes;"
)

# ================= LOGIN =================
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Users WHERE username=? AND password=?", (username, password))
        row = cursor.fetchone()

        if row:
            return jsonify({
                "id": row.id,
                "username": row.username,
                "role": row.role
            })
        else:
            return jsonify({"error": "Sai tài khoản hoặc mật khẩu"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= LẤY DANH SÁCH KỲ THI =================
@app.route('/api/exams', methods=['GET'])
def get_exams():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Exams")

        data = []
        for row in cursor.fetchall():
            data.append({
                "id": row.id,
                "name": row.name
            })

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= ADMIN: THÊM KỲ THI =================
@app.route('/api/exams', methods=['POST'])
def add_exam():
    try:
        data = request.json
        name = data.get("name")

        cursor = conn.cursor()
        cursor.execute("INSERT INTO Exams(name) VALUES(?)", name)
        conn.commit()

        return jsonify({"message": "Thêm kỳ thi thành công"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= ADMIN: XÓA KỲ THI =================
@app.route('/api/exams/<int:id>', methods=['DELETE'])
def delete_exam(id):
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Exams WHERE id=?", id)
        conn.commit()

        return jsonify({"message": "Xóa thành công"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= ADMIN: THÊM CÂU HỎI =================
@app.route('/api/questions', methods=['POST'])
def add_question():
    try:
        data = request.json

        exam_id = data.get("exam_id")
        question = data.get("question")
        a = data.get("a")
        b = data.get("b")
        c = data.get("c")
        d = data.get("d")
        correct = data.get("correct")

        score = int(data.get("score", 1))  # 👈 ép kiểu cho chắc

        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Questions(exam_id, question, a, b, c, d, correct, score)
            VALUES(?,?,?,?,?,?,?,?)
        """, (exam_id, question, a, b, c, d, correct, score))  # 👈 ĐÚNG SỐ LƯỢNG

        conn.commit()

        return jsonify({"message": "Thêm câu hỏi thành công"})

    except Exception as e:
        print(e)  # 👈 in lỗi ra terminal
        return jsonify({"error": str(e)}), 500

# ================= LẤY CÂU HỎI THEO KỲ THI =================
@app.route('/api/exam/<int:exam_id>', methods=['GET'])
def get_exam(exam_id):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Questions WHERE exam_id=?", exam_id)

        data = []
        for row in cursor.fetchall():
            data.append({
                "id": row.id,
                "question": row.question,
                "a": row.a,
                "b": row.b,
                "c": row.c,
                "d": row.d,
                "correct": row.correct,  # 👈 THIẾU DÒNG NÀY
                "score": row.score  # 👈 THÊM LUÔN
            })

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= NỘP BÀI =================
@app.route('/api/submit', methods=['POST'])
def submit():
    try:
        data = request.json
        answers = data.get("answers")
        user_id = data.get("user_id")
        exam_id = data.get("exam_id")

        score = 0
        cursor = conn.cursor()

        for ans in answers:
            cursor.execute("SELECT correct FROM Questions WHERE id=?", ans["id"])
            correct = cursor.fetchone()[0]

            if correct == ans["answer"]:
                score += 1

        total = len(answers)

        cursor.execute("""
            INSERT INTO Results(user_id, exam_id, score, total)
            VALUES(?,?,?,?)
        """, (user_id, exam_id, score, total))

        conn.commit()

        return jsonify({
            "score": score,
            "total": total
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= XEM LỊCH SỬ =================
@app.route('/api/results/<int:user_id>', methods=['GET'])
def get_results(user_id):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.score, r.total, r.created_at, e.name
            FROM Results r
            JOIN Exams e ON r.exam_id = e.id
            WHERE r.user_id = ?
            ORDER BY r.id DESC
        """, user_id)

        data = []
        for row in cursor.fetchall():
            data.append({
                "exam": row.name,
                "score": row.score,
                "total": row.total,
                "date": str(row.created_at)
            })

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ================= XÓA CÂU HỎI =================
@app.route('/api/questions/<int:id>', methods=['DELETE'])
def delete_question(id):
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Questions WHERE id=?", id)
        conn.commit()

        return jsonify({"message": "Xóa câu hỏi thành công"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/classes', methods=['GET'])
def get_classes():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Classes")

    data = []
    for row in cursor.fetchall():
        data.append({
            "id": row.id,
            "name": row.name
        })

    return jsonify(data)

@app.route('/api/classes/<int:class_id>/scores', methods=['GET'])
def class_scores(class_id):
    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                u.username,
                e.name AS exam,
                r.score,
                r.total,
                r.created_at
            FROM ClassStudents cs
            JOIN Users u ON cs.user_id = u.id
            LEFT JOIN Results r ON r.user_id = u.id
            LEFT JOIN Exams e ON r.exam_id = e.id
            WHERE cs.class_id = ? AND e.class_id = ?
            ORDER BY u.username
        """, (class_id, class_id))

        data = []
        for row in cursor.fetchall():
            data.append({
                "student": row.username,
                "exam": row.exam,
                "score": row.score if row.score else 0,
                "total": row.total if row.total else 0,
                "date": str(row.created_at) if row.created_at else ""
            })

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#them lop
@app.route('/api/classes', methods=['POST'])
def add_class():
    data = request.json
    name = data.get("name")

    cursor = conn.cursor()
    cursor.execute("INSERT INTO Classes(name) VALUES(?)", name)
    conn.commit()

    return jsonify({"message": "Tạo lớp thành công"})
#sua lop
@app.route('/api/classes/<int:id>', methods=['PUT'])
def update_class(id):
    data = request.json
    name = data.get("name")

    cursor = conn.cursor()
    cursor.execute("UPDATE Classes SET name=? WHERE id=?", (name, id))
    conn.commit()

    return jsonify({"message": "Cập nhật thành công"})
#xoa lớp
@app.route('/api/classes/<int:id>', methods=['DELETE'])
def delete_class(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Classes WHERE id=?", id)
    conn.commit()

    return jsonify({"message": "Xóa thành công"})

# ================= CHẠY SERVER =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)