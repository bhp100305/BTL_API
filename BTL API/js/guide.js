// DATA
let guides = [
    {
        title: "Bắt đầu",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        steps: [
            "Đăng nhập hệ thống",
            "Tạo lớp học",
            "Xem thống kê"
        ]
    },
    {
        title: "Làm bài",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        steps: [
            "Chọn bài kiểm tra",
            "Tạo câu hỏi, đáp án",
            "Sửa câu hỏi, đáp án"
        ]
    },
    {
        title: "Xem điểm",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        steps: [
            "Vào mục kết quả",
            "Xem điểm",
            "Phân tích điểm yếu"
        ]
    }
];

let currentGuide = 0;
let currentStep = 0;

/* LOAD GUIDE */
function loadGuide(index) {
    currentGuide = index;
    currentStep = 0;

    let g = guides[index];

    // FIX ID đúng với HTML
    document.getElementById("modalTitle").innerText = g.title;
    document.getElementById("modalVideo").src = g.video;

    // MỞ MODAL
    document.getElementById("modal").style.display = "flex";

    renderSteps();
}

/* RENDER STEP */
function renderSteps() {
    let g = guides[currentGuide];
    let html = "";

    g.steps.forEach((s, i) => {
        html += `<div class="step ${i === currentStep ? 'active' : ''}">
            ${i + 1}. ${s}
        </div>`;
    });

    document.getElementById("steps").innerHTML = html;
}

/* NEXT */
function next() {
    let g = guides[currentGuide];
    if (currentStep < g.steps.length - 1) {
        currentStep++;
        renderSteps();
    }
}

/* BACK */
function prev() {
    if (currentStep > 0) {
        currentStep--;
        renderSteps();
    }
}

/* CLOSE MODAL */
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

/* FAQ */
let faqData = [
    { q: "Làm sao đăng nhập?", a: "Dùng tài khoản được cấp." },
    { q: "Quên mật khẩu?", a: "Xem trong database." },
    { q: "Có đổi được mật khẩu không?", a: "Có, nhưng phải được sự cho phép của các bên liên quan." }
];

let faqHTML = "";
faqData.forEach(f => {
    faqHTML += `
    <div class="faq-item" onclick="toggleFAQ(this)">
        <b>${f.q}</b>
        <div class="faq-content">${f.a}</div>
    </div>`;
});

document.getElementById("faq").innerHTML = faqHTML;

function toggleFAQ(el) {
    let c = el.querySelector(".faq-content");
    c.style.display = c.style.display === "block" ? "none" : "block";
}

/* SEARCH (chỉ chạy nếu có input) */
let searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.oninput = function () {
        let value = this.value.toLowerCase();

        let filtered = guides.filter(g =>
            g.title.toLowerCase().includes(value)
        );

        if (filtered.length > 0) {
            loadGuide(guides.indexOf(filtered[0]));
        }
    };
}

/* INIT */
// KHÔNG auto mở modal nữa để tránh khó chịu
// loadGuide(0);

// ===== NAVIGATION =====
function goHome() { location.href = "admin.html"; }
function goClass() { location.href = "class.html"; }
function goManage() { location.href = "manage.html"; }
function goMaterial() { location.href = "material.html"; }
function goSchedule() { location.href = "schedule.html"; }
function goExam() { location.href = "alltested.html"; }
function goPractice() { location.href = "practice.html"; }
function goTest() { location.href = "addtest.html"; }
function goNews() { location.href = "news.html"; }
function goGuide() { location.href = "guide.html"; }
