const API = "http://localhost:5000";

/* LOAD CLASS */
function loadClass(){
    fetch(API + "/api/classes")
    .then(res=>res.json())
    .then(data=>{
        let html = "";

        data.forEach(c=>{
            html += `<option value="${c.id}">${c.name}</option>`;
        });

        document.getElementById("class_id").innerHTML = html;
    });
}

/* CREATE + CHUYỂN TRANG */
function create(){
    let name = document.getElementById("name").value;
    let class_id = document.getElementById("class_id").value;
    let type = document.getElementById("type").value;
    let question_count = document.getElementById("question_count").value; // Lấy thêm số câu hỏi
    if (!name || !question_count) {
        alert("Vui lòng nhập đầy đủ tên bài kiểm tra và số lượng câu hỏi!");
        return;
    }
    fetch(API + "/api/exams/full",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ 
            name: name, 
            class_id: class_id, 
            type: type, 
            question_count: parseInt(question_count) // Gửi kèm số câu hỏi (ép kiểu số nguyên)
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.exam_id){
            // 👉 CHUYỂN TRANG
            window.location.href = "question.html?exam_id=" + data.exam_id+ "&total=" + question_count;
        }else{
            alert("Lỗi tạo bài");
        }
    });
}
// ===== SIDEBAR NAV =====

function goHome(){
    window.location.href = "admin.html";
}

function goClass(){
    window.location.href = "class.html";
}

function goManage(){
    window.location.href = "manage.html";
}

function goMaterial(){
    window.location.href = "material.html";
}

function goSchedule(){
    window.location.href = "schedule.html";
}

function goExamMenu(){
    window.location.href = "admin.html"; // trang hiện tại (khảo thí)
}

function goNews(){
    window.location.href = "news.html";
}

function goGuide(){
    window.location.href = "guide.html";
}
loadClass();