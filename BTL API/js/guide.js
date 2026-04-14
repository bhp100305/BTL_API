let guides = [
{
    title:"Bắt đầu",
    video:"https://www.youtube.com/embed/dQw4w9WgXcQ",
    steps:[
        "Đăng nhập hệ thống",
        "Chọn lớp học",
        "Xem dashboard"
    ]
},
{
    title:"Làm bài",
    video:"https://www.youtube.com/embed/dQw4w9WgXcQ",
    steps:[
        "Chọn bài kiểm tra",
        "Chọn đáp án",
        "Nộp bài"
    ]
},
{
    title:"Xem điểm",
    video:"https://www.youtube.com/embed/dQw4w9WgXcQ",
    steps:[
        "Vào mục kết quả",
        "Xem điểm",
        "Phân tích điểm yếu"
    ]
}
];

let currentGuide = 0;
let currentStep = 0;

/* LOAD GUIDE */
function loadGuide(index){
    currentGuide = index;
    currentStep = 0;

    let g = guides[index];

    document.getElementById("title").innerText = g.title;
    document.getElementById("video").src = g.video;

    renderSteps();
}

/* RENDER STEP */
function renderSteps(){
    let g = guides[currentGuide];
    let html = "";

    g.steps.forEach((s,i)=>{
        html += `<div class="step ${i==currentStep?'active':''}">
            ${i+1}. ${s}
        </div>`;
    });

    document.getElementById("steps").innerHTML = html;
}

/* NEXT */
function next(){
    let g = guides[currentGuide];
    if(currentStep < g.steps.length -1){
        currentStep++;
        renderSteps();
    }
}

/* BACK */
function prev(){
    if(currentStep > 0){
        currentStep--;
        renderSteps();
    }
}

/* FAQ */
let faqData = [
    {q:"Làm sao đăng nhập?", a:"Dùng tài khoản được cấp"},
    {q:"Quên mật khẩu?", a:"Liên hệ admin"},
    {q:"Có làm lại được không?", a:"Có trong phần ôn tập"}
];

let faqHTML = "";
faqData.forEach(f=>{
    faqHTML += `
    <div class="faq-item" onclick="toggleFAQ(this)">
        <b>${f.q}</b>
        <div class="faq-content">${f.a}</div>
    </div>`;
});

document.getElementById("faq").innerHTML = faqHTML;

function toggleFAQ(el){
    let c = el.querySelector(".faq-content");
    c.style.display = c.style.display=="block"?"none":"block";
}

/* SEARCH */
document.getElementById("search").oninput = function(){
    let value = this.value.toLowerCase();

    let filtered = guides.filter(g => g.title.toLowerCase().includes(value));

    if(filtered.length > 0){
        loadGuide(guides.indexOf(filtered[0]));
    }
};

/* INIT */
loadGuide(0);