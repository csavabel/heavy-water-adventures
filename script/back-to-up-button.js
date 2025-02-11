document.addEventListener("DOMContentLoaded", function () {

    const backToTopButton = document.getElementById("backToTop");

    if (backToTopButton) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                backToTopButton.classList.add("show");
            } else {
                backToTopButton.classList.remove("show");
            }
        });

        window.scrollToTop = function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
    }
  
});
