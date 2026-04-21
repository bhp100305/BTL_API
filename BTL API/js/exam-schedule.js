const API = "http://localhost:5000";
const user_id = 2;

// NAV
function goHome(){ location.href="student.html"; }
function goClass(){ location.href="class.html"; }
function goMaterial(){ location.href="material.html"; }
function goSchedule(){ location.href="schedule.html"; }
function goNews(){ location.href="news.html"; }
function goGuide(){ location.href="guide.html"; }

// LOAD DATA
function loadExam(){

    fetch(API + "/api/student/exams/" + user_id)
    .then(res=>res.json())
    .then(data=>{

        document.getElementById("totalExam").innerText = data.length;

        let upcoming = 0;

        // MAP theo ngày
        let map = {};

        let today = new Date();

        data.forEach(e=>{
            let d = e.date;

            if(!map[d]) map[d] = [];
            map[d].push(e);

            // check sắp thi
            let examDate = new Date(d);
            let diff = (examDate - today)/(1000*60*60*24);

            if(diff >= 0 && diff <= 3){
                upcoming++;
            }
        });

        document.getElementById("upcoming").innerText = upcoming;

        renderCalendar(map);
    });
}

// RENDER CALENDAR
function renderCalendar(map){

    let html = "";

    // lấy tháng hiện tại
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();

    let days = new Date(year, month+1, 0).getDate();

    for(let i=1;i<=days;i++){

        let dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;

        html += `<div class="day">
                    <div class="date">${i}</div>`;

        if(map[dateStr]){
            map[dateStr].forEach(e=>{

                let cls = "exam " + e.type;

                // upcoming
                let today = new Date();
                let examDate = new Date(e.date);
                let diff = (examDate - today)/(1000*60*60*24);

                if(diff >= 0 && diff <= 3){
                    cls += " upcoming";
                }

                html += `
                    <div class="${cls}">
                        ${e.class}<br>
                        ${e.name}
                    </div>
                `;
            });
        }

        html += `</div>`;
    }

    document.getElementById("calendar").innerHTML = html;
}

loadExam();