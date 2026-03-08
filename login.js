document.getElementById("loginBtn").addEventListener("click", () =>{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "admin" && password === "admin123"){
        window.location.assign("dashboard.html");
    }else{
        alert("Username or Password Incorrect")
    }
});