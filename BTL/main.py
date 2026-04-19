import random

import flask
from flask import request, jsonify
from flask_cors import CORS
import pyodbc

app = flask.Flask(__name__)
CORS(app)

# ================= KẾT NỐI DATABASE =================
conn = pyodbc.connect(
    "DRIVER={SQL Server};SERVER=LAPTOP-F7NE9URR\SQLEXPRESS;DATABASE=QuizDB;Trusted_Connection=yes;TrustServerCertificate=yes;"
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




# ================= ADMIN: THÊM KỲ THI =================
@app.route('/api/exams/full', methods=['POST'])
def create_exam_full():
    try:
        data = request.json
        name = data.get("name")
        class_id = data.get("class_id")
        type = data.get("type")

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO Exams(name, class_id, type)
            OUTPUT INSERTED.id
            VALUES(?,?,?)
        """, (name, class_id, type))

        exam_id = cursor.fetchone()[0]  # 👈 LẤY ID

        conn.commit()

        return jsonify({
            "message": "OK",
            "exam_id": exam_id   # 👈 TRẢ VỀ FRONTEND
        })

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
@app.route('/api/exams', methods=['GET'])
def get_exams():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, class_id, type FROM Exams")

        data = []
        for row in cursor.fetchall():
            data.append({
                "id": row.id,
                "name": row.name,
                "class_id": row.class_id,   # 👈 THÊM
                "type": row.type            # 👈 THÊM
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


#lay bang diem
@app.route('/api/classes/<int:class_id>/table', methods=['GET'])
def class_table(class_id):
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            u.id,
            u.fullname,
            u.student_code,

            ISNULL(cs.a1,0),
            ISNULL(cs.a2,0),
            ISNULL(cs.a3,0),
            ISNULL(cs.a4,0),
            ISNULL(cs.a5,0),
            ISNULL(cs.a6,0),
            ISNULL(cs.a7,0),
            ISNULL(cs.a8,0),
            ISNULL(cs.a9,0),
            ISNULL(cs.a10,0),

            ISNULL(cs.midterm,0),
            ISNULL(cs.final,0)

        FROM ClassStudents cs2
        JOIN Users u ON cs2.user_id = u.id
        LEFT JOIN ClassScores cs 
            ON cs.user_id = u.id AND cs.class_id = cs2.class_id
        WHERE cs2.class_id = ?
    """, class_id)

    data = []
    for row in cursor.fetchall():
        data.append({
            "user_id": row[0],
            "name": row[1],
            "code": row[2],

            "a1": row[3],
            "a2": row[4],
            "a3": row[5],
            "a4": row[6],
            "a5": row[7],
            "a6": row[8],
            "a7": row[9],
            "a8": row[10],
            "a9": row[11],
            "a10": row[12],

            "midterm": row[13],
            "final": row[14]
        })

    return jsonify(data)

