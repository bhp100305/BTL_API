let score = localStorage.getItem("score");
let total = localStorage.getItem("total");
let correct = localStorage.getItem("correct");

document.getElementById("score").innerText = `${score}/${total}`;
document.getElementById("correct").innerText = correct;
document.getElementById("total").innerText = total;

function goHome(){
    window.location.href = "../student.html";
}

function reviewExam(){
    window.location.href = "../review.html";
}

function redoExam(){
    window.location.href = "../exam.html";
}