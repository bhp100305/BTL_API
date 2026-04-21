CREATE DATABASE QuizDB_NEW
GO
USE QuizDB_NEW
GO

CREATE TABLE Users (
    id INT IDENTITY PRIMARY KEY,
    username NVARCHAR(50) UNIQUE,
    password NVARCHAR(50),
    role NVARCHAR(20), -- admin / teacher / student
    fullname NVARCHAR(100),
    student_code NVARCHAR(20)
)

CREATE TABLE Classes (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100)
)

ALTER TABLE Classes ADD teacher_id INT


CREATE TABLE ClassStudents (
    id INT IDENTITY PRIMARY KEY,
    class_id INT,
    user_id INT,

    FOREIGN KEY (class_id) REFERENCES Classes(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
)
CREATE TABLE TeachingAssignments (
    id INT IDENTITY PRIMARY KEY,
    teacher_id INT,
    class_id INT,
    subject NVARCHAR(100),

    FOREIGN KEY (teacher_id) REFERENCES Users(id),
    FOREIGN KEY (class_id) REFERENCES Classes(id)
)
CREATE TABLE Exams (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100),
    class_id INT,
    teacher_id INT,
    type NVARCHAR(20), -- midterm / final
    exam_date DATE,

    FOREIGN KEY (class_id) REFERENCES Classes(id),
    FOREIGN KEY (teacher_id) REFERENCES Users(id)
)
CREATE TABLE Questions (
    id INT IDENTITY PRIMARY KEY,
    exam_id INT,
    question NVARCHAR(255),
    a NVARCHAR(100),
    b NVARCHAR(100),
    c NVARCHAR(100),
    d NVARCHAR(100),
    correct CHAR(1),
    score INT DEFAULT 1,

    FOREIGN KEY (exam_id) REFERENCES Exams(id)
)
CREATE TABLE Results (
    id INT IDENTITY PRIMARY KEY,
    user_id INT,
    exam_id INT,
    score INT,
    total INT,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (exam_id) REFERENCES Exams(id)
)
CREATE TABLE Schedule (
    id INT IDENTITY PRIMARY KEY,
    class_id INT,
    teacher_id INT,
    subject NVARCHAR(100),
    day_of_week INT, -- 2→CN
    start_time TIME,
    end_time TIME,
    room NVARCHAR(50),

    FOREIGN KEY (class_id) REFERENCES Classes(id),
    FOREIGN KEY (teacher_id) REFERENCES Users(id)
)
CREATE TABLE ClassScores (
    id INT IDENTITY PRIMARY KEY,
    class_id INT,
    user_id INT,

    a1 BIT DEFAULT 0,
    a2 BIT DEFAULT 0,
    a3 BIT DEFAULT 0,
    a4 BIT DEFAULT 0,
    a5 BIT DEFAULT 0,
    a6 BIT DEFAULT 0,
    a7 BIT DEFAULT 0,
    a8 BIT DEFAULT 0,
    a9 BIT DEFAULT 0,
    a10 BIT DEFAULT 0,

    midterm FLOAT DEFAULT 0,
    final FLOAT DEFAULT 0,

    FOREIGN KEY (class_id) REFERENCES Classes(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
)
-- admin
INSERT INTO Users(username,password,role,fullname)
VALUES ('admin','123','admin',N'Quản trị')

-- teacher
INSERT INTO Users(username,password,role,fullname)
VALUES ('gv1','123','teacher',N'Giảng viên A')

-- student
INSERT INTO Users(username,password,role,fullname,student_code)
VALUES ('sv1','123','student',N'Nguyễn Văn A','SV001')

-- class
INSERT INTO Classes(name)
VALUES (N'Lớp Java 1')

-- add student
INSERT INTO ClassStudents(class_id,user_id)
VALUES (1,3)

-- assign teacher
INSERT INTO TeachingAssignments(teacher_id,class_id,subject)
VALUES (2,1,N'Java')

-- schedule
INSERT INTO Schedule(class_id,teacher_id,subject,day_of_week,start_time,end_time,room)
VALUES (1,2,N'Java',2,'07:00','09:00','A101')
SELECT username FROM Users 

INSERT INTO ClassStudents(class_id, user_id)
VALUES (1, 2)