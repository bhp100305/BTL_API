const API = "http://localhost:5000";

// ================= LẤY USER =================
let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Chưa đăng nhập!");
    window.location.href = "index.html";
}

// chỉ cho teacher
if (user.role !== "teacher") {
    alert("Bạn không có quyền truy cập!");
    window.location.href = "index.html";
}

let teacher_id = user.id;

// ================= LOAD LỚP =================
function loadClasses() {

    // ✅ GỌI API MỚI (CHỈ LẤY LỚP CỦA GIÁO VIÊN)
    fetch(API + "/api/teacher/" + teacher_id + "/classes")
        .then(res => res.json())
        .then(data => {

            let html = "";

            if (!data || data.length === 0) {
                html = `<p style="padding:20px">Không có lớp nào</p>`;
            }

            data.forEach(c => {
                html += `
                <div class="class-card">

                    <div onclick="goScore(${c.id})" style="cursor:pointer">
                        <div class="class-title">${c.name}</div>
                        <div class="class-id">ID: ${c.id}</div>
                    </div>

                </div>
                `;
            });

            document.getElementById("classList").innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            alert("Lỗi load lớp!");
        });
}

// ================= ĐI ĐẾN TRANG ĐIỂM =================
function goScore(id) {
    window.location.href = "scores.html?class_id=" + id;
}

// ================= NAV =================
function goHome(){ location.href = "teacher.html"; }
function goClass(){ location.href = "teacher_class.html"; }
function goSchedule(){ location.href = "teacher_schedule.html"; }
function goExam(){ location.href = "teacher_exam.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "addtest.html"; }
function goNews(){ location.href = "teacher_new.html"; }
function goGuide(){ location.href = "teacher_new.guide.html"; }
// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// ================= INIT =================
loadClasses();