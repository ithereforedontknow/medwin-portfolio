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
class LazyCarousel {
  constructor() {
    this.slides = document.querySelectorAll(".slide[data-bg]");
    this.loadedImages = new Set();
    this.currentSlide = 0;

    this.init();
  }

  init() {
    // Load the first slide immediately
    this.loadSlide(0);

    // Preload adjacent slides
    this.preloadAdjacentSlides();

    // Set up intersection observer for better performance
    this.setupIntersectionObserver();

    // Set up carousel navigation
    this.setupCarouselNavigation();
  }

  loadSlide(index) {
    if (this.loadedImages.has(index) || !this.slides[index]) return;

    const slide = this.slides[index];
    const imageSrc = slide.dataset.bg;

    slide.classList.add("loading");

    // Create a new image to preload
    const img = new Image();

    img.onload = () => {
      slide.style.backgroundImage = `url('${imageSrc}')`;
      slide.classList.remove("loading");
      slide.classList.add("loaded");
      this.loadedImages.add(index);
    };

    img.onerror = () => {
      slide.classList.remove("loading");
      slide.querySelector(".slide-placeholder").innerHTML =
        '<span style="color: #999;">Failed to load image</span>';
    };

    img.src = imageSrc;
  }

  preloadAdjacentSlides() {
    const totalSlides = this.slides.length;

    // Load previous and next slides
    const prevIndex = (this.currentSlide - 1 + totalSlides) % totalSlides;
    const nextIndex = (this.currentSlide + 1) % totalSlides;

    this.loadSlide(prevIndex);
    this.loadSlide(nextIndex);
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slideIndex = Array.from(this.slides).indexOf(entry.target);
            this.loadSlide(slideIndex);
          }
        });
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    this.slides.forEach((slide) => {
      observer.observe(slide);
    });
  }

  setupCarouselNavigation() {
    const prevBtn = document.querySelector(".btn.prev");
    const nextBtn = document.querySelector(".btn.next");
    const dots = document.querySelectorAll(".dot");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.previousSlide());
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextSlide());
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });
  }

  previousSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  updateCarousel() {
    // Load current slide and adjacent slides
    this.loadSlide(this.currentSlide);
    this.preloadAdjacentSlides();

    // Update active dot
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });

    // Update carousel position (you might need to adjust this based on your existing carousel logic)
    const track = document.querySelector(".carousel-track");
    if (track) {
      const slideWidth = 100; // Assuming 100% width per slide
      track.style.transform = `translateX(-${this.currentSlide * slideWidth}%)`;
    }
  }
}

// Initialize lazy carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new LazyCarousel();
});

// Fallback: Initialize if DOMContentLoaded has already fired
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new LazyCarousel());
} else {
  new LazyCarousel();
}
