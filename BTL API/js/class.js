const API = "http://localhost:5000";

let editingId = null;
let allClasses = [];
// ================= LOAD GIÁO VIÊN =================
function loadTeachers(selectedId = null) {
    fetch(API + "/api/teachers/simple")
    .then(res => res.json())
    .then(data => {
        let html = `<option value="">-- Chọn giáo viên --</option>`;

        data.forEach(t => {
            html += `<option value="${t.id}">${t.name}</option>`;
        });

        let select = document.getElementById("teacherSelect");
        select.innerHTML = html;

        if(selectedId){
            select.value = selectedId;
        }
    });
}

// ================= LOAD LỚP =================
function loadClasses(){
    fetch(API + "/api/classes")
    .then(res => res.json())
    .then(data => {

        allClasses = data;   // 🔥 lưu lại toàn bộ lớp

        renderClasses(data); // hiển thị
    });
}
function renderClasses(data){
    let html = "";

    data.forEach(c => {
        html += `
        <div class="class-card">

            <div onclick="goScore(${c.id})" style="cursor:pointer">
                <div class="class-title">${c.name}</div>
                <div class="class-id">ID: ${c.id}</div>
                <div class="class-teacher">👨‍🏫 ${c.teacher || "Chưa có"}</div>
            </div>

            <div class="card-actions">
                <button class="btn-edit"
                    onclick="edit(${c.id}, '${c.name}', ${c.teacher_id || 'null'})">
                    Sửa
                </button>
                <button class="btn-delete"
                    onclick="del(${c.id})">
                    Xóa
                </button>
            </div>

        </div>
        `;
    });

    document.getElementById("classList").innerHTML = html;
}

//tim kiem
function searchClass(){

    let keyword = document.getElementById("searchInput")
                    .value
                    .toLowerCase();

    let filtered = allClasses.filter(c =>
        c.name.toLowerCase().includes(keyword)
    );

    renderClasses(filtered);
}


// ================= MỞ POPUP =================
function openAdd(){
    editingId = null;

    document.getElementById("title").innerText = "Tạo lớp";
    document.getElementById("className").value = "";

    document.getElementById("popup").classList.remove("hidden");

    loadTeachers(); // 👈 load bình thường
}

// ================= ĐÓNG POPUP =================
function closePopup(){
    document.getElementById("popup").classList.add("hidden");
}

// ================= LƯU (ADD / UPDATE) =================
function save(){
    let name = document.getElementById("className").value;
    let teacher_id = document.getElementById("teacherSelect").value;

    if(!name){
        alert("Nhập tên lớp!");
        return;
    }

    if(!teacher_id){
        alert("Chọn giáo viên!");
        return;
    }
    teacher_id = parseInt(teacher_id);
    let payload = {
        name: name,
        teacher_id: teacher_id
    };

    if(editingId == null){
        // ADD
        fetch(API + "/api/classes", {
            method: "POST",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        }).then(res => res.json())
        .then(data => {
            if(data.error){
                alert(data.error);
                return;
            }
            loadClasses();
            closePopup();
        });

    } else {
        // UPDATE
       fetch(API + "/api/classes/" + editingId, {
            method: "PUT",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                alert(data.error);
                return;
            }
            loadClasses();
            closePopup();
        });
    }
}

// ================= EDIT =================
function edit(id, name, teacher_id){
    editingId = id;

    document.getElementById("title").innerText = "Sửa lớp";
    document.getElementById("className").value = name;

    document.getElementById("popup").classList.remove("hidden");

    loadTeachers(teacher_id); // 👈 truyền luôn
}

// ================= DELETE =================
function del(id){
    if(confirm("Xóa lớp này?")){
        fetch(API + "/api/classes/" + id, {
            method: "DELETE"
        }).then(() => loadClasses());
    }
}

// ================= NAV =================
function goScore(id){
    window.location.href = "scores.html?class_id=" + id;
}
function goHome(){ location.href = "admin.html"; }
function goClass(){ location.href = "class.html"; }
function goSchedule(){ location.href = "schedule.html"; }
function goExam(){ location.href = "alltested.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "addtest.html"; }
function goNews(){ location.href = "news.html"; }
function goGuide(){ location.href = "guide.html"; }
function goTeacher(){ location.href = "allteacher.html"; }

// ================= INIT =================
loadClasses();