const API = "http://localhost:5000";

// ===== LẤY USER =====
const user = JSON.parse(localStorage.getItem("user"));

if(!user || user.role !== "teacher"){
    alert("Bạn không có quyền!");
    location.href = "login.html";
}

// ===== NAVIGATION =====
function goHome(){ location.href = "teacher.html"; }
function goClass(){ location.href = "teacher_class.html"; }
function goSchedule(){ location.href = "teacher_schedule.html"; }
function goExam(){ location.href = "teacher_alltest.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "teacher_addtest.html"; }
function goNews(){ location.href = "teacher_new.html"; }
function goGuide(){ location.href = "teacher_new.guide.html"; }

// ===== FORMAT DATE =====
function formatDate(dateStr){
    if(!dateStr) return "Chưa có ngày";
    const d = new Date(dateStr);
    return d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
}

// ===== LOAD EXAM CỦA GIẢNG VIÊN =====
function loadExamNews(){

    fetch(API + "/api/exams/teacher/" + user.id)
    .then(res => res.json())
    .then(data => {

        let box = document.getElementById("exam-news");

        if(!data || data.length === 0){
            box.innerHTML = "<p>Không có bài thi</p>";
            return;
        }

        let exams = data.filter(e => e.exam_date);

        exams.sort((a,b) => new Date(a.exam_date) - new Date(b.exam_date));

        let html = "";

        exams.forEach(e => {
            html += `
                <div class="news-item">
                    <b>📘 ${e.name}</b>
                    <p>📅 ${formatDate(e.exam_date)}</p>
                </div>
            `;
        });

        box.innerHTML = html;
    })
    .catch(err => {
        console.error(err);
    });
}

// ===== CHART =====
function loadChart(){
    const ctx = document.getElementById('chart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['T1','T2','T3','T4','T5'],
            datasets: [{
                label: 'Hoạt động',
                data: [10,20,15,30,25],
                borderWidth: 2,
                tension: 0.3,
                fill:true
            }]
        }
    });
}
// ===== LOAD CLASSES =====
function loadMyClasses(){

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
        alert("Chưa đăng nhập!");
        location.href = "login.html";
        return;
    }

    fetch(API + "/api/classes/teacher/" + user.id)
    .then(res => res.json())
    .then(data => {

        let box = document.getElementById("my-classes");

        if(!data || data.length === 0){
            box.innerHTML = "<p>Không có lớp</p>";
            return;
        }

        let html = "";

        data.forEach(c => {
            html += `
                <div class="news-item">
                    <b>📚 ${c.name}</b>
                    <p>ID: ${c.id}</p>
                </div>
            `;
        });

        box.innerHTML = html;
    })
    .catch(err => {
        console.error(err);
    });
}
function loadWelcome(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(user && user.fullname){
        document.getElementById("welcomeText").innerText =
            "Xin chào, " + user.fullname;
    }
}
function loadExamCount(){

    let user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    fetch(`${API}/api/student/exam-count/${user.id}`)
    .then(res => res.json())
    .then(data => {
        if(data.count !== undefined){
            document.getElementById("examCount").innerText = data.count;
        }
    })
    .catch(err=>{
        console.log("Lỗi load exam count:", err);
    });
}
// ===== INIT =====
window.onload = () => {
    loadExamNews();
    loadChart();
    loadMyClasses();
    loadWelcome();
    loadExamCount();
};