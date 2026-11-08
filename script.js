// ======================================
// HBPL SEASON 2 - REAL DATABASE VERSION
// ======================================


  const SUPABASE_URL = "https://izcmltsynxecmvwpvpwf.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_bsOWgTYMvizka3LfftaIYg_naJI0ukF";


// ======================================
// MOBILE NAVIGATION
// ======================================

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


// ======================================
// PLAYER REGISTRATION
// ======================================

const form = document.getElementById("regForm");
const message = document.getElementById("formMessage");

if (form) {

  form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const button = form.querySelector(
      'button[type="submit"]'
    );

    const data = Object.fromEntries(
      new FormData(form).entries()
    );

    const registration = {
      player_name: String(data.name || "").trim(),
      mobile: String(data.phone || "").trim(),
      age: Number(data.age),
      role: String(data.role || ""),
      address: String(data.address || "").trim(),
      registration_status: "pending"
    };

    if (message) {
      message.textContent = "Submitting registration...";
    }

    if (button) button.disabled = true;

    try {

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/registrations`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Prefer": "return=minimal"
          },

          body: JSON.stringify(registration)
        }
      );

      if (!response.ok) {
  const errorText = await response.text();
  throw new Error(errorText || "Registration failed");
}

if (message) {
  message.textContent =
    "Registration submitted successfully!";
}


    

      form.reset();

    } catch (error) {

      console.error("HBPL Registration Error:", error);

      if (message) {
        message.textContent =
          "Registration failed: " + error.message;
      }

    } finally {

      if (button) button.disabled = false;

    }

  });

}
