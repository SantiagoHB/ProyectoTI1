document.addEventListener("DOMContentLoaded", function () {
  const alertPopup = document.getElementById("alert-popup");
  const alertSound = document.getElementById("alert-sound");
  const closeAlertBtn = document.getElementById("close-alert-btn");

  const checkAirQuality = () => {
    const iframes = document.querySelectorAll("iframe");
    let alertTriggered = false;

    iframes.forEach((iframe) => {
      const src = iframe.src;
      fetch(src)
        .then((response) => response.text())
        .then((data) => {
          const match = data.match(/(\d+)/); // Simple regex to find numbers in the iframe content
          if (match && match[0]) {
            const value = parseInt(match[0], 10);
            if (value > 150) {
              alertTriggered = true;
              showAlert();
            }
          }
        })
        .catch((error) =>
          console.error("Error fetching iframe content:", error)
        );
    });

    if (alertTriggered) {
      showAlert();
    }
  };

  const showAlert = () => {
    alertPopup.style.display = "flex";
    alertSound.play();
  };

  const hideAlert = () => {
    alertPopup.style.display = "none";
    alertSound.pause();
    alertSound.currentTime = 0;
  };

  closeAlertBtn.addEventListener("click", hideAlert);

  setInterval(checkAirQuality, 5000); // Check every 5 seconds
});
