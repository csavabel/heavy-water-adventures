document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close-modal");
    const modalPrev = document.getElementById("modalPrev");
    const modalNext = document.getElementById("modalNext");

    let modalGallery = [];
    let modalIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelectorAll(".gallery-img").forEach(img => {
        img.addEventListener("click", function () {
            const gallery = this.closest(".lodge-gallery").getAttribute("data-gallery");
            modalGallery = Array.from(document.querySelectorAll(`.lodge-gallery[data-gallery="${gallery}"] .gallery-img`));
            modalIndex = parseInt(this.getAttribute("data-index"));

            modal.style.display = "flex";
            updateModal();
        });
    });

    function updateModal() {
        modalImg.src = modalGallery[modalIndex].src;
    }

    modalNext.addEventListener("click", function () {
        nextImage();
    });

    modalPrev.addEventListener("click", function () {
        prevImage();
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    modal.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
    });

    modal.addEventListener("touchend", function (event) {
        touchEndX = event.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextImage();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevImage(); 
        }
    }

    function nextImage() {
        modalIndex = (modalIndex + 1) % modalGallery.length;
        updateModal();
    }

    function prevImage() {
        modalIndex = (modalIndex - 1 + modalGallery.length) % modalGallery.length;
        updateModal();
    }
});
