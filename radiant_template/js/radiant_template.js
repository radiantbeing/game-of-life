// Code for Menu Toggle Button
function createElement(string) {
  const temp = document.createElement("template");
  temp.innerHTML = string;
  return temp.content;
}

const toggleButton = createElement(/* html */ `
    <a class="navbar-toggle" id="navbarToggle" href="#">
        <img src="radiant_template/img/icon/icon_toggle_01_dark.svg" alt="toggle button">
    </a>`);

document.body.appendChild(toggleButton);

const navbarToggle = document.querySelector("#navbarToggle");
const navbarNavs = document.querySelector("#navbarNavs");
navbarToggle.addEventListener("click", (e) => {
  e.preventDefault();
  navbarNavs.classList.toggle("active");
});

// Code for dark mode activation

if (localStorage.getItem("dark-mode") === null) {
  const preferDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  localStorage.setItem("dark-mode", preferDarkMode);
}

const preferDarkMode = JSON.parse(localStorage.getItem("dark-mode"));

if (preferDarkMode) document.body.dataset.theme = "dark";
else document.body.dataset.theme = "false";

function toggleDarkMode() {
  if (document.body.dataset.theme === "dark") {
    document.body.dataset.theme = "light";
    localStorage.setItem("dark-mode", "false");
  } else {
    document.body.dataset.theme = "dark";
    localStorage.setItem("dark-mode", "true");
  }
}

const darkModeToggle = document.querySelector("#darkModeToggle");

darkModeToggle.addEventListener("click", (e) => {
  e.preventDefault();
  toggleDarkMode();
});
