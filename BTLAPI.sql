CREATE DATABASE QuizDB
GO
USE QuizDB
GO

-- USER
CREATE TABLE Users (
    id INT IDENTITY PRIMARY KEY,
    username NVARCHAR(50),
    password NVARCHAR(50),
    role NVARCHAR(10) -- admin / student
)

-- KỲ THI
CREATE TABLE Exams (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100)
)

-- CÂU HỎI
CREATE TABLE Questions (
    id INT IDENTITY PRIMARY KEY,
    exam_id INT,
    question NVARCHAR(255),
    a NVARCHAR(100),
    b NVARCHAR(100),
    c NVARCHAR(100),
    d NVARCHAR(100),
    correct CHAR(1)
)

-- KẾT QUẢ
CREATE TABLE Results (
    id INT IDENTITY PRIMARY KEY,
    user_id INT,
    exam_id INT,
    score INT,
    total INT,
    created_at DATETIME DEFAULT GETDATE()
)
INSERT INTO Users(username, password, role)
VALUES 
('admin', '123', 'admin'),
('sv1', '123', 'student')

INSERT INTO Exams(name)
VALUES ('Java'), ('SQL')

INSERT INTO Questions(exam_id, question, a, b, c, d, correct)
VALUES 
(1, N'2+2=?', '3','4','5','6','B'),
(1, N'5*2=?', '10','8','6','12','A'),
(2, N'SQL là gì?', 'Ngôn ngữ','Game','App','None','A')
ALTER TABLE Questions ADD score INT DEFAULT 1
UPDATE Questions SET score = 1
-- LỚP HỌC
CREATE TABLE Classes (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100)
)

-- HỌC SINH TRONG LỚP
CREATE TABLE ClassStudents (
    id INT IDENTITY PRIMARY KEY,
    class_id INT,
    user_id INT
)

-- GÁN LỚP CHO KỲ THI
ALTER TABLE Exams ADD class_id INT


INSERT INTO Classes(name)
VALUES ('Lớp Java 1'), ('Lớp SQL 1')

-- Gán học sinh vào lớp
INSERT INTO ClassStudents(class_id, user_id)
VALUES (1, 2)

-- Gán môn vào lớp
UPDATE Exams SET class_id = 1 WHERE id = 1
UPDATE Exams SET class_id = 2 WHERE id = 2

-- thêm thông tin sinh viên
ALTER TABLE Users ADD fullname NVARCHAR(100)
ALTER TABLE Users ADD student_code NVARCHAR(20)

-- bảng điểm lớp (quan trọng)
CREATE TABLE ClassScores (
    id INT IDENTITY PRIMARY KEY,
    class_id INT,
    user_id INT,
    attendance BIT DEFAULT 0,
    midterm FLOAT DEFAULT 0,
    final FLOAT DEFAULT 0
)

UPDATE Users 
SET fullname = N'Nguyễn Văn A', student_code = 'SV001'
WHERE id = 2

DECLARE @sql NVARCHAR(MAX)

SELECT @sql = 'ALTER TABLE ClassScores DROP CONSTRAINT ' + dc.name
FROM sys.default_constraints dc
JOIN sys.columns c 
    ON dc.parent_object_id = c.object_id 
    AND dc.parent_column_id = c.column_id
WHERE c.name = 'attendance' 
AND OBJECT_NAME(dc.parent_object_id) = 'ClassScores'

EXEC(@sql)

ALTER TABLE ClassScores DROP COLUMN attendance

ALTER TABLE ClassScores ADD 
    a1 BIT DEFAULT 0,
    a2 BIT DEFAULT 0,
    a3 BIT DEFAULT 0,
    a4 BIT DEFAULT 0,
    a5 BIT DEFAULT 0,
    a6 BIT DEFAULT 0,
    a7 BIT DEFAULT 0,
    a8 BIT DEFAULT 0,
    a9 BIT DEFAULT 0,
    a10 BIT DEFAULT 0

CREATE TABLE Tests (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100),
    class_id INT
)

ALTER TABLE Exams ADD type NVARCHAR(20)
-- midterm / final
UPDATE Exams SET type = 'midterm' WHERE id = 1
UPDATE Exams SET type = 'final' WHERE id = 2

CREATE TABLE Schedule (
    id INT IDENTITY PRIMARY KEY,
    class_id INT,
    subject NVARCHAR(100),
    teacher_id INT,
    day_of_week INT, -- 2 → CN
    start_time TIME,
    end_time TIME,
    room NVARCHAR(50)
)

-- demo dữ liệu
INSERT INTO Schedule(class_id, subject, teacher_id, day_of_week, start_time, end_time, room)
VALUES
(1, N'Java', 1, 2, '07:00', '09:00', 'A101'),
(1, N'Java', 1, 4, '09:00', '11:00', 'A102'),
(2, N'SQL', 1, 3, '07:00', '09:00', 'B201')