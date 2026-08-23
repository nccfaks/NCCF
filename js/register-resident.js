const registrationForm = document.querySelector(
  "#residentRegistrationForm"
);

const registrationButton = registrationForm.querySelector(
  ".submit-btn"
);

const successOverlay = document.querySelector("#successOverlay");
const closeSuccessButton = document.querySelector("#closeSuccess");

const stateCodePattern = /^AK\/\d{2}[ABC]\/\d{4}$/;
const phonePattern = /^(?:\+234|234|0)[789][01]\d{8}$/;

const stateCodeInput = document.querySelector("#stateCode");

stateCodeInput.addEventListener("input", (event) => {
  event.target.value = event.target.value.toUpperCase();
});

let previouslyFocusedElement = null;

function openSuccessModal() {
  previouslyFocusedElement = document.activeElement;

  successOverlay.classList.add("active");
  successOverlay.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  setTimeout(() => {
    closeSuccessButton.focus();
  }, 100);
}

function closeSuccessModal() {
  successOverlay.classList.remove("active");
  successOverlay.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function setButtonLoading(isLoading) {
  registrationButton.disabled = isLoading;

  registrationButton.innerHTML = isLoading
    ? '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...'
    : 'Submit Resident Registration <i class="fa-solid fa-arrow-right"></i>';
}

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!registrationForm.checkValidity()) {
    registrationForm.reportValidity();
    return;
  }

  const payload = {
    full_name: document.querySelector("#fullName").value.trim(),
    email: document.querySelector("#email").value.trim().toLowerCase(),
    phone: document.querySelector("#phone").value.trim(),
    state_code: stateCodeInput.value.trim().toUpperCase(),
    state_of_origin: document.querySelector("#stateOfOrigin").value,
    date_of_birth: document.querySelector("#dob").value,
    ppa: document.querySelector("#ppa").value.trim(),
    duration_of_stay: document.querySelector("#durationOfStay").value,
    next_of_kin_name: document.querySelector("#nextOfKinName").value.trim(),
    next_of_kin_phone: document.querySelector("#nextOfKinPhone").value.trim()
  };

  if (!stateCodePattern.test(payload.state_code)) {
    alert("Use a valid NYSC State Code, for example AK/25B/1371.");
    stateCodeInput.focus();
    return;
  }

  if (!phonePattern.test(payload.phone)) {
    alert("Enter a valid Nigerian phone number.");
    document.querySelector("#phone").focus();
    return;
  }

  if (!phonePattern.test(payload.next_of_kin_phone)) {
    alert("Enter a valid next-of-kin phone number.");
    document.querySelector("#nextOfKinPhone").focus();
    return;
  }

  setButtonLoading(true);

  try {
    const { data, error } = await supabaseClient.functions.invoke(
      "public-register-resident",
      {
        body: payload
      }
    );

    if (error) {
      throw error;
    }

    console.log("Successful registration:", data);

    registrationForm.reset();
    openSuccessModal();  

    } catch (error) {
    console.error("Registration error object:", error);

    let message = "Unable to submit registration. Please try again.";

    if (error.context) {
        console.log("Function status:", error.context.status);

        try {
        const errorBody = await error.context.json();

        console.log("Function error body:", errorBody);

        message = errorBody.error || errorBody.message || message;
        } catch (parseError) {
        console.error("Could not read function error response:", parseError);
        }
    }

    alert(message);
    } finally {
    setButtonLoading(false);
    }
});
successOverlay.addEventListener("click", (event) => {
  if (event.target === successOverlay) {
    closeSuccessModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    successOverlay.classList.contains("active")
  ) {
    closeSuccessModal();
  }
});
closeSuccessButton.addEventListener("click", closeSuccessModal);
console.log("Supabase client:", supabaseClient);