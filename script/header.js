document.addEventListener("DOMContentLoaded", function () {
    const heroSlider = document.getElementById("heroSlider");
    let touchStartX = 0;
    let touchEndX = 0;

    
    heroSlider.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
    });

 
    heroSlider.addEventListener("touchend", function (event) {
        touchEndX = event.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum húzás távolság a váltáshoz

        if (touchStartX - touchEndX > swipeThreshold) {
            
            new bootstrap.Carousel(heroSlider).next();
        } else if (touchEndX - touchStartX > swipeThreshold) {
         
            new bootstrap.Carousel(heroSlider).prev();
        }
    }
});
