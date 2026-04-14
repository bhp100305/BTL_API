function login(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/api/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
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
        }else{
            localStorage.setItem("user", JSON.stringify(data));

            if(data.role === "admin"){
                window.location.href = "admin.html";
            }else{
                window.location.href = "student.html";
            }
        }
    })
    .catch(err => {
        console.error(err);
        alert("Không kết nối được server!");
    });
}