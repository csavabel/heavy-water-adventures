
document.getElementById("reservationForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    var formData = new FormData(this);
    
    fetch("back_end/process_booking.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("bookingMessage").innerText = data.message;
        document.getElementById("bookingMessage").style.color = data.status === "success" ? "green" : "red";
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("bookingMessage").innerText = "An error occurred. Please try again.";
        document.getElementById("bookingMessage").style.color = "red";
    });
});
