document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.logo-slider');
  let currentIndex = 0;
  const totalSlides = document.querySelectorAll('.slide').length;

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    const offset = -currentIndex * 100;
    slider.style.transform = `translateX(${offset}%)`;
  }

  setInterval(showNextSlide, 3000); // Change slide every 3 seconds
});

  