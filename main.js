// DOM Elements
let breedSelect = document.getElementById("breedSelect");
let fetchButton = document.getElementById("fetchButton");
let loadingElement = document.getElementById("loading");
let errorElement = document.getElementById("error");
let dogImage = document.getElementById("dogImage");

// Load breeds immediately
loadBreeds();

// Add event listener for fetch button
fetchButton.addEventListener("click", function() {
    let breed = breedSelect.value;
    if (!breed) {
        showError("Please select a dog breed first");
        return;
    }
    
    fetchDogByBreed(breed);
});

// Function to load dog breeds using async/await
async function loadBreeds() {
    showLoading();
    hideError();
    
    try {
        // First try to fetch all breeds from the API
        let response = await fetch("https://dog.ceo/api/breeds/list/all");
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        let data = await response.json();
        
        if (data.status === "success") {
            // Clear existing options except the first one
            while (breedSelect.options.length > 1) {
                breedSelect.remove(1);
            }
            
            // Add each breed to the select dropdown
            for (let breed in data.message) {
                let option = document.createElement("option");
                option.value = breed;
                option.textContent = capitalizeFirstLetter(breed);
                breedSelect.appendChild(option);
            }
            
            hideLoading();
        } else {
            throw new Error("API returned error status");
        }
    } catch (error) {
        loadFallbackBreeds();
    }
}

// Fallback function to load hardcoded breeds if API fails
function loadFallbackBreeds() {
    // Clear existing options except the first one
    while (breedSelect.options.length > 1) {
        breedSelect.remove(1);
    }
    
    // List of common breeds
    let breeds = [
        "akita", "beagle", "boxer", "bulldog", "collie", 
        "dalmatian", "doberman", "husky", "labrador", "poodle", 
        "pug", "retriever", "rottweiler", "shepherd", "terrier"
    ];
    
    // Add each breed to the select dropdown
    for (let i = 0; i < breeds.length; i++) {
        let breed = breeds[i];
        let option = document.createElement("option");
        option.value = breed;
        option.textContent = capitalizeFirstLetter(breed);
        breedSelect.appendChild(option);
    }
    
    hideLoading();
    showError("Could not load breeds from API. Using fallback list.");
}

// Fetch a dog image by breed using async/await
async function fetchDogByBreed(breed) {
    showLoading();
    hideError();
    dogImage.classList.add("hidden");
    
    try {
        // Fetch dog image for specific breed from API
        let response = await fetch("https://dog.ceo/api/breed/" + breed + "/images/random");
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        // Parse JSON response
        let data = await response.json();
        
        // Check if API returned success
        if (data.status === "success") {
            displayDogImage(data.message);
        } else {
            throw new Error("API returned error");
        }
    } catch (error) {
        showError("Failed to fetch dog image: " + error.message);
    }
}

// Display a dog image
function displayDogImage(imageUrl) {
    dogImage.src = imageUrl;
    
    // When image loads, hide loading and show image
    dogImage.onload = function() {
        hideLoading();
        dogImage.classList.remove("hidden");
    };
    
    // Handle image load errors
    dogImage.onerror = function() {
        hideLoading();
        showError("Failed to load image");
    };
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Show loading state
function showLoading() {
    loadingElement.classList.remove("hidden");
}

// Hide loading state
function hideLoading() {
    loadingElement.classList.add("hidden");
}

// Show error message
function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    hideLoading();
}

// Hide error message
function hideError() {
    errorElement.classList.add("hidden");
}