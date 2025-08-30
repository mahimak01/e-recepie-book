
  const form = document.getElementById("registerForm");
  const emailInput = document.getElementById("inputEmail");
  const passwordInput = document.getElementById("inputPassword");
  const togglePassword = document.getElementById("togglePassword");

  // Show/Hide Password Toggle
  togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
  });

  // Regex Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  // Function to hash password
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;

    // Validate Email
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    } else {
      emailInput.classList.remove("is-invalid");
    }

    // Validate Password
    if (!passwordRegex.test(passwordInput.value.trim())) {
      passwordInput.classList.add("is-invalid");
      isValid = false;
    } else {
      passwordInput.classList.remove("is-invalid");
    }

    // If valid, hash and store
    if (isValid) {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Save to localStorage
      const userData = {
        email: email,
        passwordHash: hashedPassword
      };
      localStorage.setItem("registeredUser", JSON.stringify(userData));

      // Show toast
      const toast = new bootstrap.Toast(document.getElementById("successToast"));
      toast.show();

      // Redirect after toast
      setTimeout(() => {
        window.location.href = "homePage.html"; // Replace with your actual home page
      }, 2500);
    }
  });
  

