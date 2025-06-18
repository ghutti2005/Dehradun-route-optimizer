document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  // Example credentials
  const validUser = {
    username: "admin",
    password: "password123"
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === validUser.username && password === validUser.password) {
      localStorage.setItem("isLoggedIn", "true");

      // Redirect with delay to allow DOM update (smoother UX)
      setTimeout(() => {
        window.location.href = "index.html";
      }, 100);
    } else {
      errorMsg.textContent = "Invalid credentials. Try again.";
    }
  });
});
