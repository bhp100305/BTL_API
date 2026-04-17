// ===== NAVIGATION =====
function goHome(){ location.href = "admin.html"; }
function goClass(){ location.href = "class.html"; }
function goManage(){ location.href = "manage.html"; }
function goMaterial(){ location.href = "material.html"; }
function goSchedule(){ location.href = "schedule.html"; }
function goExam(){ location.href = "alltested.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "addtest.html"; }
function goNews(){ location.href = "news.html"; }
function goGuide(){ location.href = "guide.html"; }

// ===== CHART =====
window.onload = () => {
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
};