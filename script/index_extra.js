document.addEventListener("DOMContentLoaded", function () {
    // BACK TO TOP BUTTON
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

    // COOKIE BANNER
    const cookieBanner = document.getElementById("cookieBanner");
    const acceptButton = document.getElementById("acceptCookiesBtn");

    if (cookieBanner && acceptButton) {
        // Ellenőrizzük, hogy a cookie-k el lettek-e már fogadva
        if (localStorage.getItem("cookiesAccepted") === "true") {
            cookieBanner.style.display = "none"; // Elrejtjük a bannert
        } else {
            cookieBanner.style.display = "flex"; // Ha nincs elfogadva, megjelenítjük
        }

        // Elfogadás gomb eseménykezelője
        acceptButton.addEventListener("click", function () {
            localStorage.setItem("cookiesAccepted", "true"); // Mentés localStorage-be
            cookieBanner.style.display = "none"; // Elrejtjük a bannert
        });
    }

    // Global window function for inline onclick
    window.acceptCookies = function () {
        localStorage.setItem("cookiesAccepted", "true");
        if (cookieBanner) {
            cookieBanner.style.display = "none";
        }
    };
});
