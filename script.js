// ========================
// 3D Tilt (Premium effect)
// ========================
function addTilt(el, maxTilt = 8) {
  if (!el) return;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (isTouch) return; // skip tilt on touch devices for better UX

  const handleMove = (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const tiltX = (maxTilt / 2 - y * maxTilt).toFixed(2);
    const tiltY = (x * maxTilt - maxTilt / 2).toFixed(2);

    el.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
  };

  const reset = () => {
    el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  el.addEventListener("mousemove", handleMove);
  el.addEventListener("mouseleave", reset);
  el.addEventListener("mouseenter", reset);
}

// ========================
// Form validation helpers
// ========================
const showError = (id, msg) => {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
};

const clearErrors = () => {
  [
    "nameError","emailError","mobileError","whatsappError",
    "collegeError","departmentError","yearError",
    "domainError","batchError","languageError","termsError"
  ].forEach((id) => showError(id, ""));
};

const is10Digit = (v) => /^\d{10}$/.test(v);

document.addEventListener("DOMContentLoaded", () => {
  // Apply tilt effects
  addTilt(document.getElementById("heroTilt"), 10);
  document.querySelectorAll(".detail-card").forEach((card) => addTilt(card, 8));
  addTilt(document.querySelector(".signup-form"), 6);
  addTilt(document.querySelector(".success-content"), 6);

  // Copy mobile -> WhatsApp toggle
  const copyToggle = document.getElementById("copyMobileToWhatsApp");
  const mobile = document.getElementById("mobile");
  const whatsapp = document.getElementById("whatsapp");

  if (copyToggle && mobile && whatsapp) {
    const sync = () => {
      if (copyToggle.checked) whatsapp.value = mobile.value;
    };
    copyToggle.addEventListener("change", sync);
    mobile.addEventListener("input", sync);
  }

  // Form submission
  const form = document.getElementById("signupForm");
  const successMessage = document.getElementById("successMessage");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    let ok = true;

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const mobileVal = mobile?.value.trim();
    const whatsappVal = whatsapp?.value.trim();
    const college = document.getElementById("college")?.value.trim();
    const department = document.getElementById("department")?.value.trim();
    const domain = document.getElementById("domain")?.value;
    const batch = document.getElementById("batch")?.value;
    const language = document.getElementById("language")?.value;
    const terms = document.getElementById("terms")?.checked;

    const yearChecked = document.querySelector('input[name="yearOfStudy"]:checked');

    if (!name) { showError("nameError", "Please enter your name."); ok = false; }
    if (!email) { showError("emailError", "Please enter your email."); ok = false; }

    if (!mobileVal || !is10Digit(mobileVal)) {
      showError("mobileError", "Enter a valid 10-digit mobile number.");
      ok = false;
    }

    if (!whatsappVal || !is10Digit(whatsappVal)) {
      showError("whatsappError", "Enter a valid 10-digit WhatsApp number.");
      ok = false;
    }

    if (!college) { showError("collegeError", "Please enter your college/university."); ok = false; }
    if (!department) { showError("departmentError", "Please enter your department."); ok = false; }

    if (!yearChecked) { showError("yearError", "Please select your year of study."); ok = false; }

    if (!domain) { showError("domainError", "Please select a domain."); ok = false; }
    if (!batch) { showError("batchError", "Please select a batch month."); ok = false; }
    if (!language) { showError("languageError", "Please select a language."); ok = false; }

    if (!terms) { showError("termsError", "Please agree to receive communications."); ok = false; }

    if (!ok) {
      // Nice shake animation
      form.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(6px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 320, iterations: 1 }
      );
      return;
    }

    // Success UI
    form.style.display = "none";
    successMessage.style.display = "block";
    window.scrollTo({ top: successMessage.offsetTop - 80, behavior: "smooth" });
  });
});
