let name = document.getElementsByClassName("name")[0];
let email = document.getElementsByClassName("email")[0];
let spass = document.getElementsByClassName("pass1")[0];
let c_pass = document.getElementsByClassName("c_pass")[0];
let submit_btn = document.getElementsByClassName("submit-btn")[0];

const about = document.getElementsByClassName("About")[0];
const dev = document.getElementsByClassName("Dev")[0];

about.addEventListener("click", () => {
    document.querySelector(".openAbout").style.display = "block";
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".openAbout").style.display = "none";
    });

});

dev.addEventListener("click", () => {
    document.querySelector(".openDev").style.display = "block";
    document.querySelector(".close1").addEventListener("click", () => {
        document.querySelector(".openDev").style.display = "none";
    });

});

submit_btn.addEventListener("click", async (event) => {
    event.preventDefault();

    if (name.value && email.value && spass.value && c_pass.value) {
        if (spass.value !== c_pass.value) {
            alert("Password does not match");
        } else {
            const userData = {
                username: name.value,   
                password: spass.value
            };

            try {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert("User Registered Successfully");
                    window.location.href = "login.html";
                } else {
                    alert(result.message || "Registration failed");
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Server error");
            }
        }
    } else {
        alert("Please fill all fields");
    }
});
