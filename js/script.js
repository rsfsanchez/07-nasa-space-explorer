
// Find our date picker inputs
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");

// Set up the date pickers using dateRange.js
setupDateInputs(startInput, endInput);

// Get the gallery and button from HTML
const gallery = document.getElementById("gallery");
const getButton = document.querySelector(".filters button");

// Get the modal elements from HTML
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalExplanation = document.getElementById("modalExplanation");
const closeButton = document.getElementById("closeModal");

// Remember which image was clicked
let lastClickedCard = null;


// ==========================================
// EXTRA CREDIT: RANDOM SPACE FACT (10 POINTS)
// ==========================================

// Store interesting space facts in an array
const spaceFacts = [
  "Sunlight takes about 8 minutes and 20 seconds to reach Earth.",
  "Jupiter is the largest planet in our solar system.",
  "A day on Venus is longer than a year on Venus.",
  "The Moon has about one-sixth of Earth's gravity.",
  "Mars has the tallest volcano in our solar system.",
  "Saturn's rings are made mostly of ice particles.",
  "The Milky Way contains billions of stars.",
  "Neptune has some of the fastest winds in our solar system.",
  "The Sun is a star at the center of our solar system.",
  "The International Space Station orbits Earth about every 90 minutes."
];

// Choose a random fact when the page loads
const randomIndex = Math.floor(Math.random() * spaceFacts.length);
const randomFact = spaceFacts[randomIndex];

// Create the space fact section
const factBox = document.createElement("div");
factBox.className = "space-fact";

// Create the heading
const factHeading = document.createElement("h2");
factHeading.textContent = "🌌 Did You Know?";

// Create the fact paragraph
const factText = document.createElement("p");
factText.textContent = randomFact;

// Add the heading and fact to the section
factBox.appendChild(factHeading);
factBox.appendChild(factText);

// Display the fact above the gallery
gallery.parentNode.insertBefore(factBox, gallery);


// ==========================================
// IMAGE MODAL FUNCTIONS
// ==========================================

// Function to open the image popup
function openModal(photo, card) {

  // Remember the clicked card
  lastClickedCard = card;

  // Display the larger NASA image
  modalImage.src = photo.hdurl;
  modalImage.alt = photo.title;

  // Display the title and date
  modalTitle.textContent = photo.title;
  modalDate.textContent = photo.date;

  // Display NASA's formatted explanation
  modalExplanation.innerHTML = photo.explanation || "No explanation available.";

  // Make the modal visible
  modal.hidden = false;

  // Stop the background from scrolling
  document.body.classList.add("modal-open");

  // Focus on the close button
  closeButton.focus();
}

// Function to close the image popup
function closeModal() {

  // Hide the modal
  modal.hidden = true;

  // Allow background scrolling
  document.body.classList.remove("modal-open");

  // Return focus to the image card
  if (lastClickedCard) {
    lastClickedCard.focus();
  }
}

// Close when clicking the X button
closeButton.addEventListener("click", closeModal);

// Close when clicking the dark background
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Close when pressing Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});


// ==========================================
// NASA API AND GALLERY
// ==========================================

// Run when Get Space Images is clicked
getButton.addEventListener("click", async () => {

  // Get selected dates
  const startDate = startInput.value.slice(2).replaceAll("-", "");
  const endDate = endInput.value.slice(2).replaceAll("-", "");

  // Display a loading message
  gallery.innerHTML = "<p>Loading space photos...</p>";

  // NASA API URL with selected dates
  const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic?date_from=${startDate}&date_to=${endDate}`;

  try {

    // Request NASA data
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Could not fetch NASA images");
    }

    // Convert the response into JavaScript objects
    const photos = await response.json();

    // Remove the loading message
    gallery.innerHTML = "";

    // Create a gallery item for each NASA entry
    photos.forEach((photo) => {

      // =====================================
      // DISPLAY NASA IMAGES
      // =====================================

      if (photo.media_type === "image" && photo.hdurl) {

        // Create a gallery card
        const card = document.createElement("div");
        card.className = "gallery-item";

        // Allow keyboard users to select the card
        card.tabIndex = 0;
        card.setAttribute("role", "button");

        // Create the image
        const image = document.createElement("img");
        image.src = photo.hdurl;
        image.alt = photo.title;

        // Create the title
        const title = document.createElement("p");
        title.textContent = photo.title;

        // Create the date
        const date = document.createElement("p");
        date.textContent = photo.date;

        // Add everything to the card
        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(date);

        // Open the modal when clicked
        card.addEventListener("click", () => {
          openModal(photo, card);
        });

        // Open the modal with Enter or Space
        card.addEventListener("keydown", (event) => {

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal(photo, card);
          }

        });

        // Add the card to the gallery
        gallery.appendChild(card);

      }

      // =====================================
      // EXTRA CREDIT: NASA VIDEOS (10 POINTS)
      // =====================================

      else if (photo.media_type === "video" || photo.media_type === "iframe") {

        // Create a video card
        const card = document.createElement("div");
        card.className = "gallery-item video-item";

        // Create the video placeholder
        const videoPreview = document.createElement("div");
        videoPreview.className = "video-preview";
        videoPreview.textContent = "▶ NASA Space Video";

        // Create the title
        const title = document.createElement("p");
        title.textContent = photo.title;

        // Create the date
        const date = document.createElement("p");
        date.textContent = photo.date;

        // Create a link to NASA's video page
        const videoLink = document.createElement("a");
        videoLink.href = photo.permalink || photo.url;
        videoLink.textContent = "▶ Watch Video on NASA";
        videoLink.target = "_blank";
        videoLink.rel = "noopener noreferrer";

        // Add everything to the video card
        card.appendChild(videoPreview);
        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(videoLink);

        // Add the video card to the gallery
        gallery.appendChild(card);

      }

    });

    // Show a message if no supported entries were found
    if (gallery.children.length === 0) {
      gallery.textContent = "No space images or videos found for these dates.";
    }

  } catch (error) {

    // Show an error message if something goes wrong
    gallery.textContent = "Could not load space images.";
    console.error(error);

  }

});
