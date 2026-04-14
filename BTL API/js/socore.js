const API = "http://localhost:5000";
const url = new URL(window.location.href);
const class_id = url.searchParams.get("class_id");

let dataGlobal = [];

/* LOAD */
function load(){
    fetch(API + "/api/classes/" + class_id + "/table")
    .then(res=>res.json())
    .then(data=>{
        dataGlobal = data;
        render();
    });
}

/* RENDER */
function render(){
    let html = "";

    dataGlobal.forEach(s=>{

        html += `<tr>
            <td>${s.code}</td>
            <td>${s.name}</td>
        `;

        // 👉 10 BUỔI ĐIỂM DANH
        for(let i=1;i<=10;i++){
            let checked = s["a"+i] ? "checked" : "";

            html += `
            <td>
                <input type="checkbox" ${checked}
                onchange="update(${s.user_id}, 'a${i}', this.checked)">
            </td>
            `;
        }

        html += `
            <td>
                <input value="${s.midterm || 0}"
                onchange="update(${s.user_id},'midterm',this.value)">
            </td>

            <td>
                <input value="${s.final || 0}"
                onchange="update(${s.user_id},'final',this.value)">
            </td>

            <td>
                <button class="delete-btn" onclick="remove(${s.user_id})">X</button>
            </td>
        </tr>`;
    });

    document.getElementById("tableBody").innerHTML = html;
}

/* UPDATE */
function update(id, field, value){
    let obj = dataGlobal.find(x => x.user_id == id);

    if(field.startsWith("a")){
        obj[field] = value ? 1 : 0;
    }else{
        obj[field] = value;
    }
}

/* SAVE */
function save(){
    fetch(API + "/api/classes/" + class_id + "/save", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(dataGlobal)
    })
    .then(()=>alert("Đã lưu"));
}

/* DELETE */
function remove(id){
    if(confirm("Xóa sinh viên này?")){
        fetch(API + "/api/classes/" + class_id + "/student/" + id,{
            method:"DELETE"
        }).then(()=>load());
    }
}

/* POPUP */
function openAdd(){
    document.getElementById("popup").classList.remove("hidden");
}

function closePopup(){
    document.getElementById("popup").classList.add("hidden");
}

/* ADD */
function add(){
    let code = document.getElementById("code").value;
    let name = document.getElementById("name").value;

    fetch(API + "/api/classes/" + class_id + "/student",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({code,name})
    }).then(()=>{
        closePopup();
        load();
    });
}

load();