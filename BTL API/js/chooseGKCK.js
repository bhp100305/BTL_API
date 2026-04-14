const API = "http://localhost:5000";

const url = new URL(window.location.href);
const class_id = url.searchParams.get("class_id");
const type = url.searchParams.get("type");

function load(){
    fetch(API + "/api/exams")
    .then(res=>res.json())
    .then(data=>{
        let html = "";

        data
        .filter(e => e.class_id == class_id && e.type == type)
        .forEach(e=>{
            html += `
                <div class="card"
                    onclick="goQuestion(${e.id})">
                    ${e.name}
                </div>
            `;
        });

        document.getElementById("list").innerHTML = html;
    });
}

function goQuestion(exam_id){
    window.location.href =
        `questions.html?exam_id=${exam_id}`;
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