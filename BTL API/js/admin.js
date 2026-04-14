const API = "http://localhost:5000/api";

// ================== CHUYỂN GIAO DIỆN ==================

// Khi click nút tròn "Tạo ngân hàng câu hỏi"
function goExam(){
    document.getElementById("examSection").style.display = "block";
    loadExams();
}

// ================== LOAD DANH SÁCH ĐỀ ==================

function loadExams(){
    fetch(API + "/exams")
    .then(res => res.json())
    .then(data => {

        let html = "";

        if(data.length === 0){
            html = `<tr><td colspan="4">Chưa có kỳ thi nào</td></tr>`;
        }

        data.forEach(e => {
            html += `
            <tr>
                <td>${e.id}</td>
                <td>${e.name}</td>

                <td>
                    <button class="btn-detail" onclick="detail(${e.id})">
                        Chi tiết
                    </button>
                </td>

                <td>
                    <button class="btn-delete" onclick="del(${e.id})">
                        Xóa
                    </button>
                </td>
            </tr>
            `;
        });

        document.getElementById("examTable").innerHTML = html;
    })
    .catch(err => {
        console.error("Lỗi load exams:", err);
    });
}

// ================== THÊM KỲ THI ==================

function addExam(){
    let name = document.getElementById("examName").value.trim();

    if(name === ""){
        alert("Vui lòng nhập tên kỳ thi");
        return;
    }

    fetch(API + "/exams", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name })
    })
    .then(() => {
        document.getElementById("examName").value = "";
        loadExams();
    })
    .catch(err => console.error("Lỗi thêm:", err));
}

// ================== XÓA ==================

function del(id){

    if(!confirm("Bạn có chắc muốn xóa?")) return;

    fetch(API + "/exams/" + id, {
        method:"DELETE"
    })
    .then(() => loadExams())
    .catch(err => console.error("Lỗi xóa:", err));
}

// ================== CHI TIẾT ==================

function detail(id){
    localStorage.setItem("exam_id", id);
    window.location.href = "exam-detail.html";
}

// ================== THÊM CÂU HỎI ==================

function addQuestion(){

    let data = {
        exam_id: document.getElementById("exam_id").value,
        question: document.getElementById("q").value,
        a: document.getElementById("a").value,
        b: document.getElementById("b").value,
        c: document.getElementById("c").value,
        d: document.getElementById("d").value,
        correct: document.getElementById("correct").value
    };

    if(!data.question){
        alert("Nhập câu hỏi!");
        return;
    }

    fetch(API + "/questions", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    })
    .then(() => {
        alert("Thêm thành công");
    })
    .catch(err => console.error("Lỗi thêm câu hỏi:", err));
}
// ================== ĐIỀU HƯỚNG TRANG ==================

// tất cả bài kiểm tra đã tạo
function goExam(){
    window.location.href = "alltested.html";
}

// Tạo bài ôn tập theo nội dung
function goPractice(){
    window.location.href = "practice.html";
}

// Tạo bài ôn tập theo dạng đề
function goPracticeType(){
    window.location.href = "practice-type.html";
}

// Tạo bài kiểm tra
function goTest(){
    window.location.href = "addtest.html";
}

// Xem kết quả
function goResult(){
    window.location.href = "result.html";
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
// ================== INIT ==================

// Ẩn bảng lúc đầu (chỉ hiện khi click nút tròn)
window.onload = () => {
    let examSection = document.getElementById("examSection");
    if(examSection){
        examSection.style.display = "none";
    }
};