document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const toggleBtn = document.getElementById("toggleTheme");
  const themeIcon = document.getElementById("themeIcon");

  if (!toggleBtn || !themeIcon) return;

  const applyTheme = theme => {
    html.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
    themeIcon.className = theme === "dark" ? "bi bi-moon fs-5" : "bi bi-brightness-high fs-5";
  };

  // Load theme từ localStorage
  applyTheme(localStorage.getItem("theme") || "dark");

  // Sự kiện click đổi theme
  toggleBtn.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-bs-theme");
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });

  // Kích hoạt tooltip Bootstrap
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
});
