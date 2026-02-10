const API = "https://randomuser.me/api/";
const MAX_USERS = 10;

let users = [];
let currentIndex = 0;

// DOM Elements
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const contentEl = document.getElementById("content");
const errorMessage = document.getElementById("errorMessage");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const userContent = document.getElementById("userContent");
const cardBody = document.querySelector(".card-body");

const userImage = document.getElementById("userImage");
const userName = document.getElementById("userName");
const userTitle = document.getElementById("userTitle");
const userEmail = document.getElementById("userEmail");
const userPhone = document.getElementById("userPhone");
const userLocation = document.getElementById("userLocation");
const userAge = document.getElementById("userAge");
const userUsername = document.getElementById("userUsername");
const userGender = document.getElementById("userGender");
const userBadge = document.getElementById("userBadge");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentIndexEl = document.getElementById("currentIndex");
const totalUsersEl = document.getElementById("totalUsers");

document.addEventListener("DOMContentLoaded", fetchNewUser);


async function fetchNewUser() {
    try {
        showLoading(true);
        hideError();

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("No user returned from API");
        }

        const newUser = data.results[0];
        
        if (users.length >= MAX_USERS) {
            users.shift();
        }
        
        users.push(newUser);
        
        currentIndex = users.length - 1;

        showLoading(false);
        displayUser();
        updateUI();
    } catch (error) {
        showLoading(false);
        showError(error.message);
    }
}


function displayUser() {
    if (users.length === 0) return;

    const user = users[currentIndex];
    const name = user.name;
    const location = user.location;

    userImage.src = user.picture.large;
    userName.textContent = `${name.first} ${name.last}`;
    userTitle.textContent = `${name.title}`;
    userEmail.textContent = user.email;
    userPhone.textContent = user.phone;
    userLocation.textContent = `${location.city}, ${location.country}`;
    userAge.textContent = user.dob.age;
    userUsername.textContent = user.login.username;
    userGender.textContent = capitalizeFirst(user.gender);

    updateBadge();
}

function updateBadge() {
    if (users.length === 1) {
        userBadge.textContent = "First";
    } else if (currentIndex === 0) {
        userBadge.textContent = "First";
    } else if (currentIndex === users.length - 1) {
        userBadge.textContent = "Latest";
    } else {
        userBadge.textContent = `${currentIndex + 1}/${users.length}`;
    }
}


function prevUser() {
    if (currentIndex > 0) {
        currentIndex--;
        displayUser();
        updateUI();
    }
}

function nextUser() {
    if (currentIndex < users.length - 1) {
        currentIndex++;
        displayUser();
        updateUI();
    }
}

function updateUI() {
    currentIndexEl.textContent = currentIndex + 1;
    totalUsersEl.textContent = users.length;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === users.length - 1;

    contentEl.classList.remove("hidden");
    loadingEl.classList.add("hidden");
    errorEl.classList.add("hidden");
}

function showLoading(show) {
    if (show) {
        loadingEl.classList.remove("hidden");
        userContent.classList.add("hidden");
        cardBody.classList.add("hidden");
        if (users.length === 0) {
            contentEl.classList.add("hidden");
        } else {
            contentEl.classList.remove("hidden");
        }
        errorEl.classList.add("hidden");
    } else {
        loadingEl.classList.add("hidden");
        userContent.classList.remove("hidden");
        cardBody.classList.remove("hidden");
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorEl.classList.remove("hidden");
    if (users.length === 0) {
        contentEl.classList.add("hidden");
    }
    loadingEl.classList.add("hidden");
}


function hideError() {
    errorEl.classList.add("hidden");
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
