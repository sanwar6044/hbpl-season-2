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
// TEAM REGISTRATION
const teamForm = document.getElementById("teamForm");
const teamMessage = document.getElementById("teamMessage");

if (teamForm) {
  teamForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const button = teamForm.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(teamForm).entries());

    button.disabled = true;
    teamMessage.textContent = "Submitting team registration...";

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          team_name: data.team_name.trim(),
          owner_name: data.owner_name.trim(),
          status: "pending"
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      teamMessage.textContent = "Team registration submitted successfully!";
      teamForm.reset();

    } catch (error) {
      teamMessage.textContent = "Registration failed: " + error.message;
    } finally {
      button.disabled = false;
    }
  });
}
// PAYMENT FORM
const paymentForm = document.getElementById("paymentForm");

if (paymentForm) {
  const paymentType = document.getElementById("paymentType");
  const paymentAmount = document.getElementById("paymentAmount");
  const utrNumber = document.getElementById("utrNumber");
  const paymentMessage = document.getElementById("paymentMessage");

  const amounts = {
    player: 150,
    team: 7000,
    auction: 25000
  };

  paymentType.addEventListener("change", () => {
    paymentAmount.value = amounts[paymentType.value] || "";
  });

  paymentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const type = paymentType.value;
    const utr = utrNumber.value.trim();
    const amount = amounts[type];

    if (!amount || utr.length < 8 || utr.length > 30) {
      paymentMessage.textContent = "Please enter valid payment details.";
      return;
    }

    const button = paymentForm.querySelector('button[type="submit"]');
    button.disabled = true;
    paymentMessage.textContent = "Submitting payment...";

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          payment_type: type,
          amount: amount,
          utr_number: utr,
          payment_status: "pending"
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      paymentMessage.textContent =
        "Payment details submitted! Verification is pending.";

      paymentForm.reset();
      paymentAmount.value = "";

    } catch (error) {
      paymentMessage.textContent = "Payment failed: " + error.message;
    } finally {
      button.disabled = false;
    }
  });
}
