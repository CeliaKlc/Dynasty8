let currentPhotos = [];
let currentIndex = 0;

function openSlider(photos, index) {
  currentPhotos = photos;
  currentIndex = index;
  updateSliderImage();
  document.getElementById('sliderLightbox').classList.add('active');
}

function updateSliderImage() {
  const sliderImage = document.getElementById('sliderImage');
  sliderImage.src = currentPhotos[currentIndex];
}

function nextPhoto() {
  currentIndex = (currentIndex + 1) % currentPhotos.length;
  updateSliderImage();
}

function prevPhoto() {
  currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
  updateSliderImage();
}

function closeSlider() {
  document.getElementById('sliderLightbox').classList.remove('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG' && e.target.closest('.image-grid')) {
    const imgElements = [...e.target.closest('.image-grid').querySelectorAll('img')];
    const srcList = imgElements.map(img => img.src);
    const clickedIndex = imgElements.indexOf(e.target);
    openSlider(srcList, clickedIndex);
  }
});
