const API = "http://localhost:5000";

let editingId = null;

// LOAD LỚP
function loadClasses(){
    fetch(API + "/api/classes")
    .then(res=>res.json())
    .then(data=>{
        let html="";

        data.forEach(c=>{
            html += `
            <div class="class-card">
                <div onclick="goScore(${c.id})">
                    <div class="class-title">${c.name}</div>
                    <div class="class-id">ID: ${c.id}</div>
                </div>

                <div style="margin-top:10px;">
                    <button onclick="edit(${c.id}, '${c.name}')">Sửa</button>
                    <button onclick="del(${c.id})">Xóa</button>
                </div>
            </div>
            `;
        });

        document.getElementById("classList").innerHTML = html;
    });
}

// MỞ POPUP TẠO
function openAdd(){
    editingId = null;
    document.getElementById("title").innerText = "Tạo lớp";
    document.getElementById("className").value = "";
    document.getElementById("popup").classList.remove("hidden");
}

// ĐÓNG POPUP
function closePopup(){
    document.getElementById("popup").classList.add("hidden");
}

// LƯU (THÊM / SỬA)
function save(){
    let name = document.getElementById("className").value;

    if(editingId == null){
        // ADD
        fetch(API + "/api/classes",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({name})
        }).then(()=>{
            loadClasses();
            closePopup();
        });
    }else{
        // UPDATE
        fetch(API + "/api/classes/" + editingId,{
            method:"PUT",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({name})
        }).then(()=>{
            loadClasses();
            closePopup();
        });
    }
}

// EDIT
function edit(id, name){
    editingId = id;
    document.getElementById("title").innerText = "Sửa lớp";
    document.getElementById("className").value = name;
    document.getElementById("popup").classList.remove("hidden");
}

// DELETE
function del(id){
    if(confirm("Xóa lớp này?")){
        fetch(API + "/api/classes/" + id,{
            method:"DELETE"
        }).then(()=>loadClasses());
    }
}

// CHUYỂN TRANG
function goScore(id){
    window.location.href = "scores.html?class_id=" + id;
}
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
loadClasses();