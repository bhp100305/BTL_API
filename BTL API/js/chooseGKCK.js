const API = "http://localhost:5000";

const url = new URL(window.location.href);
const class_id = url.searchParams.get("class_id");
const type = url.searchParams.get("type");

let currentExamId = null;

// ===== LOAD DATA =====
function load(){
    fetch(API + "/api/exams")
    .then(res => res.json())
    .then(data => {

        let html = "";

        data
        .filter(e => e.class_id == class_id && e.type == type)
        .forEach(e => {

            html += `
                <div class="card">

                    <div class="title"
                        onclick="goQuestion(${e.id})">
                        📄 ${e.name}
                    </div>

                    <div class="info">
                        📅 Ngày thi:
                        <b>${formatDate(e.exam_date)}</b>
                    </div>

                    <div class="actions">

                        <button class="view"
                            onclick="goQuestion(${e.id})">
                            👁 Xem
                        </button>

                        <button class="date-btn"
                            onclick="openDatePicker(${e.id}, '${e.exam_date || ""}')">
                            📅 Sửa ngày
                        </button>

                        <button class="delete"
                            onclick="deleteExam(${e.id})">
                            🗑 Xóa
                        </button>

                    </div>

                </div>
            `;
        });

        document.getElementById("list").innerHTML = html;
    });
}

// ===== FORMAT DATE =====
function formatDate(date){
    if(!date) return "Chưa có";

    let d = new Date(date);
    return d.toLocaleDateString("vi-VN");
}

// ===== MỞ MODAL =====
function openDatePicker(id, oldDate){

    currentExamId = id;

    let modal = document.getElementById("dateModal");
    let input = document.getElementById("modalDate");

    // set ngày cũ
    if(oldDate){
        input.value = oldDate.split("T")[0];
    } else {
        input.value = "";
    }

    modal.style.display = "flex";
}

// ===== ĐÓNG MODAL =====
function closeModal(){
    document.getElementById("dateModal").style.display = "none";
}

// ===== LƯU NGÀY =====
function saveDate(){

    let date = document.getElementById("modalDate").value;

    if(!date){
        alert("⚠️ Vui lòng chọn ngày!");
        return;
    }

    fetch(API + "/api/exams/date/" + currentExamId, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ date: date })
    })
    .then(res => res.json())
    .then(() => {
        alert("✅ Đã lưu ngày thi!");
        closeModal();
        load();
    })
    .catch(() => {
        alert("❌ Lỗi lưu ngày!");
    });
}

// ===== DELETE =====
function deleteExam(id){
    if(confirm("Bạn có chắc muốn xóa?")){
        fetch(API + "/api/exams/" + id, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(() => {
            alert("Đã xóa!");
            load();
        });
    }
}

// ===== GO QUESTION =====
function goQuestion(exam_id){
    window.location.href =
        `questions.html?exam_id=${exam_id}`;
}

// ===== SIDEBAR NAV =====
function goHome(){ window.location.href = "admin.html"; }
function goClass(){ window.location.href = "class.html"; }
function goSchedule(){ window.location.href = "schedule.html"; }
function goNews(){ window.location.href = "news.html"; }
function goGuide(){ window.location.href = "guide.html"; }

// ===== CLICK NGOÀI ĐÓNG MODAL (XỊN HƠN) =====
window.onclick = function(event){
    let modal = document.getElementById("dateModal");
    if(event.target === modal){
        closeModal();
    }
}

// ===== RUN =====
load();