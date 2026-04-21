// ===== API =====
const API = "http://localhost:5000";

// ===== NAVIGATION =====
function goHome(){ location.href = "admin.html"; }
function goClass(){ location.href = "class.html"; }
function goSchedule(){ location.href = "schedule.html"; }
function goExam(){ location.href = "alltested.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "addtest.html"; }
function goNews(){ location.href = "news.html"; }
function goGuide(){ location.href = "guide.html"; }
function goTeacher(){ location.href = "allteacher.html"; }
// ===== FORMAT DATE =====
function formatDate(dateStr){
    if(!dateStr) return "Chưa có ngày";

    const d = new Date(dateStr);
    return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
}

// ===== LOAD EXAM NEWS =====
function loadExamNews(){

    fetch(API + "/api/exams")
    .then(res => res.json())
    .then(data => {

        let box = document.getElementById("exam-news");

        if(!data || data.length === 0){
            box.innerHTML = "<p>Không có lịch thi</p>";
            return;
        }

        // lọc bài có ngày
        let exams = data.filter(e => e.exam_date);

        // sort gần nhất
        exams.sort((a,b) => new Date(a.exam_date) - new Date(b.exam_date));

        let html = "";

        exams.forEach(e => {

            html += `
                <div class="news-item">
                    <b>📘 ${e.name}</b>
                    <p>📅 ${formatDate(e.exam_date)}</p>
                    <p>🏫 Lớp ID: ${e.class_id}</p>
                </div>
            `;
        });

        box.innerHTML = html;
    })
    .catch(err => {
        console.error(err);
        document.getElementById("exam-news").innerHTML =
            "<p>Lỗi tải dữ liệu</p>";
    });
}

// ===== CHART =====
function loadChart(){
    const ctx = document.getElementById('chart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            datasets: [{
                label: 'Hoạt động',
                data: [10,40,20,35,45,30,50,45,60,65,35,60],
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        }
    });
}

// ===== INIT =====
window.onload = () => {
    loadExamNews();
    loadChart();
};