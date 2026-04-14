const API = "http://localhost:5000/api";
let questions = [];
let currentExam = 0;
let user = JSON.parse(localStorage.getItem("user"));

function loadExams(){
    fetch(API + "/exams")
    .then(res => res.json())
    .then(data => {
        let html = "";
        data.forEach(e => {
            html += `<button onclick="loadExam(${e.id})">${e.name}</button>`;
        });
        document.getElementById("exams").innerHTML = html;
    });
}

function loadExam(id){
    currentExam = id;

    fetch(API + "/exam/" + id)
    .then(res => res.json())
    .then(data => {
        questions = data;
        let html = "";

        data.forEach(q => {
            html += `
            <div class="question">
                <p>${q.question}</p>
                <input type="radio" name="q${q.id}" value="A"> ${q.a}<br>
                <input type="radio" name="q${q.id}" value="B"> ${q.b}<br>
                <input type="radio" name="q${q.id}" value="C"> ${q.c}<br>
                <input type="radio" name="q${q.id}" value="D"> ${q.d}<br>
            </div>`;
        });

        document.getElementById("questions").innerHTML = html;
    });
}

function submit(){
    let answers = [];

    questions.forEach(q => {
        let c = document.querySelector(`input[name="q${q.id}"]:checked`);
        if(c){
            answers.push({
                id: q.id,
                answer: c.value
            });
        }
    });

    fetch(API + "/submit", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            user_id: user.id,
            exam_id: currentExam,
            answers: answers
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").innerText =
            "Điểm: " + data.score + "/" + data.total;
    });
}


function loadExams(){
    fetch(API + "/exams")
    .then(res => res.json())
    .then(data => {
        let html = "";

        data.forEach(e => {
            html += `
            <div>
                <button onclick="startExam(${e.id})">
                    ${e.name}
                </button>
            </div>`;
        });

        document.getElementById("exams").innerHTML = html;
    });
}

function startExam(id){
    // lưu exam id
    localStorage.setItem("exam_id", id);

    // chuyển sang trang làm bài
    window.location.href = "exam.html";
}


loadExams();