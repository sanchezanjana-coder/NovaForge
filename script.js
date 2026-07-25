// ===============================
// NovaForge
// Main Script
// ===============================

// Botón principal de la Landing
const getStartedButtons = document.querySelectorAll(".primaryButton, .navButton");

getStartedButtons.forEach(button => {

    button.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });

});
