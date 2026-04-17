// ===== NAVIGATION =====
function goHome(){ location.href = "student.html"; }
function goClass(){ location.href = "class.html"; }
function goMaterial(){ location.href = "material.html"; }
function goSchedule(){ location.href = "schedule.html"; }
function goExam(){ location.href = "exam.html"; }
function goNews(){ location.href = "news.html"; }
function goGuide(){ location.href = "guide.html"; }

// ===== CHART =====
window.onload = () => {
    const ctx = document.getElementById('chart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['SQL','OOP','DSA','AI','Web','Java'],
            datasets: [
                {
                    label: 'Điểm',
                    data: [85,70,60,75,80,90],
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }
            ]
        }
    });
};