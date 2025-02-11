document.addEventListener("DOMContentLoaded", function () {
    console.log("Modal script loaded!");

    const modalTriggers = document.querySelectorAll("[data-bs-toggle='modal']");
    modalTriggers.forEach(trigger => {
        trigger.addEventListener("click", function () {
            const targetModalID = this.getAttribute("data-bs-target");
            const modalElement = document.querySelector(targetModalID);
            if (modalElement) {
                const modalInstance = new bootstrap.Modal(modalElement);
                modalInstance.show();
            }
        });
    });

    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        modal.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) modalInstance.hide();
            }
        });

        modal.addEventListener("click", function (event) {
            if (event.target.classList.contains("modal")) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) modalInstance.hide();
            }
        });

        modal.addEventListener("hidden.bs.modal", function () {
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) backdrop.remove();
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
        });
    });

    document.querySelectorAll(".btn-close, .close-modal").forEach(closeButton => {
        closeButton.addEventListener("click", function () {
            const modalElement = this.closest(".modal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
        });
    });
});
