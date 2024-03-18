const DesktopLoginBtn = document.getElementById("header-login-btn");
const DesktopProfileBtn = document.getElementById("header-profile-btn");
const mobileLogin = document.getElementById("mobile-login-btn");
const mobileProfile = document.getElementById("mobile-profile-btn");
const session = window.localStorage.getItem("session") ?? null;
const mobileMenuBtn = document.getElementById("mobile-menu");
const mobileNav = document.getElementById("mobile-nav");

if (session) {
  DesktopLoginBtn.style.display = "none";
  DesktopProfileBtn.style.display = "block";
  mobileLogin.style.display = "none";
  mobileProfile.style.display = "block";
} else {
  DesktopLoginBtn.style.display = "block";
  mobileLogin.style.display = "block";
  DesktopProfileBtn.style.display = "none";
  mobileProfile.style.display = "none";
}

const toggleMenu = () => {
  if (mobileNav.classList.contains("mobile-display")) {
    mobileNav.style.display = "flex";
    mobileNav.classList.remove("mobile-display");
    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-white" ></i>';
  } else {
    mobileNav.classList.add("mobile-display");
    mobileNav.style.display = "none";
    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-white" " ></i>';
  }
};

mobileMenuBtn.addEventListener("click", toggleMenu);
