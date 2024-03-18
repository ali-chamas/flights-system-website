const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginSwitch = document.getElementById("login-switch");
const signupSwitch = document.getElementById("signup-switch");

const usernameLoginInput = document.getElementById("username-login");
const passwordLoginInput = document.getElementById("pass-login");
const nameSignupInput = document.getElementById("name-signup");
const usernameSignupInput = document.getElementById("username-signup");
const passwordSignupInput = document.getElementById("pass-signup");
const imageSignUpInput = document.getElementById("image-signup");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");

if (!session || session == "loggedOut") {
} else {
  window.location.assign("/client");
}

let newUser = {
  name: "",
  email: "",
  password: "",
  image: "",
};

let oldUser = {
  email: "",
  password: "",
};

signupForm.style.display = "none";

signupSwitch.addEventListener("click", () => {
  loginForm.style.display = "none";
  signupForm.style.display = "flex";
  resetInputs();
  resetErrors();
});
loginSwitch.addEventListener("click", () => {
  loginForm.style.display = "flex";
  signupForm.style.display = "none";
  resetInputs();
  resetErrors();
});

const resetOldUser = () => {
  oldUser = {
    email: "",
    password: "",
  };
};
const resetNewUser = () => {
  newUser = {
    name: "",
    email: "",
    password: "",
    image: "",
  };
};

const resetInputs = () => {
  usernameLoginInput.value = "";
  usernameSignupInput.value = "";
  passwordLoginInput.value = "";
  passwordSignupInput.value = "";
  nameSignupInput.value = "";
};

const checkEmptyInputs = (type) => {
  if (type == "login") {
    if (oldUser.email == "" || oldUser.password == "") {
      return true;
    }
  } else if (type == "signup") {
    if (newUser.email == "" || newUser.name == "" || newUser.password == "") {
      return true;
    }
  }
  return false;
};

const login = async () => {
  if (checkEmptyInputs("login")) {
    displayLoginError("please fill all fields");
  } else {
    try {
      const user = new FormData();
      user.append("email", oldUser.email);
      user.append("password", oldUser.password);
      const res = await fetch(`${apiURL}/auth/login.php`, {
        method: "POST",
        body: user,
      });
      const data = await res.json();
      if (data.status == "logged in") {
        // window.localStorage.setItem("session", JSON.stringify(data.user));
        if (data.user.isAdmin) {
          window.location.assign("/client/pages/admin/adminPanel");
        } else {
          window.location.assign("/client");
        }
      } else {
        displayLoginError(data.status);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const signup = async () => {
  if (checkEmptyInputs("signup")) {
    displaySignupError("please fill all fields");
  } else {
    try {
      const user = new FormData();
      user.append("name", newUser.name);
      user.append("email", newUser.email);
      user.append("password", newUser.password);
      user.append("image", newUser.image);
      const res = await fetch(`${apiURL}/auth/signup.php`, {
        method: "POST",
        body: user,
      });
      const data = await res.json();
      if (data.status == "success") {
        // window.localStorage.setItem("session", JSON.stringify(data.user));
        if (data.user.isAdmin) {
          window.location.assign("/client/pages/admin/adminPanel");
        } else {
          window.location.assign("/client");
        }
      } else {
        displaySignupError(data.status);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const displayLoginError = (message) => {
  loginError.innerHTML = message;
};

const displaySignupError = (message) => {
  signupError.innerHTML = message;
};

const resetErrors = () => {
  loginError.innerHTML = "";
  signupError.innerHTML = "";
};

usernameLoginInput.addEventListener("change", (e) => {
  oldUser.email = e.target.value;
});

passwordLoginInput.addEventListener("change", (e) => {
  oldUser.password = e.target.value;
});

nameSignupInput.addEventListener("change", (e) => {
  newUser.name = e.target.value;
});

usernameSignupInput.addEventListener("change", (e) => {
  newUser.email = e.target.value;
});

passwordSignupInput.addEventListener("change", (e) => {
  newUser.password = e.target.value;
});
imageSignUpInput.addEventListener("change", (e) => {
  newUser.image = e.target.value;
});

loginBtn.addEventListener("click", login);
signupBtn.addEventListener("click", signup);
