const API = "http://localhost:5000";
const teacher_id = 1;

function load(){

    fetch(API + "/api/schedule/" + teacher_id)
    .then(res => res.json())
    .then(data => {

        console.log("DATA:", data); // 👈 DEBUG

        let days = [[],[],[],[],[],[],[]];

        data.forEach(s => {
            let d = parseInt(s.day) - 2;

            if(!isNaN(d) && d >= 0 && d < 7){
                days[d].push(s);
            }
        });

        let dayNames = ["Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7","CN"];

        let html = `<div class="calendar">`;

        for(let i=0;i<7;i++){

            html += `
            <div class="day">
                <div class="title">${dayNames[i]}</div>
            `;

            if(days[i].length === 0){
                html += `<div class="empty">Không có lịch</div>`;
            }

            days[i].forEach(s=>{
                html += `
                <div class="card"
                    onclick="showDetail('${s.class}','${s.subject}','${s.start}','${s.end}','${s.room}')">
                    
                    <b>${s.subject}</b><br>
                    ⏰ ${s.start} - ${s.end}<br>
                    🏫 ${s.room}
                </div>
                `;
            });

            html += `</div>`;
        }

        html += `</div>`;

        document.getElementById("calendarBody").innerHTML = html;

    })
    .catch(err=>{
        console.error(err);
    });
}


// 👇 POPUP
function showDetail(cls, sub, start, end, room){
    alert(
        "📘 Lớp: " + cls +
        "\n📖 Môn: " + sub +
        "\n⏰ " + start + " - " + end +
        "\n🏫 Phòng: " + room
    );
}
function addSchedule(){
    fetch(API + "/api/schedule", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            class_id: 1,
            subject: "Python",
            teacher_id: 1,
            day: 5,
            start: "10:00",
            end: "12:00",
            room: "C301"
        })
    })
    .then(res=>res.json())
    .then(()=>{
        alert("Thêm thành công");
        load(); // 👈 QUAN TRỌNG
    });
}
load();