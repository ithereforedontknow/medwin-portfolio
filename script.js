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
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".gallery-track");
  const slides = Array.from(track.children);

  // Clone slides for infinite effect
  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });

  // Preload images
  const images = document.querySelectorAll(".slide img");
  images.forEach((img) => {
    if (img.complete) {
      img.style.opacity = 1;
    } else {
      img.addEventListener("load", () => {
        img.style.opacity = 1;
      });
      img.style.opacity = 0;
      img.style.transition = "opacity 0.5s ease";
    }
  });
});
// Enhanced Lazy Loading Controller
class LazyLoader {
  constructor() {
    this.lazyMedia = document.querySelectorAll('[loading="lazy"], [data-lazy]');
    this.observer = null;
    this.init();
  }

  init() {
    // Check if IntersectionObserver is supported
    if ("IntersectionObserver" in window) {
      this.setupIntersectionObserver();
    } else {
      this.loadAllMedia(); // Fallback for older browsers
    }
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "200px", // Start loading when 200px away from viewport
      threshold: 0.01,
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadMedia(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all lazy elements
    this.lazyMedia.forEach((media) => {
      this.observer.observe(media);
    });
  }

  loadMedia(element) {
    if (element.tagName === "IMG") {
      this.loadImage(element);
    } else if (element.tagName === "VIDEO") {
      this.loadVideo(element);
    } else if (element.tagName === "IFRAME") {
      this.loadIframe(element);
    }
  }

  loadImage(img) {
    // Skip if already loaded
    if (img.dataset.loaded === "true") return;

    // Show placeholder while loading
    img.style.opacity = "0";
    img.style.transition = "opacity 0.5s ease";

    // Load the image
    const src = img.dataset.src || img.src;
    const tempImg = new Image();

    tempImg.onload = () => {
      img.src = src;
      img.style.opacity = "1";
      img.dataset.loaded = "true";

      // Handle responsive images
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    };

    tempImg.onerror = () => {
      console.error("Failed to load image:", src);
      // You could show a fallback image here
    };

    tempImg.src = src;
  }

  loadVideo(video) {
    if (video.dataset.loaded === "true") return;

    const sources = video.querySelectorAll("source");
    sources.forEach((source) => {
      const src = source.dataset.src;
      if (src) {
        source.src = src;
      }
    });

    video.load();
    video.dataset.loaded = "true";

    // For autoplay videos, mute them to comply with browser policies
    if (video.autoplay) {
      video.muted = true;
    }
  }

  loadIframe(iframe) {
    if (iframe.dataset.loaded === "true") return;

    iframe.src = iframe.dataset.src;
    iframe.dataset.loaded = "true";
  }

  loadAllMedia() {
    // Fallback for browsers without IntersectionObserver
    this.lazyMedia.forEach((media) => {
      this.loadMedia(media);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new LazyLoader();
});
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
