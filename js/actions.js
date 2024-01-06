function updateActive() {
  Array.from(document.querySelectorAll(".button")).forEach((element) => {
    element.classList.remove("active");
  });
}
updateActive();

window.action = "";
document.querySelector("#cursor").addEventListener("click", () => {
  window.action = "cursor";
  updateActive();

  document.querySelector("#cursor").classList.add("active");
});
document.querySelector("#connect").addEventListener("click", () => {
  window.action = "connect";
  updateActive();

  document.querySelector("#connect").classList.add("active");
});
