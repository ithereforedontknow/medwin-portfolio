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
// Enhanced form handling with AJAX submission
//
const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateCarousel();
  });
});

setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}, 4000);
