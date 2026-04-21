const API = "http://localhost:5000";

let editingId = null;

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
        let html = "";

        data.forEach(c => {
            html += `
            <div class="class-card">

                <div onclick="goScore(${c.id})" style="cursor:pointer">
                    <div class="class-title">${c.name}</div>
                    <div class="class-id">ID: ${c.id}</div>
                    <div class="class-teacher">👨‍🏫 ${c.teacher || "Chưa có"}</div>
                </div>

            </div>
            `;
        });

        document.getElementById("classList").innerHTML = html;
    });
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
    window.location.href = "student_scores.html?class_id=" + id;
}
function goHome(){ location.href = "student.html"; }
function goClass(){ location.href = "student_class.html"; }
function goSchedule(){ location.href = "student_schedule.html"; }
function goExam(){ location.href = "student_exam.html"; }
function goNews(){ location.href = "student_news.html"; }
function goGuide(){ location.href = "student_guide.html"; }

// ================= INIT =================
loadClasses();