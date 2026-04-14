const API = "http://localhost:5000";

const url = new URL(window.location.href);
const exam_id = url.searchParams.get("exam_id");

console.log("exam_id =", exam_id);

function load(){

    if(!exam_id){
        document.getElementById("list").innerHTML = "❌ Thiếu exam_id trên URL";
        return;
    }

    fetch(API + "/api/exam/" + exam_id)
    .then(res => res.json())
    .then(data => {
        console.log("DATA =", data);

        if(data.length === 0){
            document.getElementById("list").innerHTML = "⚠️ Chưa có câu hỏi";
            return;
        }

        let html = `<table class="table">
        <tr>
            <th>Câu hỏi</th>
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>D</th>
        </tr>`;

        data.forEach(q=>{
            html += `
            <tr>
                <td>${q.question}</td>
                <td class="${q.correct=='A'?'correct':''}">${q.a}</td>
                <td class="${q.correct=='B'?'correct':''}">${q.b}</td>
                <td class="${q.correct=='C'?'correct':''}">${q.c}</td>
                <td class="${q.correct=='D'?'correct':''}">${q.d}</td>
            </tr>`;
        });

        html += "</table>";

        document.getElementById("list").innerHTML = html;
    })
    .catch(err=>{
        console.log("ERROR:", err);
        document.getElementById("list").innerHTML = "❌ Lỗi load dữ liệu";
    });
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
load();