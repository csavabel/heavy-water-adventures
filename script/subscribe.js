
document.getElementById("newsletterSubscription").addEventListener("submit", function(event) {
    event.preventDefault(); 

    var formData = new FormData(this);
    
    fetch("back_end/subscribe.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("subscriptionMessage").innerText = data.message;
        document.getElementById("subscriptionMessage").style.color = data.status === "success" ? "green" : "red";
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("subscriptionMessage").innerText = "An error occurred. Please try again.";
        document.getElementById("subscriptionMessage").style.color = "red";
    });
});
