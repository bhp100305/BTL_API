const API = "http://localhost:5000";
const url = new URL(window.location.href);
const exam_id = url.searchParams.get("exam_id");

/* LOAD */
function load(){
    fetch(API + "/api/exam/" + exam_id)
    .then(res=>res.json())
    .then(data=>{
        let html = "";
        let i = 1;

        data.forEach(q=>{
            html += `
            <div class="question-card">
                <h3>Câu ${i++}</h3>
                <p>${q.question}</p>

                <div class="answer ${q.correct=="A"?"correct":""}">A. ${q.a}</div>
                <div class="answer ${q.correct=="B"?"correct":""}">B. ${q.b}</div>
                <div class="answer ${q.correct=="C"?"correct":""}">C. ${q.c}</div>
                <div class="answer ${q.correct=="D"?"correct":""}">D. ${q.d}</div>

                <div class="actions">
                    <button onclick="edit(${q.id})">✏️</button>
                    <button onclick="remove(${q.id})">🗑</button>
                </div>
            </div>
            `;
        });

        document.getElementById("list").innerHTML = html;
    });
}

/* ADD */
function add(){
    let question = questionEl.value;
    let a = aEl.value;
    let b = bEl.value;
    let c = cEl.value;
    let d = dEl.value;
    let correct = correctEl.value;

    if (question === "" || a === "" || b === "" || c === "" || d === "") {
        alert("⚠️ Bạn phải nhập đầy đủ nội dung câu hỏi và cả 4 đáp án (A, B, C, D)!");
        return; // Dừng hàm, không thực hiện fetch
    }
    // 3. Kiểm tra xem đã chọn đáp án đúng chưa (đề phòng trường hợp select bị lỗi)
    if (!correct) {
        alert("⚠️ Vui lòng chọn đáp án đúng!");
        return;
    }
    fetch(API + "/api/questions",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            exam_id,
            question,
            a,b,c,d,
            correct
        })
    })
    .then(()=>{
        clearForm();
        load();
    });
}
/* 3. IMPORT TỪ EXCEL (MỚI) */
function importExcel(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (json.length === 0) {
            alert("File Excel không có dữ liệu!");
            return;
        }

        // Chuyển đổi format Excel sang format API của bạn
        const formattedQuestions = json.map(item => ({
            exam_id: exam_id,
            question: item.Content || item["Câu hỏi"],
            a: item.A || item["Đáp án A"],
            b: item.B || item["Đáp án B"],
            c: item.C || item["Đáp án C"],
            d: item.D || item["Đáp án D"],
            correct: item.Correct || item["Đúng"]
        }));

        if (confirm(`Tìm thấy ${formattedQuestions.length} câu hỏi. Tải lên ngay?`)) {
            uploadBatch(formattedQuestions);
        }
    };
    reader.readAsArrayBuffer(file);
    input.value = ""; // Reset để có thể chọn lại file
}
let currentWorkbookData = {};

// Mở/Đóng Modal
function openExcelModal() {
    document.getElementById("excelModal").style.display = "block";
}

function closeExcelModal() {
    document.getElementById("excelModal").style.display = "none";
}

