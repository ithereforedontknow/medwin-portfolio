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
// Lazy loading implementation
// Optimized carousel with lazy loading and better performance
class OptimizedCarousel {
  constructor() {
    this.track = document.querySelector(".carousel-track");
    this.slides = document.querySelectorAll(".slide");
    this.prevBtn = document.querySelector(".prev");
    this.nextBtn = document.querySelector(".next");
    this.dots = document.querySelectorAll(".dot");

    this.currentIndex = 0;
    this.loadedImages = new Set();
    this.isTransitioning = false;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    if (!this.track || !this.slides.length) return;

    // Load first image immediately
    this.loadImage(0);

    // Preload next image
    this.loadImage(1);

    this.setupEventListeners();
    this.startAutoPlay();
    this.setupIntersectionObserver();
  }

  loadImage(index) {
    if (this.loadedImages.has(index) || !this.slides[index]) return;

    const slide = this.slides[index];
    const imageSrc = slide.dataset.bg;

    if (!imageSrc) return;

    const img = new Image();

    img.onload = () => {
      slide.style.backgroundImage = `url('${imageSrc}')`;
      slide.classList.add("loaded");
      this.loadedImages.add(index);
    };

    img.onerror = () => {
      console.warn(`Failed to load image: ${imageSrc}`);
    };

    img.src = imageSrc;
  }

  setupEventListeners() {
    // Navigation buttons
    this.prevBtn?.addEventListener("click", () => this.previousSlide());
    this.nextBtn?.addEventListener("click", () => this.nextSlide());

    // Dots navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    // Pause auto-play on hover
    this.track.addEventListener("mouseenter", () => this.pauseAutoPlay());
    this.track.addEventListener("mouseleave", () => this.startAutoPlay());

    // Handle visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseAutoPlay();
      } else {
        this.startAutoPlay();
      }
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startAutoPlay();
          } else {
            this.pauseAutoPlay();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.track);
  }

  updateCarousel() {
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    // Update transform with hardware acceleration
    requestAnimationFrame(() => {
      this.track.style.transform = `translate3d(-${
        this.currentIndex * 100
      }%, 0, 0)`;

      // Update dots
      this.dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === this.currentIndex);
      });

      // Preload adjacent images
      this.preloadAdjacentImages();

      // Reset transition flag after animation
      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);
    });
  }

  preloadAdjacentImages() {
    const totalSlides = this.slides.length;
    const prevIndex = (this.currentIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (this.currentIndex + 1) % totalSlides;

    this.loadImage(prevIndex);
    this.loadImage(nextIndex);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
  }

  previousSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
  }

  goToSlide(index) {
    if (index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateCarousel();
  }

  startAutoPlay() {
    this.pauseAutoPlay(); // Clear existing interval
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Optimized navbar scroll handling
class NavbarController {
  constructor() {
    this.navbar = document.querySelector(".navbar");
    this.lastScrollY = 0;
    this.ticking = false;

    this.init();
  }

  init() {
    if (!this.navbar) return;

    // Use passive event listener for better performance
    window.addEventListener("scroll", this.handleScroll.bind(this), {
      passive: true,
    });

    // Handle navigation clicks
    this.setupNavigation();
  }

  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(this.updateNavbar.bind(this));
      this.ticking = true;
    }
  }

  updateNavbar() {
    const currentScrollY = window.scrollY;

    // Batch DOM updates
    requestAnimationFrame(() => {
      // Change background based on scroll position
      if (currentScrollY > 50) {
        this.navbar.style.background = "rgba(255, 255, 255, 0.15)";
        this.navbar.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.2)";
      } else {
        this.navbar.style.background = "rgba(255, 255, 255, 0.1)";
        this.navbar.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
      }

      // Auto-hide logic
      if (currentScrollY < 100) {
        this.navbar.classList.remove("hide");
      } else if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
        this.navbar.classList.add("hide");
      } else if (currentScrollY < this.lastScrollY) {
        this.navbar.classList.remove("hide");
      }

      this.lastScrollY = currentScrollY;
      this.ticking = false;
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach((l) => l.classList.remove("active"));

        // Add active class to clicked link
        link.classList.add("active");

        // Smooth scroll to section
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }
}

// Initialize when DOM is ready
function initializeComponents() {
  new OptimizedCarousel();
  new NavbarController();
}

// Use more efficient DOM ready detection
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeComponents);
} else {
  initializeComponents();
} // Intro Animation Controller - Mobile Only
function startIntroAnimation() {
  // Check if device is mobile (screen width <= 768px)
  if (window.innerWidth <= 768) {
    const introOverlay = document.getElementById("introOverlay");
    const pageContent = document.getElementById("pageContent");

    // Hide page content initially on mobile
    pageContent.classList.add("mobile-hidden");

    // Start the intro sequence
    setTimeout(() => {
      introOverlay.classList.add("fade-out");

      // Show main content after intro fades out
      setTimeout(() => {
        introOverlay.style.display = "none";
        pageContent.classList.remove("mobile-hidden");
        pageContent.classList.add("show");
      }, 800);
    }, 2000); // Show name for 2 seconds
  } else {
    // On desktop, hide intro overlay and show content immediately
    const introOverlay = document.getElementById("introOverlay");
    const pageContent = document.getElementById("pageContent");

    introOverlay.style.display = "none";
    pageContent.classList.add("show");
  }
}

// Handle window resize to check if user switches between mobile/desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    const introOverlay = document.getElementById("introOverlay");
    const pageContent = document.getElementById("pageContent");

    // If user resizes to desktop, hide intro and show content
    introOverlay.style.display = "none";
    pageContent.classList.remove("mobile-hidden");
    pageContent.classList.add("show");
  }
});

// Start intro animation when page loads
window.addEventListener("load", startIntroAnimation);

function toggleMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");

  // Prevent body scroll when menu is open
  if (mobileMenu.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}
function removeMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.classList.remove("active");
  mobileMenu.classList.remove("active");

  document.body.style.overflow = "auto";
}

// Close menu when clicking on a link
document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    removeMenu();
  });
});

// Handle active state for navigation
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active class from all links
    document.querySelectorAll(".navbar a, .mobile-menu a").forEach((a) => {
      a.classList.remove("active");
    });

    // Add active class to clicked link and its counterpart
    const href = this.getAttribute("href");
    document.querySelectorAll(`a[href="${href}"]`).forEach((a) => {
      a.classList.add("active");
    });

    // Smooth scroll to section
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Hide navbar on scroll down, show on scroll up
let lastScrollTop = 0;
window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const navbar = document.querySelector(".navbar");

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.classList.add("hide");
  } else {
    navbar.classList.remove("hide");
  }
  lastScrollTop = scrollTop;
});
