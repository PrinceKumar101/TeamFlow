// DOM Elements
const memeImage = document.getElementById('memeImage');
const memeContainer = document.getElementById('memeContainer');
const placeholder = document.getElementById('placeholder');
const memeInfo = document.getElementById('memeInfo');
const memeTitle = document.getElementById('memeTitle');
const memeUpvotes = document.getElementById('memeUpvotes');
const memeAuthor = document.getElementById('memeAuthor');
const generateBtn = document.getElementById('generateBtn');
const loader = document.getElementById('loader');
const memeStatus = document.getElementById('memeStatus');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const API_URL = 'https://meme-api.com/gimme';

// Meme History Management
let memeHistory = [];
let currentMemeIndex = -1;
const MAX_HISTORY = 10;

async function generateMeme() {
    showLoading(true);
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch meme');
        }
        
        const data = await response.json();
        
        // Add to history
        memeHistory.push(data);
        
        // Keep only the last 10 memes
        if (memeHistory.length > MAX_HISTORY) {
            memeHistory.shift();
        }
        
        // Set current index to the latest meme
        currentMemeIndex = memeHistory.length - 1;
        
        displayMeme(data, true);
        updateNavigationButtons();
        
    } catch (error) {
        console.error('Error fetching meme:', error);
        showError('Failed to load meme. Please try again.');
    } finally {
        showLoading(false);
    }
}

function displayMeme(memeData, isNew = false) {
    placeholder.style.display = 'none';
    
    memeImage.src = memeData.url;
    memeImage.style.display = 'block';
    memeContainer.classList.add('has-meme');
    
    memeTitle.textContent = memeData.title || 'Untitled';
    memeUpvotes.textContent = `${memeData.ups || 0} upvotes`;
    memeAuthor.textContent = `by ${memeData.author || 'Unknown'}`;
    memeInfo.style.display = 'block';
    
    // Update status indicator
    if (isNew) {
        memeStatus.innerHTML = '<span class="latest-badge"> LATEST</span>';
    } else {
        memeStatus.innerHTML = `<span class="history-info">(${currentMemeIndex + 1}/${memeHistory.length})</span>`;
    }
    
    memeImage.style.opacity = '0';
    memeImage.onload = () => {
        memeImage.style.transition = 'opacity 0.5s ease';
        memeImage.style.opacity = '1';
    };
}

function showLoading(isLoading) {
    if (isLoading) {
        loader.style.display = 'block';
        generateBtn.disabled = true;
        generateBtn.textContent = 'Loading...';
    } else {
        loader.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Meme';
    }
}

function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    generateBtn.parentNode.insertBefore(errorDiv, generateBtn);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function previousMeme() {
    if (currentMemeIndex > 0) {
        currentMemeIndex--;
        displayMeme(memeHistory[currentMemeIndex], false);
        updateNavigationButtons();
    } else {
        showError('You have reached the beginning of meme history!');
    }
}

function nextMeme() {
    if (currentMemeIndex < memeHistory.length - 1) {
        currentMemeIndex++;
        displayMeme(memeHistory[currentMemeIndex], currentMemeIndex === memeHistory.length - 1);
        updateNavigationButtons();
    } else {
        showError('You have reached the latest meme! Click Generate Meme to create a new one.');
    }
}

function updateNavigationButtons() {
    
    if (memeHistory.length > 1) {
        prevBtn.style.display = currentMemeIndex > 0 ? 'inline-block' : 'none';
        nextBtn.style.display = currentMemeIndex < memeHistory.length - 1 ? 'inline-block' : 'none';
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
}

window.addEventListener('load', () => {
    generateMeme();
});
