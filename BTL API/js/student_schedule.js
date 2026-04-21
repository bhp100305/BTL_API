const API = "http://localhost:5000";
const teacher_id = 1;

let editingId = null;

function formatTime(t){
    return t.substring(0,5);
}

/* LOAD LỊCH */
function load(){
    fetch(API + "/api/admin/schedule" )
    .then(res => res.json())
    .then(data => {

        let days = [[],[],[],[],[],[],[]];

        data.forEach(s=>{
            let d = parseInt(s.day) - 2;
            if(d >= 0 && d < 7){
                days[d].push(s);
            }
        });

        let names = ["Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7","CN"];

        let html = `<div class="calendar">`;

        for(let i=0;i<7;i++){
            html += `<div class="day"><div class="title">${names[i]}</div>`;

            if(days[i].length === 0){
                html += `<div class="empty">Không có</div>`;
            }

            days[i].forEach(s=>{
                html += `
                <div class="card">
                    <b>${s.subject}</b><br>
                    ⏰ ${formatTime(s.start)} - ${formatTime(s.end)}<br>
                    🏫 ${s.room}

                    <div class="card-actions">
                        
                    </div>
                </div>`;
            });

            html += `</div>`;
        }

        html += `</div>`;
        document.getElementById("calendar").innerHTML = html;
    });
}

/* LOAD CLASS */
function loadClasses(){
    fetch(API + "/api/classes")
    .then(res => res.json())
    .then(data=>{
        let html = "";

        data.forEach(c=>{
            html += `<option value="${c.id}">${c.name}</option>`;
        });

        document.getElementById("class_id").innerHTML = html;
    });
}

/* OPEN */
function openAdd(){
    editingId = null;
    document.getElementById("popup").classList.remove("hidden");
}

/* CLOSE */
function closePopup(){
    document.getElementById("popup").classList.add("hidden");
}

/* SAVE */
function save(){

    let class_id = document.getElementById("class_id").value;
    let room = document.getElementById("room").value;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let day = document.getElementById("day").value;

    if(!class_id || !room || !start || !end){
        alert("Nhập đầy đủ!");
        return;
    }

    let data = {
        class_id: parseInt(class_id),   // 👈 QUAN TRỌNG
        subject: document.getElementById("class_id").selectedOptions[0].text, // lấy tên lớp làm môn
        room: room,
        start: start,
        end: end,
        day: parseInt(day),
        teacher_id: teacher_id
    };

    fetch(API + "/api/schedule",{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res=>{
        console.log(res);
        alert("Lưu thành công");
        closePopup();
        load();
    })
    .catch(err=>{
        console.error(err);
        alert("Lỗi!");
    });
}



// ===== SIDEBAR NAV =====

function goHome(){ location.href = "student.html"; }
function goClass(){ location.href = "student_class.html"; }
function goSchedule(){ location.href = "student_schedule.html"; }
function goExam(){ location.href = "student_exam.html"; }
function goNews(){ location.href = "student_news.html"; }
function goGuide(){ location.href = "student_guide.html"; }
load();
loadClasses();