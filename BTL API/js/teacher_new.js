const API = "http://localhost:5000";

let newsData = [];

/* LOAD */
function loadNews(){
    fetch(API + "/api/news")
    .then(res=>res.json())
    .then(data=>{
        newsData = data;
        renderSlider();
        renderList(data);
    });
}

/* SLIDER */
function renderSlider(){

    let slider = document.getElementById("slider");
    let html = "";

    newsData.slice(0,3).forEach(n=>{
        html += `
        <div class="slide" style="background-image:url('${n.image}')">
            <div class="overlay">
                <h2>${n.title}</h2>
            </div>
        </div>`;
    });

    slider.innerHTML = html;
}

/* LIST NGANG */
function renderList(data){

    let html = "";

    data.forEach(n=>{
        html += `
        <div class="news-card" onclick="openNews('${n.title}','${n.content}')">

            <div class="news-img" style="background-image:url('${n.image}')"></div>

            <div class="news-content">
                <h4>${n.title}</h4>
                <p>${n.content.substring(0,60)}...</p>
                <small>⏱ ${formatTime(n.time)}</small>
            </div>

        </div>
        `;
    });

    document.getElementById("newsList").innerHTML = html;
}

/* FORMAT TIME */
function formatTime(t){
    let d = new Date(t);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

/* SEARCH */
document.getElementById("search").onkeyup = function(){

    let key = this.value.toLowerCase();

    let filtered = newsData.filter(n =>
        n.title.toLowerCase().includes(key)
    );

    renderList(filtered);
};

/* FILTER */
document.getElementById("filter").onchange = function(){

    let cate = this.value;

    let filtered = newsData.filter(n =>
        cate=="" || n.category == cate
    );

    renderList(filtered);
};

/* MODAL */
function openNews(title, content){

    let modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-box">
            <h3>${title}</h3>
            <p>${content}</p>
            <button onclick="this.parentElement.parentElement.remove()">Đóng</button>
        </div>
    `;

    document.body.appendChild(modal);
}
// ===== NAVIGATION =====
function goHome(){ location.href = "teacher.html"; }
function goClass(){ location.href = "teacher_class.html"; }
function goSchedule(){ location.href = "teacher_schedule.html"; }
function goExam(){ location.href = "teacher_exam.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "addtest.html"; }
function goNews(){ location.href = "teacher_new.html"; }
function goGuide(){ location.href = "teacher_new.guide.html"; }
loadNews();