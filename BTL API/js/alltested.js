const API = "http://localhost:5000";

function load(){
    fetch(API + "/api/classes")
    .then(res=>res.json())
    .then(data=>{
        let html = "";

        data.forEach(c=>{
            html += `
                <div class="card">
                    <b>${c.name}</b><br><br>

                    <button class="btn mid"
                        onclick="goExam(${c.id}, 'midterm')">
                        Giữa kỳ
                    </button>

                    <button class="btn final"
                        onclick="goExam(${c.id}, 'final')">
                        Cuối kỳ
                    </button>

                    <br><br>

                    <button class="btn edit"
                        onclick="editClass(${c.id}, '${c.name}')">
                        ✏️ Sửa
                    </button>

                    <button class="btn delete"
                        onclick="deleteClass(${c.id})">
                        🗑️ Xóa
                    </button>
                </div>
            `;
        });

        document.getElementById("list").innerHTML = html;
    });
}
function deleteClass(id){
    if(confirm("Bạn có chắc muốn xóa lớp này?")){
        fetch(API + "/api/classes/" + id, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            alert("Xóa thành công!");
            load(); // reload lại danh sách
        })
        .catch(err => {
            alert("Lỗi khi xóa!");
            console.error(err);
        });
    }
}
function editClass(id, oldName){
    let newName = prompt("Nhập tên mới:", oldName);

    if(newName && newName.trim() !== ""){
        fetch(API + "/api/classes/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName
            })
        })
        .then(res => res.json())
        .then(data => {
            alert("Cập nhật thành công!");
            load();
        })
        .catch(err => {
            alert("Lỗi khi cập nhật!");
            console.error(err);
        });
    }
}
function goExam(class_id, type){
    window.location.href =
        `chooseGKCK.html?class_id=${class_id}&type=${type}`;
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
load();