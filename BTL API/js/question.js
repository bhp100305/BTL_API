const API = "http://localhost:5000";

let isDirty = false;   // có thay đổi chưa lưu
// 🔥 check login

const user = JSON.parse(localStorage.getItem("user"));
if(!user){
    alert("Chưa đăng nhập!");
    window.location.href = "login.html";
}

// lấy exam_id từ URL
const url = new URL(window.location.href);
const exam_id = url.searchParams.get("exam_id");

// ❌ nếu không có exam_id → lỗi load
if(!exam_id){
    alert("Thiếu exam_id!");
}

/* ================= LOAD ================= */
function load(){
    fetch(API + "/api/exam/" + exam_id)
    .then(res => res.json())
    .then(data => {

        let html = "";
        let i = 1;

        if(data.length === 0){
            html = "<p>Chưa có câu hỏi</p>";
        }

        data.forEach(q => {
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
    })
    .catch(err=>{
        console.log(err);
        alert("Lỗi load câu hỏi!");
    });
}

/* ================= ADD ================= */
function add(){
    let question = questionEl.value;
    let a = aEl.value;
    let b = bEl.value;
    let c = cEl.value;
    let d = dEl.value;
    let correct = correctEl.value;

    fetch(API + "/api/questions",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            exam_id,
            question,
            a,b,c,d,
            correct
        })
    })
    .then(res=>res.json())
    .then(()=>{
        clearForm();
        load();
    })
    .catch(()=>alert("Lỗi thêm câu hỏi"));
}

/* ================= CLEAR ================= */
function clearForm(){
    questionEl.value="";
    aEl.value="";
    bEl.value="";
    cEl.value="";
    dEl.value="";
}

/* ================= DELETE ================= */
function remove(id){
    if(confirm("Xóa câu hỏi?")){
        fetch(API + "/api/questions/" + id,{
            method:"DELETE"
        })
        .then(()=>load());
    }
}

/* ================= EDIT ================= */
function edit(id){
    let question = prompt("Câu hỏi:");
    let a = prompt("A:");
    let b = prompt("B:");
    let c = prompt("C:");
    let d = prompt("D:");
    let correct = prompt("Đáp án:");

    fetch(API + "/api/questions/" + id,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({question,a,b,c,d,correct})
    })
    .then(()=>load());
}

/* ================= AI ================= */
function generateAI(){
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

/* ================= ELEMENT ================= */
const questionEl = document.getElementById("question");
const aEl = document.getElementById("a");
const bEl = document.getElementById("b");
const cEl = document.getElementById("c");
const dEl = document.getElementById("d");
const correctEl = document.getElementById("correct");

/* ================= INIT ================= */
load();

function saveAll(){
    isDirty = false;
    alert("✅ Đã lưu tất cả thay đổi!");
}
async function importExcel(){
    let file = document.getElementById("excelFile").files[0];

    if(!file){
        alert("Chọn file Excel trước!");
        return;
    }

    let reader = new FileReader();

    reader.onload = async function(e){

        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type:'array'});
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let json = XLSX.utils.sheet_to_json(sheet);

        let success = 0;

        for(let row of json){

            let question = row.question || row.Question;
            let a = row.A;
            let b = row.B;
            let c = row.C;
            let d = row.D;
            let correct = row.correct || row.Correct;

            try{
                await fetch(API + "/api/questions",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({
                        exam_id,
                        question,
                        a,b,c,d,
                        correct
                    })
                });

                success++;

            }catch(err){
                console.log(err);
            }
        }

        alert(`Import thành công ${success} câu`);
        load();
    };

    reader.readAsArrayBuffer(file);
}
window.addEventListener("beforeunload", function (e) {
    if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
    }
});
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