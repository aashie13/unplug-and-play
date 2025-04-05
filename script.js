// Scroll to form on CTA click
function scrollToForm(e) {
    e.preventDefault();
    const form = document.getElementById("signup-form");
    if (form) {
      const offset = -95; // adjust as needed
      const top = form.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
  
  // JWT decoder
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  
  // Handle Google One Tap credential response
  function handleCredentialResponse(response) {
    const data = parseJwt(response.credential);
    const nameField = document.querySelector('input[name="name"]');
    const emailField = document.querySelector('input[name="email"]');
  
    // Autofill form fields
    nameField.value = data.name || '';
    emailField.value = data.email || '';
  
    // Scroll to form
    const form = document.getElementById("signup-form");
    if (form) {
      const offset = -95;
      const top = form.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  
    // Submit form
    form.requestSubmit();
  }
  
  // Form submit with success message
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup-form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });
  
      if (response.ok) {
        form.reset();
        const msg = document.getElementById("success-msg");
        msg.style.visibility = "visible";
        msg.style.opacity = "1";
        setTimeout(() => {
          msg.style.opacity = "0";
          setTimeout(() => {
            msg.style.visibility = "hidden";
          }, 500);
        }, 3000);
      } else {
        alert("Oops! Something went wrong.");
      }
    });
  });
  
  // Initialize Google One Tap
  window.onload = function () {
    const checkGoogleLoaded = () => {
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: "134517139425-og39qdl7ve4jr3cjtldsne82u7v9foob.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        google.accounts.id.prompt();
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };
  
    checkGoogleLoaded();
  };
  