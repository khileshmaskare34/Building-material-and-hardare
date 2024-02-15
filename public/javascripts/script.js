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
  

 