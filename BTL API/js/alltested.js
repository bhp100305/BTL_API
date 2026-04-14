const API = "http://localhost:5000";

function load(){
    fetch(API + "/api/classes")
    .then(res=>res.json())
    .then(data=>{
        let html = "";

        data.forEach(c=>{
            html += `
                <div class="card">
                    <b>${c.name}</b><br><br>

                    <button class="btn mid"
                        onclick="goExam(${c.id}, 'midterm')">
                        Giữa kỳ
                    </button>

                    <button class="btn final"
                        onclick="goExam(${c.id}, 'final')">
                        Cuối kỳ
                    </button>
                </div>
            `;
        });

        document.getElementById("list").innerHTML = html;
    });
}

function goExam(class_id, type){
    window.location.href =
        `chooseGKCK.html?class_id=${class_id}&type=${type}`;
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