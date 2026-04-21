const API = "http://localhost:5000";
const url = new URL(window.location.href);
const class_id = url.searchParams.get("class_id");

let dataGlobal = [];

/* ================= LOAD ================= */
function load(){
    fetch(API + "/api/classes/" + class_id + "/table")
    .then(res => res.json())
    .then(data => {
        console.log("📥 TABLE DATA:", data); // debug
        dataGlobal = data;
        render();
    })
    .catch(err => console.log("❌ LOAD ERROR:", err));
}

/* ================= RENDER ================= */
function render(){
    let html = "";

    dataGlobal.forEach(s => {
        html += `<tr>
            <td>${s.code}</td>
            <td>${s.name}</td>
        `;

        for(let i=1;i<=10;i++){
            let checked = s["a"+i] ? "checked" : "";

            html += `
            <td>
                <input type="checkbox" ${checked}
                onchange="update(${s.user_id}, 'a${i}', this.checked)">
            </td>`;
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

/* ================= UPDATE ================= */
function update(id, field, value){
    let obj = dataGlobal.find(x => x.user_id == id);

    if(!obj){
        console.log("❌ Không tìm thấy user:", id);
        return;
    }

    if(field.startsWith("a")){
        obj[field] = value ? 1 : 0;
    }else{
        obj[field] = value;
    }
}

/* ================= SAVE ================= */
function save(){
    console.log("📤 SAVE DATA:", dataGlobal);

    fetch(API + "/api/classes/" + class_id + "/save", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(dataGlobal)
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ SAVE OK:", data);
        alert("Đã lưu");
    })
    .catch(err => console.log("❌ SAVE ERROR:", err));
}

/* ================= DELETE ================= */
function remove(id){
    if(confirm("Xóa sinh viên này?")){
        fetch(API + "/api/classes/" + class_id + "/student/" + id,{
            method:"DELETE"
        })
        .then(res => res.json())
        .then(data => {
            console.log("🗑 DELETE:", data);
            load();
        })
        .catch(err => console.log("❌ DELETE ERROR:", err));
    }
}

/* ================= POPUP ================= */
function openAdd(){
    document.getElementById("popup").classList.remove("hidden");
}

function closePopup(){
    document.getElementById("popup").classList.add("hidden");
}

/* ================= ADD ================= */
function add(){
    let code = document.getElementById("code").value.trim();
    let name = document.getElementById("name").value.trim();

    if(!code || !name){
        alert("Thiếu dữ liệu!");
        return;
    }

    fetch(API + "/api/classes/" + class_id + "/student",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({code,name})
    })
    .then(res => res.json())
    .then(data => {
        console.log("➕ ADD:", data);
        closePopup();
        load();
    })
    .catch(err => console.log("❌ ADD ERROR:", err));
}

/* ================= IMPORT EXCEL ================= */
async function importExcel(){
    let file = document.getElementById("excelFile").files[0];

    let reader = new FileReader();

    reader.onload = async function(e){
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let json = XLSX.utils.sheet_to_json(sheet);

        let students = json.map(row => ({
            code: String(row.code || row.Code || row["Mã SV"] || "").trim(),
            name: String(row.name || row.Name || row["Họ tên"] || "").trim()
        }));

        let success = 0;

        for(let s of students){
            try{
                let res = await fetch(API + "/api/classes/" + class_id + "/student",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify(s)
                });

                let data = await res.json();

                if(res.ok){
                    success++;
                    console.log("✅", s.code);
                }else{
                    console.log("❌", s.code, data.error);
                }

            }catch(err){
                console.log("🔥", err);
            }
        }

        alert(`Import xong: ${success}/${students.length}`);
        load();
    };

    reader.readAsArrayBuffer(file);
}
load();