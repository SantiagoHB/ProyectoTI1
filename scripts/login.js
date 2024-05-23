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
  var registerBtn = document.getElementById("register-btn");
  var registerPopup = document.getElementById("register-popup");
  var closeBtn = document.querySelector(".close-btn");
  var loginForm = document.getElementById("login-form");
  var registerForm = document.getElementById("register-form");

  // Mostrar el popup de registro
  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      registerPopup.style.display = "flex";
    });
  }

  // Cerrar el popup de registro
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      registerPopup.style.display = "none";
    });
  }

  // Cerrar el popup si se hace clic fuera del contenido
  if (registerPopup) {
    window.addEventListener("click", function (event) {
      if (event.target === registerPopup) {
        registerPopup.style.display = "none";
      }
    });
  }

  // Manejar el formulario de inicio de sesión
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      // Obtener usuarios de localStorage
      var users = JSON.parse(localStorage.getItem("users")) || [];

      // Verificar las credenciales
      var userFound = users.find(function (user) {
        return user.username === username && user.password === password;
      });

      if (userFound) {
        alert("Login successful");
        localStorage.setItem("loggedInUser", username); // Guardar el usuario logueado
        // Redirigir al home.html
        window.location.href = "../Vistas/home.html";
      } else {
        alert("Invalid username or password");
      }
    });
  }

  // Manejar el formulario de registro
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var newUsername = document.getElementById("new-username").value;
      var newPassword = document.getElementById("new-password").value;

      // Obtener usuarios de localStorage
      var users = JSON.parse(localStorage.getItem("users")) || [];

      // Verificar si el usuario ya existe
      var userExists = users.find(function (user) {
        return user.username === newUsername;
      });

      if (userExists) {
        alert("Username already exists");
      } else {
        // Añadir el nuevo usuario a la lista
        users.push({ username: newUsername, password: newPassword });
        localStorage.setItem("users", JSON.stringify(users));
        alert("New user registered: " + newUsername);
        registerPopup.style.display = "none";
      }
    });
  }

  // Mostrar el nombre del usuario logueado y manejar el cierre de sesión
  if (window.location.pathname.endsWith("home.html")) {
    var loggedInUser = localStorage.getItem("loggedInUser");
    var userBtn = document.getElementById("user-btn");
    var logoutBtn = document.getElementById("logout-btn");

    if (loggedInUser && userBtn) {
      userBtn.textContent = loggedInUser; // Mostrar el nombre del usuario logueado
    } else {
      window.location.href = "../index.html"; // Redirigir al login si no hay usuario logueado
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "../index.html";
      });
    }
  }
});
