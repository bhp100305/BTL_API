const API = "http://localhost:5000/api";

const url = new URL(window.location.href);
const exam_id = url.searchParams.get("exam_id");

// 🔥 ĐỌC OBJECT USER
let user = JSON.parse(localStorage.getItem("user"));

if(!user){
    alert("Chưa đăng nhập!");
    window.location.replace("login.html");
    throw new Error("No login");
}

let user_id = user.id;

// ================= KIỂM TRA =================

if (!exam_id) {
    alert("Không tìm thấy bài thi!");
    window.location.replace("student.html");
    throw new Error("No exam_id");
}

if (!user_id) {
    alert("Chưa đăng nhập!");
    window.location.replace("login.html");
    throw new Error("No login");
}
// ================= CHECK ĐÃ THI CHƯA =================

fetch(`${API}/check-exam/${exam_id}/${user_id}`)
.then(res => res.json())
.then(data => {

    if (!data.can_take) {
        alert("Bạn đã thi bài này rồi, không thể làm lại!");
        window.location.href = "student.html";
        return;
    }

    // Nếu chưa thi thì load bài
    loadExam();
    startTimer();
})
.catch(err => {
    console.error("CHECK EXAM ERROR:", err);
    alert("Lỗi kiểm tra bài thi");
});

// ================= LOAD EXAM =================

function loadExam() {

    fetch(`${API}/exam/${exam_id}`)
    .then(res => res.json())
    .then(data => {

        questions = data;

        if (!questions.length) {
            alert("Bài thi chưa có câu hỏi!");
            return;
        }

        let html = "";
        let grid = "";

        questions.forEach((q, index) => {

            html += `
                <div class="question" id="q-${index+1}">
                    <div class="question-title">
                        <b>Câu ${index+1}:</b> ${q.question}
                    </div>

                    ${renderOption(q, index, "A", q.a)}
                    ${renderOption(q, index, "B", q.b)}
                    ${renderOption(q, index, "C", q.c)}
                    ${renderOption(q, index, "D", q.d)}
                </div>
            `;

            grid += `
                <button class="question-btn" id="btn-${index+1}"
                    onclick="scrollToQuestion(${index+1})">
                    ${index+1}
                </button>
            `;
        });

        document.getElementById("questions").innerHTML = html;
        document.getElementById("questionGrid").innerHTML = grid;
    })
    .catch(err => {
        console.error("LOAD EXAM ERROR:", err);
        alert("Không tải được bài thi");
    });
}

// ================= OPTION =================

function renderOption(q, index, key, value) {
    return `
        <label class="option">
            <input type="radio" name="q${q.id}" value="${key}"
                onchange="markAnswered(${index+1})">
            ${key}. ${value}
        </label>
    `;
}

function scrollToQuestion(i) {
    document.getElementById("q-" + i).scrollIntoView({
        behavior: "smooth"
    });
}

function markAnswered(i) {
    document.getElementById("btn-" + i).classList.add("active");
}

// ================= TIMER =================

let time = 45 * 60;

function startTimer() {

    let timer = setInterval(() => {

        let m = Math.floor(time / 60);
        let s = time % 60;

        document.getElementById("timer").innerText =
            `${m}:${s < 10 ? "0" + s : s}`;

        time--;

        if (time < 0) {
            clearInterval(timer);
            alert("Hết giờ!");
            submitExam();
        }

    }, 1000);
}

// ================= SUBMIT =================

async function submitExam() {

    let answers = [];

    questions.forEach(q => {
        let c = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (c) {
            answers.push({
                id: parseInt(q.id),
                answer: c.value
            });
        }
    });

    try {

        let res = await fetch(`${API}/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: parseInt(user_id),
                exam_id: parseInt(exam_id),
                answers: answers
            })
        });

        let data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // LƯU KẾT QUẢ
        localStorage.setItem("score", data.score);
        localStorage.setItem("correct", data.correct);
        localStorage.setItem("total", data.total);
        localStorage.setItem("exam_id", exam_id);

        window.location.replace("result.html");

    } catch (err) {
        console.error("SUBMIT ERROR:", err);
        alert("Không gửi được điểm lên server!");
    }
}