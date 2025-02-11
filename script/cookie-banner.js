document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookieBanner");
    const modal = document.getElementById("cookieModal");
    const modifyCookiesBtn = document.getElementById("modifyCookies");
    const closeModalBtn = document.getElementById("closeCookieModal");

    const acceptAllBtn = document.getElementById("acceptAllCookies");
    const rejectAllBtn = document.getElementById("rejectCookies");
    const customizeBtn = document.getElementById("customizeCookies");
    const savePreferencesBtn = document.getElementById("saveCookiePreferences");

    const analyticsCheckbox = document.getElementById("analyticsCookies");
    const marketingCheckbox = document.getElementById("marketingCookies");

    async function getUserIP() {
        try {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error("Error retrieving IP address:", error);
            return null;
        }
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = `${name}=${value}; path=/; ${expires}`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? match[2] : null;
    }

    async function checkConsent() {
        const userIP = await getUserIP();
        if (userIP) {
            const storedConsent = localStorage.getItem(`cookieConsent_${userIP}`);
            if (storedConsent) {
                banner.style.display = "none";
                modifyCookiesBtn?.classList.remove("hidden");
                return;
            }
        }

        banner.style.display = "flex";
        modifyCookiesBtn?.classList.add("hidden");
    }

    async function acceptAllCookies() {
        const userIP = await getUserIP();
        setCookie("analyticsCookies", "yes", 365);
        setCookie("marketingCookies", "yes", 365);
        setCookie("cookiesAccepted", "all", 365);
        localStorage.setItem(`cookieConsent_${userIP}`, "all");

        banner.style.display = "none";
        modifyCookiesBtn?.classList.remove("hidden");
        loadAnalytics();
        loadFacebookPixel();
    }

    async function rejectAllCookies() {
        const userIP = await getUserIP();
        setCookie("analyticsCookies", "no", 365);
        setCookie("marketingCookies", "no", 365);
        setCookie("cookiesAccepted", "necessary_only", 365);
        localStorage.setItem(`cookieConsent_${userIP}`, "necessary_only");

        banner.style.display = "none";
        modifyCookiesBtn?.classList.remove("hidden");
    }

    async function saveCookiePreferences() {
        const userIP = await getUserIP();
        const analytics = analyticsCheckbox?.checked ? "yes" : "no";
        const marketing = marketingCheckbox?.checked ? "yes" : "no";

        setCookie("analyticsCookies", analytics, 365);
        setCookie("marketingCookies", marketing, 365);
        setCookie("cookiesAccepted", "custom", 365);
        localStorage.setItem(`cookieConsent_${userIP}`, "custom");

        modal.classList.add("hidden");
        modal.style.display = "none";
        banner.style.display = "none";
        modifyCookiesBtn?.classList.remove("hidden");

        if (analytics === "yes") loadAnalytics();
        if (marketing === "yes") loadFacebookPixel();
    }

   
    function openModal() {
        modal.classList.remove("hidden");
        modal.style.display = "block";
    }


    function closeModal() {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }


    function loadAnalytics() {
        if (getCookie("analyticsCookies") === "yes") {
            const gaScript = document.createElement("script");
            gaScript.src = "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
            document.head.appendChild(gaScript);

            gaScript.onload = function () {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag("js", new Date());
                gtag("config", "GA_MEASUREMENT_ID");
            };
        }
    }

  
    function loadFacebookPixel() {
        if (getCookie("marketingCookies") === "yes") {
            const fbScript = document.createElement("script");
            fbScript.innerHTML = `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', 'FACEBOOK_PIXEL_ID');
                fbq('track', 'PageView');
            `;
            document.head.appendChild(fbScript);
        }
    }

    if (acceptAllBtn) acceptAllBtn.addEventListener("click", acceptAllCookies);
    if (rejectAllBtn) rejectAllBtn.addEventListener("click", rejectAllCookies);
    if (customizeBtn) customizeBtn.addEventListener("click", openModal);
    if (savePreferencesBtn) savePreferencesBtn.addEventListener("click", saveCookiePreferences);
    if (modifyCookiesBtn) modifyCookiesBtn.addEventListener("click", openModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

    window.addEventListener("click", function (event) {
        if (event.target === modal) closeModal();
    });

    checkConsent();
    loadAnalytics();
    loadFacebookPixel();
});
