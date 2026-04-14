const API = "http://localhost:5000/api";

let questions = [];
let exam_id = localStorage.getItem("exam_id");
let user = JSON.parse(localStorage.getItem("user"));

function loadExam() {
    fetch(API + "/exam/" + exam_id)
    .then(res => res.json())
    .then(data => {
        questions = data;

        let html = "";
        let grid = "";
        let menu = "";

        data.forEach((q, index) => {

            // LEFT MENU
            menu += `
            <div class="menu-item" onclick="scrollToQuestion(${index+1})">
                Câu ${index+1}
            </div>
            `;

            // QUESTIONS
            html += `
            <div class="question" id="q-${index+1}">
                <div class="question-title">
                    <b>Câu ${index+1}:</b> ${q.question}
                </div>

                ${renderOption(q, index, "A", q.a)}
                ${renderOption(q, index, "B", q.b)}
                ${renderOption(q, index, "C", q.c)}
                ${renderOption(q, index, "D", q.d)}
            </div>
            `;

            // RIGHT GRID
            grid += `
            <button class="question-btn" id="btn-${index+1}"
                onclick="scrollToQuestion(${index+1})">
                ${index+1}
            </button>
            `;
        });

        document.getElementById("questions").innerHTML = html;
        document.getElementById("questionGrid").innerHTML = grid;
        document.getElementById("menuList").innerHTML = menu;
    });
}

function renderOption(q, index, key, value){
    return `
    <label class="option">
        <input type="radio" name="q${q.id}" value="${key}"
        onchange="markAnswered(${index+1})">
        ${key}. ${value}
    </label>`;
}

function scrollToQuestion(i){
    document.getElementById("q-"+i).scrollIntoView({
        behavior:"smooth"
    });

    document.querySelectorAll(".question-btn")
        .forEach(b => b.classList.remove("current"));

    document.getElementById("btn-"+i).classList.add("current");
}

function markAnswered(i){
    document.getElementById("btn-"+i).classList.add("active");
}

/* TIMER */
let time = 45*60;

function startTimer(){
    let t = setInterval(()=>{
        let m = Math.floor(time/60);
        let s = time%60;

        document.getElementById("timer").innerText =
            `${m}:${s<10?"0"+s:s}`;

        time--;

        if(time<0){
            clearInterval(t);
            alert("Hết giờ!");
            submitExam();
        }
    },1000);
}

/* SUBMIT */
function submitExam(){
    let answers=[];

    questions.forEach(q=>{
        let c = document.querySelector(`input[name="q${q.id}"]:checked`);
        if(c){
            answers.push({id:q.id, answer:c.value});
        }
    });

    fetch(API+"/submit",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            user_id:user.id,
            exam_id:exam_id,
            answers:answers
        })
    })
    .then(res=>res.json())
    .then(data=>{
        // LƯU KẾT QUẢ
        localStorage.setItem("score", data.score);
        localStorage.setItem("total", data.total);
        localStorage.setItem("correct", data.score);

        // CHUYỂN TRANG
        window.location.href = "result.html";
    });
}

loadExam();
startTimer();