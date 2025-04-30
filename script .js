document.addEventListener("DOMContentLoaded", () => {
    const user = document.querySelector(".user");
    const pass = document.querySelector(".pass");
  
    const login_btn = document.querySelector(".login-btn");
    const signup_btn = document.querySelector(".signup-btn");
  
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
  
    login_btn.addEventListener("click", async (event) => {
      event.preventDefault();
  
      // Get the user and password values from the form
      const username = user.value;
      const password = pass.value;
  
      // Perform the login request to the server
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          // If login is successful, redirect to the dashboard
          window.location.href = `Dashboard.html?name=${user.value}`;
        } else {
          // If login fails, show an error message
          alert(data.message || "Incorrect credentials!");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Server error, please try again later.");
      }
    });

    

  
    signup_btn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  
    document.querySelector(".admin-btn").addEventListener("click", function () {
      window.location.href = "adminlogin.html";
    });
  
    document.querySelector(".faculty-btn").addEventListener("click", function () {
      window.location.href = "facultylogin.html";
    });
  });
  