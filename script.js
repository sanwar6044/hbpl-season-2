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

// ======================================
// PLAYER REGISTRATION WIZARD
// ======================================

if (form) {
  const wizardPanels = form.querySelectorAll("[data-wizard-step]");
  const stepLabel = document.getElementById("wizardStepLabel");
  const stepName = document.getElementById("wizardStepName");
  const progressBar = document.getElementById("wizardProgressBar");
  const previewBox = document.getElementById("playerRegistrationPreview");

  let currentWizardStep = 1;
form.noValidate = true;
  function showWizardStep(step) {
    currentWizardStep = step;

    wizardPanels.forEach(panel => {
      panel.hidden = Number(panel.dataset.wizardStep) !== step;
    });

    const names = {
      1: "Player Details",
      2: "Address & Photo",
      3: "Preview & Submit"
    };

    if (stepLabel) stepLabel.textContent = `STEP ${step} OF 3`;
    if (stepName) stepName.textContent = names[step];
    if (progressBar) progressBar.style.width = `${step * 33.333}%`;
  }

  function validateWizardStep(step) {
    const panel = form.querySelector(
      `[data-wizard-step="${step}"]`
    );

    if (!panel) return false;

    const fields = panel.querySelectorAll("input, select, textarea");

    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    return true;
  }

  function createPreview() {
    if (!previewBox) return;

    previewBox.replaceChildren();

    const fields = [
      ["Player Name", form.elements.name.value],
      ["Mobile Number", form.elements.phone.value],
      ["Age", form.elements.age.value],
      ["Playing Role", form.elements.role.value],
      ["Address", form.elements.address.value],
      ["Photo", form.elements.photo.files[0]?.name || "Not selected"]
    ];

    fields.forEach(([label, value]) => {
      const row = document.createElement("p");
      const strong = document.createElement("strong");

      strong.textContent = label + ": ";
      row.append(strong, document.createTextNode(value));
      previewBox.appendChild(row);
    });
  }

  form.addEventListener("click", function(event) {
    const nextButton = event.target.closest("[data-wizard-next]");
    const backButton = event.target.closest("[data-wizard-back]");

    if (nextButton) {
      if (!validateWizardStep(currentWizardStep)) return;

      const nextStep = Number(nextButton.dataset.wizardNext);

      if (nextStep === 3) {
        if (!validateWizardStep(2)) return;
        createPreview();
      }

      showWizardStep(nextStep);
    }

    if (backButton) {
      showWizardStep(Number(backButton.dataset.wizardBack));
    }
  });

  form.addEventListener("reset", function() {
    showWizardStep(1);
    if (previewBox) previewBox.replaceChildren();
  });

  showWizardStep(1);
}

if (form) {

  form.addEventListener("submit", async function(event) {

    event.preventDefault();


    const button = form.querySelector(
      'button[type="submit"]'
    );

    const data = Object.fromEntries(
      new FormData(form).entries()
    );

    const photo = data.photo;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

if (
  !photo ||
  !allowedTypes.includes(photo.type) ||
  photo.size > 5 * 1024 * 1024
) {
  message.textContent = "Upload JPG, PNG or WebP photo up to 5 MB.";
  return;
}

const registration = {
  player_name: String(data.name || "").trim(),
  mobile: String(data.phone || "").trim(),
  age: Number(data.age),
  role: String(data.role || ""),
  address: String(data.address || "").trim()
};

if (button) button.disabled = true;
message.textContent = "Uploading player photo...";

try {
  const extension = photo.type === "image/jpeg"
    ? "jpg"
    : photo.type === "image/png" ? "png" : "webp";

  const photoPath = `players/${crypto.randomUUID()}.${extension}`;

  const uploadResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/registration-photos/${photoPath}`,
    {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": photo.type,
        "x-upsert": "false"
      },
      body: photo
    }
  );

  if (!uploadResponse.ok) {
    throw new Error("Photo upload failed: " + await uploadResponse.text());
  }

  message.textContent = "Saving player registration...";

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/register_player`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_player_name: registration.player_name,
        p_mobile: registration.mobile,
        p_age: registration.age,
        p_role: registration.role,
        p_address: registration.address,
        p_photo_path: photoPath
      })
    }
  );

if (!response.ok) {
  const errorText = await response.text();
  throw new Error(errorText || "Registration failed");
}

const savedRows = await response.json();
const savedRegistration = savedRows?.[0];

