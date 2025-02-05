document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById("mainNav");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    });
});

