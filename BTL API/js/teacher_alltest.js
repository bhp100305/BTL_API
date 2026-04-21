const API = "http://localhost:5000";

function load(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
        alert("Bạn chưa đăng nhập!");
        window.location.href = "login.html";
        return;
    }

    if(user.role !== "teacher"){
        alert("Tài khoản không phải giáo viên!");
        window.location.href = "login.html";
        return;
    }

    const teacher_id = user.id;

    fetch(API + "/api/teacher/" + teacher_id + "/classes")
    .then(res => res.json())
    .then(data => {
        let html = "";

        if(!data || data.length === 0){
            html = `<p>Chưa có lớp nào được phân công.</p>`;
            document.getElementById("list").innerHTML = html;
            return;
        }

        data.forEach(c => {
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
    })
    .catch(err => {
        console.error("Lỗi load lớp:", err);
        alert("Không tải được danh sách lớp!");
    });
}

function deleteClass(id){
    if(confirm("Bạn có chắc muốn xóa lớp này?")){
        fetch(API + "/api/classes/" + id, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                alert(data.error);
                return;
            }
            alert("Xóa thành công!");
            load();
        })
        .catch(err => {
            alert("Lỗi khi xóa!");
            console.error(err);
        });
    }
}

function editClass(id, oldName){
    let newName = prompt("Nhập tên mới:", oldName);
    const user = JSON.parse(localStorage.getItem("user"));

    if(newName && newName.trim() !== ""){
        fetch(API + "/api/classes/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName,
                teacher_id: user.id
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                alert(data.error);
                return;
            }
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
    window.location.href = `chooseGKCK.html?class_id=${class_id}&type=${type}`;
}

function goHome(){ location.href = "teacher.html"; }
function goClass(){ location.href = "teacher_class.html"; }
function goSchedule(){ location.href = "teacher_schedule.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "addtest.html"; }
function goNews(){ location.href = "teacher_new.html"; }
function goGuide(){ location.href = "teacher_new.guide.html"; }

load();