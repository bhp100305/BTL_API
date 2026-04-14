const API = "http://localhost:5000";

const url = new URL(window.location.href);
const exam_id = url.searchParams.get("exam_id");

/* LOAD */
function load(){
    fetch(API + "/api/exam/" + exam_id)
    .then(res=>res.json())
    .then(data=>{
        let html = "";
        let count=0;
        data.forEach(q=>{
            count++;
            html += `
            <div class="question-card">
                <h2>Câu ${count}</h2>
                <b>${q.question}</b>

                <div class="answer ${q.correct=="A"?"correct":""}">A. ${q.a}</div>
                <div class="answer ${q.correct=="B"?"correct":""}">B. ${q.b}</div>
                <div class="answer ${q.correct=="C"?"correct":""}">C. ${q.c}</div>
                <div class="answer ${q.correct=="D"?"correct":""}">D. ${q.d}</div>

                <div class="actions">
                    <button onclick="edit(${q.id})">✏️ Sửa</button>
                    <button onclick="remove(${q.id})">❌ Xóa</button>
                </div>

            </div>
            `;
        });

        document.getElementById("list").innerHTML = html;
    });
}

/* ADD */
function add(){
    let question = document.getElementById("question").value;
    let a = document.getElementById("a").value;
    let b = document.getElementById("b").value;
    let c = document.getElementById("c").value;
    let d = document.getElementById("d").value;
    let correct = document.getElementById("correct").value;

    fetch(API + "/api/questions",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            exam_id,
            question,
            a,b,c,d,
            correct
        })
    })
    .then(()=>{
        load();
    });
}

/* DELETE */
function remove(id){
    if(confirm("Xóa câu hỏi?")){
        fetch(API + "/api/questions/" + id,{
            method:"DELETE"
        })
        .then(()=>load());
    }
}

/* EDIT */
function edit(id){
    let question = prompt("Câu hỏi mới:");
    let a = prompt("A:");
    let b = prompt("B:");
    let c = prompt("C:");
    let d = prompt("D:");
    let correct = prompt("Đáp án đúng (A/B/C/D):");

    fetch(API + "/api/questions/" + id,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            question,a,b,c,d,correct
        })
    })
    .then(()=>load());
}
// ===== SIDEBAR NAV =====

function goHome(){
    window.location.href = "admin.html";
}

function goClass(){
    window.location.href = "class.html";
}

function goManage(){
    window.location.href = "manage.html";
}

function goMaterial(){
    window.location.href = "material.html";
}

function goSchedule(){
    window.location.href = "schedule.html";
}

function goExamMenu(){
    window.location.href = "admin.html"; // trang hiện tại (khảo thí)
}

function goNews(){
    window.location.href = "news.html";
}

function goGuide(){
    window.location.href = "guide.html";
}
// ================== INIT ==================

load();