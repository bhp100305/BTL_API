const API = "http://localhost:5000";
// Xóa exam_id để không làm lại
localStorage.removeItem("exam_id");
/* ================= NAVIGATION ================= */
function goHome(){ location.href = "student.html"; }
function goClass(){ location.href = "student_class.html"; }
function goSchedule(){ location.href = "student_schedule.html"; }
function goExam(){ location.href = "student_exam.html"; }
function goNews(){ location.href = "student_news.html"; }
function goGuide(){ location.href = "student_guide.html"; }
function goExamSchedule(){
    location.href = "student_exam_schedule.html";
}
function goTest(){
    location.href = "student_test.html";
}
function goKT(){
    location.href = "student_kt.html";
}
/* ================= CHECK LOGIN ================= */
function checkLogin(){
    let user = localStorage.getItem("user");

    if(!user){
        alert("Bạn chưa đăng nhập!");
        location.href = "login.html";
        return null;
    }

    return JSON.parse(user);
}

/* ================= LOAD EXAM NOTICE ================= */
function loadExamNotice(){
    let user = checkLogin();
    if(!user) return;

    fetch(API + "/api/student/exams/" + user.id)
    .then(res => res.json())
    .then(data => {

        let html = "<h3>Thông báo</h3>";

        if(data.length === 0){
            html += "<p>Chưa có lịch thi</p>";
        }

        data.forEach(e => {
            html += `
                <div class="news-item">
                    <b>${e.class} - ${e.name}</b>
                    <p>📅 ${e.date ? e.date : "Chưa có ngày thi"}</p>
                </div>
            `;
        });

        document.querySelector(".news-box").innerHTML = html;
    })
    .catch(err=>{
        console.log("Lỗi load exam:", err);
    });
}

/* ================= CHART ================= */
function loadChart(){

    let user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    fetch(`${API}/api/student/chart/${user.id}`)
    .then(res => res.json())
    .then(data => {

        let labels = [];
        let scores = [];

        data.forEach(item=>{
            labels.push(item.class);
            scores.push(item.score);
        });

        const ctx = document.getElementById('chart');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Điểm trung bình',
                    data: scores,
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            }
        });

    })
    .catch(err=>{
        console.log("Lỗi load chart:", err);
    });
}
function loadWelcome(){
    let user = JSON.parse(localStorage.getItem("user"));

    if(user && user.fullname){
        document.getElementById("welcomeText").innerText =
            "Xin chào, " + user.fullname;
    }
    else{
        document.getElementById("welcomeText").innerText =
            "Xin chào Sinh viên";
    }
}
/* ================= INIT ================= */
window.onload = () => {
    checkLogin();       // 🔥 bắt login trước
    loadChart();        // vẽ chart
    loadExamNotice();   // load lịch thi
    loadWelcome();      // hiển thị tên
};
// 🚫 Không cho quay lại bài thi
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};