if (!savedRegistration?.application_no) {
  throw new Error("Application ID was not returned.");
}
if (message) {
  message.textContent =
    "Registration successful! Your Application ID: " +
    savedRegistration.application_no +
    ". Save this ID for status checking.";
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

    const photo = data.photo;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!photo || !allowedTypes.includes(photo.type) || photo.size > 5 * 1024 * 1024) {
      teamMessage.textContent = "Upload JPG, PNG or WebP photo up to 5 MB.";
      return;
    }

    if (!/^[0-9]{10}$/.test(String(data.owner_mobile || "").trim())) {
      teamMessage.textContent = "Enter a valid 10-digit mobile number.";
      return;
    }

    button.disabled = true;
    teamMessage.textContent = "Uploading team owner photo...";

    try {
      const extension = photo.type === "image/jpeg"
        ? "jpg"
        : photo.type === "image/png" ? "png" : "webp";

      const photoPath = `teams/${crypto.randomUUID()}.${extension}`;

      const uploadResponse = await fetch(
        `${SUPABASE_URL}/storage/v1/object/registration-photos/${photoPath}`,
        {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": photo.type,
            "x-upsert": "false"
          },
          body: photo
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Photo upload failed: " + await uploadResponse.text());
      }

      teamMessage.textContent = "Saving team registration...";

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
          owner_mobile: data.owner_mobile.trim(),
          owner_photo_path: photoPath,
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

    const receiptFile = document.getElementById("receiptFile");

    const amounts = {
  player_registration: 150,
  team_entry: 7000,
  auction_money: 25000
};

    paymentType.addEventListener("change", () => {
        paymentAmount.value = amounts[paymentType.value] || "";
    });

    paymentForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const type = paymentType.value;

      const applicationNo = document.getElementById("paymentApplicationNo").value.trim();
const registeredMobile = document.getElementById("paymentRegisteredMobile").value.trim();
        const utr = utrNumber.value.trim();
        const amount = amounts[type];
        const file = receiptFile.files[0];

      if (
  type === "player_registration" &&
  (
    !applicationNo ||
    !registeredMobile ||
    !/^HBPL2-\d{4}$/.test(applicationNo) ||
    !/^[0-9]{10}$/.test(registeredMobile)
  )
) {
  paymentMessage.textContent =
    "Please enter valid Application Number and registered mobile number.";
  return;
}

if (!amount || !utr || utr.length < 8 || utr.length > 30 || !file) {
  paymentMessage.textContent =
    "Please enter valid payment details and upload screenshot.";
  return;
}

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
            paymentMessage.textContent = "Only JPG, PNG or WebP images up to 5 MB are allowed.";
            return;
        }

        const button = paymentForm.querySelector('button[type="submit"]');
        button.disabled = true;
        paymentMessage.textContent = "Uploading screenshot...";

        let uploadedPath = "";

        try {
            const extension = file.type === "image/jpeg" ? "jpg" :
                              file.type === "image/png" ? "png" : "webp";

            const filePath = `${crypto.randomUUID()}.${extension}`;

            const uploadResponse = await fetch(
                `${SUPABASE_URL}/storage/v1/object/payment-receipts/${filePath}`,
                {
                    method: "POST",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": file.type,
                        "x-upsert": "false"
                    },
                    body: file
                }
            );

            if (!uploadResponse.ok) {
                throw new Error("Screenshot upload failed: " + await uploadResponse.text());
            }

            uploadedPath = filePath;
            paymentMessage.textContent = "Saving payment details...";
          const lookupResponse = await fetch(
  `${SUPABASE_URL}/rest/v1/rpc/get_player_registration_id`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({
      p_application_no: applicationNo,
      p_mobile: registeredMobile
    })
  }
);

if (!lookupResponse.ok) {
  throw new Error("Player registration lookup failed.");
}

const registrationId = await lookupResponse.json();

if (type === "player_registration" && !registrationId) {
  throw new Error("Player registration not found.");
}

            const response = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
  registration_id: type === "player_registration" ? registrationId : null,
  payment_type: type,
  amount: amount,
  utr_number: utr,
  receipt_url: uploadedPath,
  payment_status: "pending"
})
            });

            if (!response.ok) {
                throw new Error("Payment record failed: " + await response.text());
            }

            paymentMessage.textContent =
                "Payment submitted successfully! Verification is pending.";

            paymentForm.reset();
            paymentAmount.value = "";

        } catch (error) {
            paymentMessage.textContent = "Error: " + error.message;
        } finally {
            button.disabled = false;
        }
    });
}
      // PLAYER STATUS CHECK
const playerStatusForm = document.getElementById("playerStatusForm");
const playerStatusMessage = document.getElementById("playerStatusMessage");

if (playerStatusForm) {
  playerStatusForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const applicationNo = document
      .getElementById("statusApplicationNo").value.trim();

    const mobile = document
      .getElementById("statusMobile").value.trim();

    const button = playerStatusForm.querySelector('button[type="submit"]');

    button.disabled = true;
    playerStatusMessage.textContent = "Checking your application...";

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/check_player_status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({
            p_application_no: applicationNo,
            p_mobile: mobile
          })
        }
      );

      if (!response.ok) {
        throw new Error("Unable to check status. Please try again.");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        playerStatusMessage.textContent =
          "No application found. Please check your details.";
      } else {
        const player = data[0];
        const status = player.registration_status.toUpperCase();

        playerStatusMessage.textContent =
          `Name: ${player.player_name} | Application: ${player.application_no} | Status: ${status}`;
      }

    } catch (error) {
      playerStatusMessage.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
  
async function loadPublicWebsitePeople() {
  const box = document.getElementById("publicWebsitePeople");
  if (!box) return;

  box.textContent = "Loading members...";

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/website_people?select=full_name,designation,photo_url&is_active=eq.true&order=sort_order.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) throw new Error("Loading failed: " + response.status);

    const data = await response.json();
    box.innerHTML = "";

    if (!data.length) {
      box.textContent = "No team members added yet.";
      return;
    }

    data.forEach(person => {
      const card = document.createElement("div");
      card.className = "card";

      const name = document.createElement("h3");
      name.textContent = person.full_name;

      const role = document.createElement("p");
      role.textContent = person.designation;

      card.append(name, role);

      if (person.photo_url) {
        const img = document.createElement("img");
        img.src = person.photo_url;
        img.width = 160;
        img.alt = person.full_name;
        card.appendChild(img);
      }

      box.appendChild(card);
    });

  } catch (error) {
    box.textContent = "Unable to load members: " + error.message;
  }
}

loadPublicWebsitePeople();
  
}
