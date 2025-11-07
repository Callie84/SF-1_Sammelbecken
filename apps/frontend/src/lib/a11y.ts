export function setMainLandmark() {
const main = document.getElementById("main");
if (main && !main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
}


export function focusMain() {
const main = document.getElementById("main");
if (main) main.focus();
}