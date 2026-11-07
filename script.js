// HBPL Season 2 - Website JavaScript

// Mobile Navigation
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
        });
    });
}

// Player Registration
const form = document.getElementById("regForm");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const data = Object.fromEntries(
            new FormData(form).entries()
        );

        const registrations = JSON.parse(
            localStorage.getItem("hbpl_demo_registrations") || "[]"
        );

        data.id = "HBPL-" + Date.now().toString().slice(-7);
        data.submittedAt = new Date().toISOString();

        registrations.push(data);

        localStorage.setItem(
            "hbpl_demo_registrations",
            JSON.stringify(registrations)
        );

        const message = document.getElementById("formMessage");

        if (message) {
            message.textContentu =
                "Registration submitted successfully! Your ID: " + data.id;
        }

        form.reset();
    });
}
