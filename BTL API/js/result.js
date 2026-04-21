let score = localStorage.getItem("score") || 0;
let total = localStorage.getItem("total") || 10;
let correct = localStorage.getItem("correct") || 0;
let question_count = localStorage.getItem("question_count") || 0;
let exam_id = localStorage.getItem("exam_id");

document.getElementById("score").innerText = `${score}/10`;
document.getElementById("correct").innerText = correct;
document.getElementById("total").innerText = question_count;

/* ================= BUTTON ================= */

function goHome(){
    window.location.href = "student.html";
}

function reviewExam(){
    if(!exam_id){
        alert("Không tìm thấy bài thi");
        return;
    }
    window.location.href = `review.html?exam_id=${exam_id}`;
}

function redoExam(){
    if(!exam_id){
        alert("Không tìm thấy bài thi");
        return;
    }
    window.location.href = `student_exam.html?exam_id=${exam_id}`;
}