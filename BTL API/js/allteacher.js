const API = "http://localhost:5000/api/teachers"

// load danh sách
async function loadTeachers() {
    let res = await fetch(API)
    let data = await res.json()

    let html = ""
    data.forEach(t => {
        html += `
        <tr>
            <td>${t.id}</td>
            <td>${t.name}</td>
            <td>${t.username}</td>
            <td>
                <button onclick="deleteTeacher(${t.id})">❌ Xóa</button>
            </td>
        </tr>
        `
    })

    document.getElementById("teacherTable").innerHTML = html
}

// thêm giáo viên
async function addTeacher() {
    let name = document.getElementById("name").value
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    if (!name || !username || !password) {
        alert("Nhập đủ thông tin")
        return
    }

    let res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password })
    })

    let data = await res.json()

    if (data.error) {
        alert(data.error)
    } else {
        alert("Thêm thành công")
        loadTeachers()
    }
}

// xóa
async function deleteTeacher(id) {
    if (!confirm("Xóa giáo viên này?")) return

    await fetch(API + "/" + id, {
        method: "DELETE"
    })

    loadTeachers()
}
function goHome(){ location.href = "admin.html"; }
function goClass(){ location.href = "class.html"; }
function goSchedule(){ location.href = "schedule.html"; }
function goExam(){ location.href = "alltested.html"; }
function goPractice(){ location.href = "practice.html"; }
function goTest(){ location.href = "addtest.html"; }
function goNews(){ location.href = "news.html"; }
function goGuide(){ location.href = "guide.html"; }
function goTeacher(){ location.href = "allteacher.html"; }
// chạy
loadTeachers()