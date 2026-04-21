const API = "http://localhost:5000";

// ===== LOAD CLASS =====
function loadClass(){
    fetch(API + "/api/classes")
    .then(res => res.json())
    .then(data => {

        let html = "";

        data.forEach(c=>{
            html += `<option value="${c.id}">${c.name}</option>`;
        });

        document.getElementById("class_id").innerHTML = html;
    });
}

// ===== CREATE =====
function create(){

    let name = document.getElementById("name").value;
    let class_id = document.getElementById("class_id").value;
    let mode = document.getElementById("mode").value;
    let deadline = document.getElementById("deadline").value;

    if(!name){
        alert("⚠️ Nhập tên bài!");
        return;
    }

    if(mode === "test" && !deadline){
        alert("⚠️ Test cần deadline!");
        return;
    }

    let url = mode === "test"
        ? "/api/tests"
        : "/api/practices";

    fetch(API + url, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name: name,
            class_id: class_id,
            deadline: deadline
        })
    })
    .then(res=>res.json())
    .then(data=>{

        if(data.error){
            alert(data.error);
            return;
        }

        alert("✅ Tạo thành công!");

        let id = data.test_id || data.practice_id;

        // 👉 chuyển sang thêm câu hỏi
        window.location.href =
            `question.html?mode=${mode}&id=${id}`;
    })
    .catch(()=>{
        alert("❌ Lỗi tạo!");
    });
}

// ===== SIDEBAR =====
function goHome(){ location.href="admin.html"; }
function goClass(){ location.href="class.html"; }
function goSchedule(){ location.href="schedule.html"; }
function goNews(){ location.href="news.html"; }
function goGuide(){ location.href="guide.html"; }

// ===== INIT =====
window.onload = loadClass;