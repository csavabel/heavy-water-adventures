document.addEventListener("DOMContentLoaded", function () {
    const openModalButtons = document.querySelectorAll(".open-modal");
    const closeModalButtons = document.querySelectorAll(".close-modal");
    const modals = document.querySelectorAll(".modal");

    openModalButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const modalId = this.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add("show");
                document.body.style.overflow = "hidden"; 
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener("click", function () {
            const modal = this.closest(".modal");
            closeModal(modal.id);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            modals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove("show");
            document.body.style.overflow = ""; 
        }
    }
});
