document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("reservationForm");
    const contactForm = document.getElementById("contactForm");

    function showError(input, message) {
        const errorElement = document.createElement("div");
        errorElement.className = "invalid-feedback";
        errorElement.innerText = message;
        input.classList.add("is-invalid");
        input.parentNode.appendChild(errorElement);
    }

    function clearErrors(form) {
        form.querySelectorAll(".invalid-feedback").forEach(el => el.remove());
        form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
    }

    function validateBookingForm() {
        clearErrors(bookingForm);
        let isValid = true;

        const lodge = document.getElementById("lodge");
        const checkin = document.getElementById("checkin");
        const checkout = document.getElementById("checkout");
        const guests = document.getElementById("guests");
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");

        const today = new Date().toISOString().split("T")[0];

        if (lodge.value === "") {
            showError(lodge, "Please select a lodge.");
            isValid = false;
        }

        if (checkin.value === "" || checkin.value < today) {
            showError(checkin, "Check-in date must be in the future.");
            isValid = false;
        }

        if (checkout.value === "" || checkout.value <= checkin.value) {
            showError(checkout, "Check-out date must be after check-in.");
            isValid = false;
        }

        if (guests.value < 1 || guests.value > 10) {
            showError(guests, "Number of guests must be between 1 and 10.");
            isValid = false;
        }

        if (name.value.trim().length < 3) {
            showError(name, "Please enter a valid name.");
            isValid = false;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email.value)) {
            showError(email, "Please enter a valid email address.");
            isValid = false;
        }

        const phonePattern = /^[0-9+\-\s]+$/;
        if (!phonePattern.test(phone.value) || phone.value.length < 6) {
            showError(phone, "Please enter a valid phone number.");
            isValid = false;
        }

        return isValid;
    }

    function validateContactForm() {
        clearErrors(contactForm);
        let isValid = true;

        const contactName = document.getElementById("contact-name");
        const contactEmail = document.getElementById("contact-email");
        const message = document.getElementById("message");

        if (contactName.value.trim().length < 3) {
            showError(contactName, "Please enter a valid name.");
            isValid = false;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(contactEmail.value)) {
            showError(contactEmail, "Please enter a valid email address.");
            isValid = false;
        }

        if (message.value.trim().length < 10) {
            showError(message, "Message must be at least 10 characters long.");
            isValid = false;
        }

        return isValid;
    }

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (validateBookingForm()) {
            alert("Your reservation has been submitted! You will receive a confirmation email shortly.");
            bookingForm.reset();
        }
    });

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (validateContactForm()) {
            alert("Your message has been sent! We will get back to you as soon as possible.");
            contactForm.reset();
        }
    });
});
