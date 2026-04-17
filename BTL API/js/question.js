const API = "http://localhost:5000";
const url = new URL(window.location.href);
const exam_id = url.searchParams.get("exam_id");

/* LOAD */
function load(){
    fetch(API + "/api/exam/" + exam_id)
    .then(res=>res.json())
    .then(data=>{
        let html = "";
        let i = 1;

        data.forEach(q=>{
            html += `
            <div class="question-card">
                <h3>Câu ${i++}</h3>
                <p>${q.question}</p>

                <div class="answer ${q.correct=="A"?"correct":""}">A. ${q.a}</div>
                <div class="answer ${q.correct=="B"?"correct":""}">B. ${q.b}</div>
                <div class="answer ${q.correct=="C"?"correct":""}">C. ${q.c}</div>
                <div class="answer ${q.correct=="D"?"correct":""}">D. ${q.d}</div>

                <div class="actions">
                    <button onclick="edit(${q.id})">✏️</button>
                    <button onclick="remove(${q.id})">🗑</button>
                </div>
            </div>
            `;
        });

        document.getElementById("list").innerHTML = html;
    });
}

/* ADD */
function add(){
    let question = questionEl.value;
    let a = aEl.value;
    let b = bEl.value;
    let c = cEl.value;
    let d = dEl.value;
    let correct = correctEl.value;

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
        clearForm();
        load();
    });
}

/* CLEAR */
function clearForm(){
    questionEl.value="";
    aEl.value="";
    bEl.value="";
    cEl.value="";
    dEl.value="";
}

/* DELETE */
function remove(id){
    if(confirm("Xóa câu hỏi?")){
        fetch(API + "/api/questions/" + id,{
            method:"DELETE"
        }).then(()=>load());
    }
}

/* EDIT */
function edit(id){
    let question = prompt("Câu hỏi:");
    let a = prompt("A:");
    let b = prompt("B:");
    let c = prompt("C:");
    let d = prompt("D:");
    let correct = prompt("Đáp án:");

    fetch(API + "/api/questions/" + id,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({question,a,b,c,d,correct})
    }).then(()=>load());
}

/* 🤖 AI GENERATE */
function generateAI(){
    let topic = prompt("Nhập chủ đề (VD: SQL JOIN):");

    fetch(API + "/api/practice/random")
    .then(res=>res.json())
    .then(data=>{
        let q = data[0];

        questionEl.value = q.question;
        aEl.value = q.a;
        bEl.value = q.b;
        cEl.value = q.c;
        dEl.value = q.d;
        correctEl.value = q.correct;
    });
}

/* ELEMENTS */
const questionEl = document.getElementById("question");
const aEl = document.getElementById("a");
const bEl = document.getElementById("b");
const cEl = document.getElementById("c");
const dEl = document.getElementById("d");
const correctEl = document.getElementById("correct");

/* INIT */
load();