// Khi người dùng chọn file Excel
function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        currentWorkbookData = {}; 
        let html = "";

        workbook.SheetNames.forEach(name => {
            currentWorkbookData[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
            
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; border-bottom: 1px solid #ddd;">
                    <div>
                        <input type="checkbox" class="sheet-checkbox" value="${name}"> 
                        <strong>${name}</strong> <span style="color: #888;">(${currentWorkbookData[name].length} câu)</span>
                    </div>
                    <div>
                        Lấy <input type="number" class="sheet-percent" data-sheet="${name}" value="0" style="width: 45px;"> %
                    </div>
                </div>
            `;
        });

        document.getElementById("sheet-list").innerHTML = html;
        document.getElementById("config-section").style.display = "block";
    };
    reader.readAsArrayBuffer(file);
}

// Gửi yêu cầu lên server
function processMixImport() {
    const totalWanted = parseInt(document.getElementById("total-q").value);
    const selectedCheckboxes = document.querySelectorAll(".sheet-checkbox:checked");
    
    if (selectedCheckboxes.length === 0) {
        alert("Vui lòng tích chọn ít nhất một Sheet!");
        return;
    }

    let totalPercent = 0;
    const sheetsToSubmit = [];

    selectedCheckboxes.forEach(cb => {
        const name = cb.value;
        const percent = parseInt(document.querySelector(`.sheet-percent[data-sheet="${name}"]`).value);
        totalPercent += percent;

        sheetsToSubmit.push({
            name: name,
            percent: percent,
            questions: currentWorkbookData[name].map(row => ({
            // Dùng dấu || để bao quát cả tiếng Anh và tiếng Việt
                question: row["Câu hỏi"] || row["Content"] || row["question"] ||"",
                a: row["A"] || row["Đáp án A"],
                b: row["B"] || row["Đáp án B"],
                c: row["C"] || row["Đáp án C"],
                d: row["D"] || row["Đáp án D"],
                correct: row["Đáp án"] || row["Correct"] || row["Đúng"] ||"A"
            }))
        });
    });

    if (totalPercent !== 100) {
        alert(`Tổng tỷ lệ phải là 100%. Hiện tại: ${totalPercent}%`);
        return;
    }

    // Gọi API (Dùng biến exam_id bạn đã lấy từ URL)
    fetch(API + "/api/questions/import-dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            exam_id: exam_id,
            total_count: totalWanted,
            sheets: sheetsToSubmit
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            alert(`Nhập thành công ${data.count} câu hỏi!`);
            closeExcelModal();
            load(); // <--- Quan trọng: Gọi hàm này để render lại giao diện
        } else {
            alert("Lỗi: " + data.message);
        }
    });
   
}

/* 4. GỬI DỮ LIỆU HÀNG LOẠT  */
function uploadBatch(questions) {
    fetch(API + "/api/questions/import-dynamic", { // Bạn cần tạo route này ở Flask
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, exam_id })
    })
    .then(res => res.json())
    .then(data => {
        alert("Thành công! Đã thêm " + (data.count || questions.length) + " câu hỏi.");
        load();
    })
    .catch(() => alert("Lỗi khi import Excel!"));
}

/* CLEAR */
function clearForm(){
    questionEl.value="";
    aEl.value="";
    bEl.value="";
    cEl.value="";
    dEl.value="";
}

/* DELETE */
function remove(id){
    if(confirm("Xóa câu hỏi?")){
        fetch(API + "/api/questions/" + id,{
            method:"DELETE"
        }).then(()=>load());
    }
}


/* EDIT */
 let editingId = null; // Biến để lưu ID câu hỏi đang sửa
function edit(id){
   
    // 1. Tìm dữ liệu câu hỏi từ Server (hoặc từ danh sách đã load)
    fetch(API + "/api/questions_detail/" + id) // Bạn cần thêm route này ở Flask (xem bên dưới)
    .then(res => res.json())
    .then(q => {
        // 2. Đưa dữ liệu lên form nhập liệu
        questionEl.value = q.question;
        aEl.value = q.a;
        bEl.value = q.b;
        cEl.value = q.c;
        dEl.value = q.d;
        correctEl.value = q.correct;

        // 3. Ghi nhớ ID đang sửa và đổi nút "Thêm" thành "Cập nhật"
        editingId = id;
        const addBtn = document.querySelector(".btn-group button:first-child");
        addBtn.innerText = "💾 Lưu cập nhật";
        addBtn.style.backgroundColor = "#ff9800"; // Đổi màu để dễ nhận biết
        addBtn.onclick = saveUpdate; // Đổi hàm thực thi
        
        // Cuộn màn hình lên trên cùng để người dùng thấy form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function saveUpdate() {
    // Lấy dữ liệu mới từ form
    let data = {
        question: questionEl.value,
        a: aEl.value,
        b: bEl.value,
        c: cEl.value,
        d: dEl.value,
        correct: correctEl.value
    };

    fetch(API + "/api/questions/" + editingId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(() => {
        alert("Cập nhật thành công!");
        resetForm(); // Trả lại trạng thái ban đầu
        load();
    });
}
function resetForm() {
    editingId = null;
    clearForm();
    const addBtn = document.querySelector(".btn-group button:first-child");
    addBtn.innerText = "➕ Thêm";
    addBtn.style.backgroundColor = ""; // Trả lại màu cũ
    addBtn.onclick = add; // Trả lại hàm add
}
/* 🤖 AI GENERATE */
function generateAI(){
    let topic = prompt("Nhập chủ đề (VD: SQL JOIN):");

    fetch(API + "/api/practice/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
    })
    .then(res=>res.json())
    .then(data=>{
        let q = data[0];

        questionEl.value = q.question;
        aEl.value = q.a;
        bEl.value = q.b;
        cEl.value = q.c;
        dEl.value = q.d;
        correctEl.value = q.correct;
    });
}

/* ELEMENTS */
const questionEl = document.getElementById("question");
const aEl = document.getElementById("a");
const bEl = document.getElementById("b");
const cEl = document.getElementById("c");
const dEl = document.getElementById("d");
const correctEl = document.getElementById("correct");

/* INIT */
load();