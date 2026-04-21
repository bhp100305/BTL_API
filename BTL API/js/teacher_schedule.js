const API = "http://localhost:5000";

let user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "teacher") {
    alert("Không có quyền!");
    location.href = "login.html";
}

// ===== FORMAT TIME =====
function formatTime(t){
    if(!t) return "--:--";
    return String(t).substring(0,5);
}

// ===== LOAD SCHEDULE BY TEACHER =====
function load(){

    fetch(API + "/api/teacher/" + user.id + "/schedule")
    .then(res => res.json())
    .then(data => {

        if(data.length === 0){
            document.getElementById("calendar").innerHTML =
                "<h3>Không có lịch dạy</h3>";
            return;
        }

        renderCalendar(data);
    })
    .catch(err=>{
        console.error(err);
        alert("Lỗi load lịch!");
    });
}

// ===== RENDER =====
function renderCalendar(data){

    let days = [[],[],[],[],[],[],[]];

    data.forEach(s=>{
        let d = parseInt(s.day) - 2;

        if(!isNaN(d) && d >= 0 && d < 7){
            days[d].push(s);
        }
    });

    // sort theo giờ
    days.forEach(arr=>{
        arr.sort((a,b)=> String(a.start).localeCompare(String(b.start)));
    });

    let names = ["Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7","CN"];

    let html = `<div class="calendar">`;

    for(let i=0;i<7;i++){

        html += `<div class="day">
                    <div class="title">${names[i]}</div>`;

        if(days[i].length === 0){
            html += `<div class="empty">Không có</div>`;
        }

        days[i].forEach(s=>{
            html += `
            <div class="card">
                <b>${s.subject}</b><br>
                📚 ${s.class}<br>
                ⏰ ${formatTime(s.start)} - ${formatTime(s.end)}<br>
                🏫 ${s.room}
            </div>`;
        });

        html += `</div>`;
    }

    html += `</div>`;
    document.getElementById("calendar").innerHTML = html;
}

// ===== NAV =====
function goHome(){ location.href = "teacher.html"; }
function goClass(){ location.href = "teacher_class.html"; }
function goSchedule(){ location.href = "teacher_schedule.html"; }
function goExam(){ location.href = "teacher_exam.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "addtest.html"; }
function goNews(){ location.href = "teacher_new.html"; }
function goGuide(){ location.href = "teacher_new.guide.html"; }

window.onload = load;