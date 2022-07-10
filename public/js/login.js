const error = document.querySelector(".error-message");

if (error) {
  setTimeout(() => {
    error.style.opacity = 0;
    error.style.top = "-100px";
    setTimeout(() => {
      error.remove();
    }, 1000);
  }, 5000);
}
