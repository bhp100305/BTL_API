function login(){
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!username || !password){
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.error){
            alert(data.error);
            return;
        }

        localStorage.clear();

        const user = {
            id: data.id,
            username: data.username,
            role: data.role,
            fullname: data.fullname,
            student_code: data.student_code || null
        };

        localStorage.setItem("user", JSON.stringify(user));

        console.log("Đã lưu user:", user);
        console.log("LocalStorage user:", localStorage.getItem("user"));

        if(user.role === "teacher"){
            window.location.href = "teacher.html";
        }
        else if(user.role === "admin"){
            window.location.href = "admin.html";
        }
        else{
            window.location.href = "student.html";
        }
    })
    .catch(err => {
        console.error(err);
        alert("Lỗi login!");
    });
}