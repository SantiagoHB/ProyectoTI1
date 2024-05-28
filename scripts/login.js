document.addEventListener("DOMContentLoaded", function () {
  // Usuario predeterminado
  const defaultUser = {
    username: "admin",
    password: "admin",
  };

  // Guardar el usuario predeterminado en localStorage si no existe
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([defaultUser]));
  }

  // Elementos del DOM
  const registerBtn = document.getElementById("register-btn");
  const registerPopup = document.getElementById("register-popup");
  const closeBtn = document.querySelector(".close-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const viewSelection = document.getElementById("view-selection");

  // Funciones
  const showPopup = (popup) => {
    if (popup) {
      popup.style.display = "flex";
    }
  };

  const hidePopup = (popup) => {
    if (popup) {
      popup.style.display = "none";
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = users.find(
      (user) => user.username === username && user.password === password
    );

    if (userFound) {
      alert("Login successful");
      localStorage.setItem("loggedInUser", username);
      showPopup(viewSelection);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((user) => user.username === newUsername);

    if (userExists) {
      alert("Username already exists");
    } else {
      users.push({ username: newUsername, password: newPassword });
      localStorage.setItem("users", JSON.stringify(users));
      alert("New user registered: " + newUsername);
      hidePopup(registerPopup);
    }
  };

  const handleViewSelection = (view) => {
    window.location.href = `../Vistas/${view}.html`;
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
  };

  const handleChangeView = () => {
    showPopup(viewSelection);
  };

  // Event Listeners
  if (registerBtn) {
    registerBtn.addEventListener("click", () => showPopup(registerPopup));
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => hidePopup(registerPopup));
  }

  if (registerPopup) {
    window.addEventListener("click", (event) => {
      if (event.target === registerPopup) {
        hidePopup(registerPopup);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  if (viewSelection) {
    document
      .getElementById("view-humedad")
      ?.addEventListener("click", () => handleViewSelection("humedad"));
    document
      .getElementById("view-temperatura")
      ?.addEventListener("click", () => handleViewSelection("temperatura"));
    document
      .getElementById("view-calidad-aire")
      ?.addEventListener("click", () => handleViewSelection("calidadaire"));
  }

  const loggedInUser = localStorage.getItem("loggedInUser");
  if (window.location.pathname.endsWith(".html")) {
    const userBtn = document.getElementById("user-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (loggedInUser && userBtn) {
      userBtn.textContent = loggedInUser;
    } else if (!loggedInUser) {
      window.location.href = "../index.html";
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", handleLogout);
    }
  }

  if (document.getElementById("change-view-btn")) {
    document
      .getElementById("change-view-btn")
      .addEventListener("click", handleChangeView);
  }
});
