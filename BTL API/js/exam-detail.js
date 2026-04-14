const API = "http://localhost:5000/api";
const exam_id = localStorage.getItem("exam_id");

// ================= LOAD CÂU HỎI =================
async function load() {
    try {
        const res = await fetch(`${API}/exam/${exam_id}`);

        if (!res.ok) throw new Error("Lỗi API");

        const data = await res.json();
        console.log("DATA:", data); // debug

        let html = "";

        data.forEach(q => {
            html += `
            <tr>
                <td>${q.id}</td>
                <td>${q.question}</td>
                <td style="color:green; font-weight:bold">
                    ${q.correct || "?"}
                </td>
                <td>${q.score ?? 1}</td>
                <td>
                    <button onclick="removeQuestion(${q.id})">Xóa</button>
                </td>
            </tr>`;
        });

        document.getElementById("table").innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu!");
    }
}

// ================= THÊM =================
async function add() {
    const question = document.getElementById("q").value;
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;
    const c = document.getElementById("c").value;
    const d = document.getElementById("d").value;
    const correct = document.getElementById("correct").value.toUpperCase();
    const score = document.getElementById("score").value || 1;

    // VALIDATE
    if (!question || !a || !b || !c || !d || !correct) {
        alert("Vui lòng nhập đầy đủ!");
        return;
    }

    try {
        const res = await fetch(`${API}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                exam_id,
                question,
                a,
                b,
                c,
                d,
                correct,
                score
            })
        });

        const data = await res.json();
        console.log("ADD:", data);

        alert("Thêm thành công!");

        clearForm();
        load();

    } catch (err) {
        console.error(err);
        alert("Lỗi thêm câu hỏi!");
    }
}

// ================= XÓA =================
async function removeQuestion(id) {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
        await fetch(`${API}/questions/${id}`, {
            method: "DELETE"
        });

        alert("Đã xóa!");
        load();

    } catch (err) {
        console.error(err);
        alert("Lỗi xóa!");
    }
}

// ================= CLEAR FORM =================
function clearForm() {
    document.getElementById("q").value = "";
    document.getElementById("a").value = "";
    document.getElementById("b").value = "";
    document.getElementById("c").value = "";
    document.getElementById("d").value = "";
    document.getElementById("correct").value = "";
    document.getElementById("score").value = "";
}

// ================= INIT =================
if (!exam_id) {
    alert("Không có kỳ thi!");
    window.location.href = "admin.html";
} else {
    load();
}