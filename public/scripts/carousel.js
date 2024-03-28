const imagePaths = [
  "./assets/banner_Img/banner1.jpg",
  "./assets/banner_Img/banner2.jpg",
  "./assets/banner_Img/banner3.jpg",
];

class Carousel {
  constructor(container, images) {
    this.container = container;
    this.images = images;
    this.currentIndex = 0;
    this.intervalId = null;
    this.carousel = null;
    this.bulletsContainer = null;

    this.prevBtn = document.querySelector(".prev_btn");
    this.nextBtn = document.querySelector(".next_btn");

    this.init();
  }

  init() {
    this.renderCarousel();
    this.renderBullets();
    this.startInterval();
    this.addEventListeners();
  }

  renderCarousel() {
    this.carousel = document.createElement("div");
    this.carousel.classList.add("carousel");
    this.images.forEach((path) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel_item");
      const image = new Image();
      image.src = path;
      carouselItem.appendChild(image);
      this.carousel.appendChild(carouselItem);
    });
    this.container.appendChild(this.carousel);
  }

  renderBullets() {
    this.bulletsContainer = document.querySelector(".bullets_container");
    this.images.forEach((_, index) => {
      const bullet = document.createElement("div");
      bullet.classList.add("bullet");
      bullet.addEventListener("click", () => {
        this.goToSlide(index);
      });
      this.bulletsContainer.appendChild(bullet);
    });
    this.updateBullets();
  }

  updateBullets() {
    const bullets = Array.from(this.bulletsContainer.children);
    bullets.forEach((bullet, idx) => {
      bullet.classList.toggle("active", idx === this.currentIndex);
    });
  }

  startInterval() {
    this.intervalId = setInterval(() => {
      this.goToSlide((this.currentIndex + 1) % this.images.length);
    }, 2000);
  }

  stopInterval() {
    clearInterval(this.intervalId);
  }

  resetInterval() {
    this.stopInterval();
    this.startInterval();
  }

  // 특정 이미지로 이동
  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetInterval();
  }

  updateCarousel() {
    this.carousel.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateBullets();
  }

  addEventListeners() {
    this.prevBtn.addEventListener("click", () => {
      this.goToSlide(
        (this.currentIndex - 1 + this.images.length) % this.images.length
      );
    });

    this.nextBtn.addEventListener("click", () => {
      this.goToSlide((this.currentIndex + 1) % this.images.length);
    });
  }
}

const carouselContainer = document.querySelector(".carousel");
const carousel = new Carousel(carouselContainer, imagePaths);
