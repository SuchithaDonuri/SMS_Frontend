console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".login-form");
    const errorMsg = document.getElementById("errorMsg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const role = document.getElementById("role").value;
        const userId = document.getElementById("userid").value.trim();
        const password = document.getElementById("password").value.trim();

        errorMsg.textContent = "";

        if (!role || !userId || !password) {
            errorMsg.textContent = "Please fill all fields!";
            return;
        }

        try {
            const API_URL = "https://69ed83d4af4ff533142bc4c6.mockapi.io/users";

            const res = await fetch(API_URL);

            if (!res.ok) {
                throw new Error("API not responding");
            }

            const users = await res.json();

            let foundUser = users.find(user =>
                user.id === userId &&
                user.password === password &&
                user.role === role
            );

            if (foundUser) {
                console.log("Login Success", foundUser);

                if (role === "Principal") {
                    window.location.href = "pages/principal/principaldashboard.html";
                } 
                else if (role === "Teacher") {
                    window.location.href = "pages/teachers/teacherdashboard.html";
                } 
                else if (role === "Student") {
                    window.location.href = "pages/students/studentdashboard.html";
                } 
                else if (role === "Parent") {
                    window.location.href = "pages/parents/parentsdashboard.html";
                }

            } else {
                errorMsg.textContent = "Invalid credentials ❌";
            }

        } catch (err) {
            console.error(err);
            errorMsg.textContent = "Error fetching data ❌";
        }
    });

});