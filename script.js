// Add active state management
const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // Remove active class from all links
    navLinks.forEach((l) => l.classList.remove("active"));
    // Add active class to clicked link
    link.classList.add("active");
    // Smooth scroll to section (if sections exist)
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Enhanced scroll effect with auto-hide functionality
let lastScrollY = 0;
let ticking = false;

function updateNavbar() {
  const navbar = document.querySelector(".navbar");
  const currentScrollY = window.scrollY;

  // Change background based on scroll position
  if (currentScrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.15)";
    navbar.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.2)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.1)";
    navbar.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
  }

  // Auto-hide logic
  if (currentScrollY < 100) {
    // Always show navbar at the very top
    navbar.classList.remove("hide");
  } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
    // Scrolling down and past threshold - hide navbar
    navbar.classList.add("hide");
  } else if (currentScrollY < lastScrollY) {
    // Scrolling up - show navbar
    navbar.classList.remove("hide");
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateNavbar);
    ticking = true;
  }
}

window.addEventListener("scroll", requestTick);
document
  .querySelector(".contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Simple validation
    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    // Simulate form submission
    const submitBtn = this.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
      alert("Thank you for your message! We'll get back to you soon.");
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