#lưu điểm
@app.route('/api/classes/<int:class_id>/save', methods=['POST'])
def save_scores(class_id):
    data = request.json
    cursor = conn.cursor()

    for s in data:
        cursor.execute("""
            IF EXISTS (
                SELECT * FROM ClassScores 
                WHERE class_id=? AND user_id=?
            )
                UPDATE ClassScores
                SET 
                    a1=?,a2=?,a3=?,a4=?,a5=?,
                    a6=?,a7=?,a8=?,a9=?,a10=?,
                    midterm=?, final=?
                WHERE class_id=? AND user_id=?
            ELSE
                INSERT INTO ClassScores(
                    class_id,user_id,
                    a1,a2,a3,a4,a5,
                    a6,a7,a8,a9,a10,
                    midterm,final
                )
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            class_id, s["user_id"],

            s["a1"], s["a2"], s["a3"], s["a4"], s["a5"],
            s["a6"], s["a7"], s["a8"], s["a9"], s["a10"],
            s["midterm"], s["final"],

            class_id, s["user_id"],

            class_id, s["user_id"],
            s["a1"], s["a2"], s["a3"], s["a4"], s["a5"],
            s["a6"], s["a7"], s["a8"], s["a9"], s["a10"],
            s["midterm"], s["final"]
        ))

    conn.commit()
    return jsonify({"message": "Đã lưu"})

#them sinhvien vao lop
@app.route('/api/classes/<int:class_id>/student', methods=['POST'])
def add_student(class_id):
    try:
        data = request.json
        code = data.get("code")
        name = data.get("name")

        print("DATA:", data)  # 👈 debug

        if not code or not name:
            return jsonify({"error":"Thiếu dữ liệu"}), 400

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO Users(username, password, role, fullname, student_code)
            OUTPUT INSERTED.id
            VALUES(?, '123', 'student', ?, ?)
        """, (code, name, code))

        user_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO ClassStudents(class_id, user_id)
            VALUES(?,?)
        """, (class_id, user_id))

        conn.commit()

        return jsonify({"message":"OK"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

#xoa sinhvien khoi lop
@app.route('/api/classes/<int:class_id>/student/<int:user_id>', methods=['DELETE'])
def delete_student(class_id, user_id):
    cursor = conn.cursor()

    cursor.execute("DELETE FROM ClassStudents WHERE class_id=? AND user_id=?",
                   (class_id, user_id))

    cursor.execute("DELETE FROM ClassScores WHERE class_id=? AND user_id=?",
                   (class_id, user_id))

    conn.commit()

    return jsonify({"message":"Deleted"})

#sua cau hoi
@app.route('/api/questions/<int:id>', methods=['PUT'])
def update_question(id):
    try:
        data = request.json

        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Questions
            SET question=?, a=?, b=?, c=?, d=?, correct=?
            WHERE id=?
        """, (
            data.get("question"),
            data.get("a"),
            data.get("b"),
            data.get("c"),
            data.get("d"),
            data.get("correct"),
            id
        ))

        conn.commit()

        return jsonify({"message":"Updated"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 1. Đảm bảo đúng route mà JS đang gọi
# ================= IMPORT DYNAMIC (ĐÃ SỬA LỖI) =================
@app.route('/api/questions/import-dynamic', methods=['POST'])
def import_dynamic_questions():
    try:
        data = request.json
        exam_id = data.get("exam_id")
        total_wanted = int(data.get("total_count", 10))
        sheets = data.get("sheets", [])

        cursor = conn.cursor()
        all_imported_questions = []

        for s in sheets:
            questions = s.get('questions', [])
            if not questions: continue

            percent = int(s.get('percent', 0))
            # Tính số câu dựa trên tỷ lệ % người dùng nhập
            num_to_take = int(total_wanted * (percent / 100))

            if num_to_take > 0:
                # Dùng min để tránh lấy quá số lượng câu đang có trong sheet
                sampled = random.sample(questions, min(num_to_take, len(questions)))
                all_imported_questions.extend(sampled)
            elif len(sheets) == 1:
                sampled = random.sample(questions, min(total_wanted, len(questions)))
                all_imported_questions.extend(sampled)

        if not all_imported_questions:
            return jsonify({"message": "Không có câu hỏi nào được chọn", "status": "error"}), 400

        for q in all_imported_questions:
            if not q.get('question'): continue
            cursor.execute("""
                INSERT INTO dbo.Questions (exam_id, question, a, b, c, d, correct, score)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                exam_id, q.get('question'), q.get('a'),
                q.get('b'), q.get('c'), q.get('d'), q.get('correct')
            ))

        conn.commit()
        return jsonify({
            "message": "Thành công",
            "status": "success",
            "count": len(all_imported_questions)
        })
    except Exception as e:
        print(f"Lỗi SQL: {e}")
        return jsonify({"error": str(e)}), 500

# ================= CHI TIẾT CÂU HỎI (ĐÃ SỬA LỖI ROUTE) =================


@app.route('/api/questions_detail/<int:id>', methods=['GET'])
def get_question_detail(id):
    cursor = conn.cursor()
    cursor.execute("SELECT id, question, a, b, c, d, correct FROM Questions WHERE id=?", (id,))
    row = cursor.fetchone()
    if row:
        return jsonify({
            "id": row.id,
            "question": row.question,
            "a": row.a,
            "b": row.b,
            "c": row.c,
            "d": row.d,
            "correct": row.correct
        })
    return jsonify({"error": "Không tìm thấy"}), 404
# ================= LẤY CÂU HỎI THEO KỲ THI =================
@app.route('/api/exam/<int:exam_id>', methods=['GET'])
def get_exam_by_id(exam_id):
    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, question, a, b, c, d, correct, score
            FROM Questions
            WHERE exam_id = ?
        """, (exam_id,))  # 👈 PHẢI có dấu phẩy

        data = []
        for row in cursor.fetchall():
            data.append({
                "id": row.id,
                "question": row.question,
                "a": row.a,
                "b": row.b,
                "c": row.c,
                "d": row.d,
                "correct": row.correct,
                "score": row.score
            })

        return jsonify(data)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

#random cau hoi
@app.route('/api/practice/random', methods=['GET'])
def practice_random():
    cursor = conn.cursor()
    cursor.execute("""
        SELECT TOP 10 * FROM Questions ORDER BY NEWID()
    """)

    data = []
    for row in cursor.fetchall():
        data.append({
            "id": row.id,
            "question": row.question,
            "a": row.a,
            "b": row.b,
            "c": row.c,
            "d": row.d,
            "correct": row.correct
        })

    return jsonify(data)


#tin tuc admin
from datetime import datetime, timedelta
@app.route('/api/news', methods=['GET'])
def get_news():

    now = datetime.now()

    data = [
        {
            "id":1,
            "title":"Đề Java 2026 thay đổi mạnh",
            "content":"Đề thi tập trung vào OOP, interface, đa hình và design pattern.",
            "image":"https://picsum.photos/600/300?1",
            "category":"Java",
            "time": str(now - timedelta(hours=2))
        },
        {
            "id":2,
            "title":"SQL nâng độ khó phần JOIN",
            "content":"INNER JOIN, LEFT JOIN và GROUP BY chiếm hơn 70% điểm.",
            "image":"https://picsum.photos/600/300?2",
            "category":"SQL",
            "time": str(now - timedelta(days=1))
        },
        {
            "id":3,
            "title":"Tips làm bài trắc nghiệm hiệu quả",
            "content":"Loại trừ đáp án sai giúp tăng khả năng đúng lên 60%.",
            "image":"https://picsum.photos/600/300?3",
            "category":"Tips",
            "time": str(now - timedelta(days=2))
        },
        {
            "id":4,
            "title":"Java Spring Boot sẽ vào đề",
            "content":"Sinh viên cần nắm REST API và MVC.",
            "image":"https://picsum.photos/600/300?4",
            "category":"Java",
            "time": str(now - timedelta(days=3))
        },
        {
            "id":5,
            "title":"SQL nâng cao: Subquery",
            "content":"Subquery và HAVING là phần trọng tâm.",
            "image":"https://picsum.photos/600/300?5",
            "category":"SQL",
            "time": str(now - timedelta(days=4))
        },
        {
            "id":6,
            "title":"Top 5 mẹo đạt điểm cao",
            "content":"Ôn tập theo dạng đề giúp tăng tốc độ làm bài.",
            "image":"https://picsum.photos/600/300?6",
            "category":"Tips",
            "time": str(now - timedelta(days=5))
        },
        {
            "id":7,
            "title":"Java Collections quan trọng",
            "content":"ArrayList, HashMap xuất hiện thường xuyên.",
            "image":"https://picsum.photos/600/300?7",
            "category":"Java",
            "time": str(now - timedelta(days=6))
        },
        {
            "id":8,
            "title":"SQL Index giúp tối ưu",
            "content":"Hiểu index giúp tăng tốc query đáng kể.",
            "image":"https://picsum.photos/600/300?8",
            "category":"SQL",
            "time": str(now - timedelta(days=7))
        },
        {
            "id":9,
            "title":"Chiến thuật làm bài nhanh",
            "content":"Phân bổ thời gian hợp lý là chìa khóa.",
            "image":"https://picsum.photos/600/300?9",
            "category":"Tips",
            "time": str(now - timedelta(days=8))
        },
        {
            "id":10,
            "title":"Java Exception Handling",
            "content":"Try-catch-finally gần như chắc chắn có.",
            "image":"https://picsum.photos/600/300?10",
            "category":"Java",
            "time": str(now - timedelta(days=9))
        }
    ]

    # sort mới nhất lên đầu
    data.sort(key=lambda x: x["time"], reverse=True)

    return jsonify(data)
# ================= THÊM LỊCH =================
@app.route('/api/schedule', methods=['POST'])
def add_schedule():
    data = request.json

    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Schedule(class_id, subject, teacher_id, day_of_week, start_time, end_time, room)
        VALUES(?,?,?,?,?,?,?)
    """, (
        data["class_id"],
        data["subject"],
        data["teacher_id"],
        data["day"],
        data["start"],
        data["end"],
        data["room"]
    ))

    conn.commit()
    return jsonify({"message":"OK"})
# ================= LẤY LỊCH =================
@app.route('/api/schedule/<int:teacher_id>', methods=['GET'])
def get_schedule(teacher_id):
    cursor = conn.cursor()

    cursor.execute("""
        SELECT s.*, c.name as class_name
        FROM Schedule s
        JOIN Classes c ON s.class_id = c.id
        WHERE teacher_id = ?
    """, (teacher_id,))

    data = []
    for row in cursor.fetchall():
        data.append({
            "id": row.id,
            "class": row.class_name,
            "subject": row.subject,
            "day": row.day_of_week,
            "start": str(row.start_time),
            "end": str(row.end_time),
            "room": row.room
        })

    return jsonify(data)

# ================= XÓA LỊCH =================
@app.route('/api/schedule/<int:id>', methods=['DELETE'])
def delete_schedule(id):
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Schedule WHERE id=?", (id,))
        conn.commit()

        return jsonify({"message": "Đã xóa"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ================= CHẠY SERVER =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)