document.addEventListener("DOMContentLoaded", function() {
    var popup = document.getElementById('popup-box');
    popup.style.display = 'block';
    var homepage = document.getElementById('main');
    homepage.style.opacity = "0.1";
  });
  
  function closePopup() {
    var popup = document.getElementById('popup-box');
    popup.style.display = 'none';
    var homepage = document.getElementById('main');
    homepage.style.opacity = "1";
  }
  
// new slider pagination added date 05/03/2024
 function pagination_slider(){
  document.addEventListener("DOMContentLoaded", function() {
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Event listener to move the slider left
    prevBtn.addEventListener('click', function() {
        const slideWidth = sliderContainer.offsetWidth;
        slider.scrollLeft -= slideWidth;
    });

    // Event listener to move the slider right
    nextBtn.addEventListener('click', function() {
        const slideWidth = sliderContainer.offsetWidth;
        slider.scrollLeft += slideWidth;
    });
});
}
pagination_slider();

function pagination_slider3d(){
  document.addEventListener("DOMContentLoaded", function() {
    const sliderContainer = document.querySelector('.slider-container3d');
    const slider = document.querySelector('.slider3d');
    const prevBtn = document.querySelector('.prev-btn3d');
    const nextBtn = document.querySelector('.next-btn3d');
    
    // Event listener to move the slider left
    prevBtn.addEventListener('click', function() {
        const slideWidth = sliderContainer.offsetWidth;
        slider.scrollLeft -= slideWidth;
    });

    // Event listener to move the slider right
    nextBtn.addEventListener('click', function() {
        const slideWidth = sliderContainer.offsetWidth;
        slider.scrollLeft += slideWidth;
    });
});
}
pagination_slider3d();
// new slider pagination added date 05/03/2024
