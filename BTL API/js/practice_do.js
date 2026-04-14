const API = "http://localhost:5000";

const url = new URL(window.location.href);
const mode = url.searchParams.get("mode");

let score = 0;
let total = 0;

function load(){

    let api = "/api/practice/random"; // mặc định

    fetch(API + api)
    .then(res=>res.json())
    .then(data=>{
        total = data.length;

        let html = "";

        data.forEach((q,index)=>{
            html += `
            <div class="question">
                <b>Câu ${index+1}: ${q.question}</b>

                <div class="option" onclick="check(this,'A','${q.correct}')">${q.a}</div>
                <div class="option" onclick="check(this,'B','${q.correct}')">${q.b}</div>
                <div class="option" onclick="check(this,'C','${q.correct}')">${q.c}</div>
                <div class="option" onclick="check(this,'D','${q.correct}')">${q.d}</div>
            </div>`;
        });

        document.getElementById("list").innerHTML = html;
    });
}

function check(el, choice, correct){

    let options = el.parentElement.querySelectorAll(".option");

    options.forEach(o=>o.style.pointerEvents="none");

    if(choice === correct){
        el.classList.add("correct");
        score++;
        document.getElementById("score").innerText = "Điểm: " + score;
    }else{
        el.classList.add("wrong");

        options.forEach(o=>{
            if(o.innerText === el.parentElement.children[correct.charCodeAt(0)].innerText){
                o.classList.add("correct");
            }
        });
    }
}

function finish(){
    window.location.href = `practice_result.html?score=${score}&total=${total}`;
}

load();