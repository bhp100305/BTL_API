// ===== API =====
const API = "http://localhost:5000";

// ===== LOAD CLASS =====
function loadClass(){
    fetch(API + "/api/classes")
    .then(res => res.json())
    .then(data => {
        let html = "";

        data.forEach(c => {
            html += `<option value="${c.id}">${c.name}</option>`;
        });

        document.getElementById("class_id").innerHTML = html;
    })
    .catch(err => {
        console.error(err);
        alert("Lỗi load lớp!");
    });
}

// ===== CREATE EXAM =====
function create(){

    let name = document.getElementById("name").value;
    let class_id = document.getElementById("class_id").value;
    let type = document.getElementById("type").value;
    let exam_date = document.getElementById("exam_date").value;

    // ===== VALIDATE =====
    if(!name){
        alert("Nhập tên môn thi!");
        return;
    }

    if(!exam_date){
        alert("Chọn ngày thi!");
        return;
    }

    fetch(API + "/api/exams/full", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            class_id: class_id,
            type: type,
            exam_date: exam_date
        })
    })
    .then(res => res.json())
    .then(data => {

        if(data.error){
            alert(data.error);
            return;
        }

        alert("Tạo bài thi thành công!");

        // 👉 chuyển sang thêm câu hỏi
        if(data.exam_id){
            window.location.href = "question.html?exam_id=" + data.exam_id;
        }
    })
    .catch(err => {
        console.error(err);
        alert("Lỗi tạo bài thi!");
    });
}

// ===== SIDEBAR NAV =====
function goHome(){ location.href = "admin.html"; }
function goClass(){ location.href = "class.html"; }
function goManage(){ location.href = "manage.html"; }
function goMaterial(){ location.href = "material.html"; }
function goSchedule(){ location.href = "schedule.html"; }
function goExamMenu(){ location.href = "admin.html"; }
function goNews(){ location.href = "news.html"; }
function goGuide(){ location.href = "guide.html"; }

// ===== INIT =====
window.onload = () => {
    loadClass();
};