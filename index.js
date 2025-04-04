// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const gameGrid = document.querySelector('.game-grid');
const searchInput = document.querySelector('.search-bar input');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    setupLoginLogout();
    loadGames();
    setupCategoryFilters();
    initializeRewards();
    setupMobileMenu();
    
    // Check if device is touch-enabled
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Setup horizontal swipe for categories on mobile
        const categoriesContainer = document.querySelector('.categories-container');
        if (categoriesContainer) {
            categoriesContainer.addEventListener('touchstart', function(e) {
                this.dataset.touchStartX = e.touches[0].clientX;
                this.dataset.touchStartY = e.touches[0].clientY;
                this.dataset.touchScrollLeft = this.scrollLeft;
            }, { passive: true });
            
            categoriesContainer.addEventListener('touchmove', function(e) {
                if (!this.dataset.touchStartX) return;
                
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const startX = parseInt(this.dataset.touchStartX);
                const startY = parseInt(this.dataset.touchStartY);
                
                // Calculate horizontal and vertical movement
                const distX = startX - touchX;
                const distY = startY - touchY;
                
                // If horizontal movement is greater than vertical, prevent default to avoid page scrolling
                if (Math.abs(distX) > Math.abs(distY)) {
                    e.preventDefault();
                    this.scrollLeft = parseInt(this.dataset.touchScrollLeft) + distX;
                }
            });
            
            categoriesContainer.addEventListener('touchend', function() {
                delete this.dataset.touchStartX;
                delete this.dataset.touchStartY;
                delete this.dataset.touchScrollLeft;
            });
        }
    }

    // Event listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.mobile-nav').classList.toggle('active');
        });
    }
});

// Setup login/logout functionality
function setupLoginLogout() {
    const token = getAuthToken();
    const authLinks = document.querySelector('.auth-links');
    const userLinks = document.querySelector('.user-links');
    const mobileAuthLinks = document.querySelector('.mobile-auth-links');
    const mobileUserLinks = document.querySelector('.mobile-user-links');
    const logoutLink = document.getElementById('logout-link');
    const mobileLogoutLink = document.getElementById('mobile-logout-link');
    
    // Handle logged in state
    if (token) {
        // Show user links (profile/logout), hide auth links (login/register)
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        if (mobileAuthLinks) mobileAuthLinks.style.display = 'none';
        if (mobileUserLinks) mobileUserLinks.style.display = 'flex';
    } else {
        // Show auth links (login/register), hide user links (profile/logout)
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
        if (mobileAuthLinks) mobileAuthLinks.style.display = 'flex';
        if (mobileUserLinks) mobileUserLinks.style.display = 'none';
    }
    
    // Logout handler function
    const handleLogout = function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        showNotification('Successfully logged out');
        
        // Update UI immediately
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
        if (mobileAuthLinks) mobileAuthLinks.style.display = 'flex';
        if (mobileUserLinks) mobileUserLinks.style.display = 'none';
        
        // Redirect to home page if not already there
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    };
    
    // Setup logout button handlers
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutLink) {
        mobileLogoutLink.addEventListener('click', handleLogout);
    }
}

// Load games
function loadGames() {
    console.log('Loading games directly without any API calls');
    
    // Find game grid
    const gameGrid = document.querySelector('.game-grid');
    if (!gameGrid) {
        console.error('Game grid not found!');
        return;
    }
    
    // Create direct HTML for games
    gameGrid.innerHTML = `
        <div class="game-card" data-id="1">
            <div class="game-image">
                <img src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&auto=format&fit=crop" alt="Space Adventure" loading="lazy">
                <div class="game-category">Adventure</div>
                <button class="favorite-btn" onclick="toggleFavorite(1, 'Space Adventure')">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="game-info">
                <h3>Space Adventure</h3>
                <p>Embark on an epic journey through the cosmos in this thrilling space exploration game.</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>4.8</span>
                </div>
                <div class="game-actions">
                    <button class="play-now-btn" onclick="playGame(1)">
                        <i class="fas fa-play"></i>
                        <span>Play Now</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="game-card" data-id="2">
            <div class="game-image">
                <img src="https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&auto=format&fit=crop" alt="Racing Masters" loading="lazy">
                <div class="game-category">Racing</div>
                <button class="favorite-btn" onclick="toggleFavorite(2, 'Racing Masters')">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="game-info">
                <h3>Racing Masters</h3>
                <p>Experience the ultimate racing thrill with realistic physics and stunning graphics.</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>4.6</span>
                </div>
                <div class="game-actions">
                    <button class="play-now-btn" onclick="playGame(2)">
                        <i class="fas fa-play"></i>
                        <span>Play Now</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="game-card" data-id="3">
            <div class="game-image">
                <img src="https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&auto=format&fit=crop" alt="Puzzle Quest" loading="lazy">
                <div class="game-category">Puzzle</div>
                <button class="favorite-btn" onclick="toggleFavorite(3, 'Puzzle Quest')">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="game-info">
                <h3>Puzzle Quest</h3>
                <p>Challenge your mind with engaging puzzles and unlock new levels.</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>4.7</span>
                </div>
                <div class="game-actions">
                    <button class="play-now-btn" onclick="playGame(3)">
                        <i class="fas fa-play"></i>
                        <span>Play Now</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="game-card" data-id="4">
            <div class="game-image">
                <img src="https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&auto=format&fit=crop" alt="Dragon's Lair" loading="lazy">
                <div class="game-category">RPG</div>
                <button class="favorite-btn" onclick="toggleFavorite(4, 'Dragon\'s Lair')">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="game-info">
                <h3>Dragon's Lair</h3>
                <p>Enter a magical world of dragons and epic battles in this fantasy RPG.</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>4.9</span>
                </div>
                <div class="game-actions">
                    <button class="play-now-btn" onclick="playGame(4)">
                        <i class="fas fa-play"></i>
                        <span>Play Now</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="game-card" data-id="5">
            <div class="game-image">
                <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop" alt="Sports Arena" loading="lazy">
                <div class="game-category">Sports</div>
                <button class="favorite-btn" onclick="toggleFavorite(5, 'Sports Arena')">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="game-info">
                <h3>Sports Arena</h3>
                <p>Compete in various sports with realistic physics and multiplayer support.</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>4.5</span>
                </div>
                <div class="game-actions">
                    <button class="play-now-btn" onclick="playGame(5)">
                        <i class="fas fa-play"></i>
                        <span>Play Now</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="game-card" data-id="6">
            <div class="game-image">
                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop" alt="Zombie Defense" loading="lazy">
                <div class="game-category">Horror</div>
                <button class="favorite-btn" onclick="toggleFavorite(6, 'Zombie Defense')">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="game-info">
                <h3>Zombie Defense</h3>
                <p>Survive the zombie apocalypse in this intense survival horror game.</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>4.7</span>
                </div>
                <div class="game-actions">
                    <button class="play-now-btn" onclick="playGame(6)">
                        <i class="fas fa-play"></i>
                        <span>Play Now</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove loading indicator if it exists
    const loadingElement = gameGrid.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Fetch featured games
async function fetchFeaturedGames() {
    try {
        console.log('Making API request to:', 'http://localhost:5000/api/games/featured');
        const response = await fetch('http://localhost:5000/api/games/featured');
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }
        const games = await response.json();
        console.log('API response:', games);
        return games;
    } catch (error) {
        console.error('Error fetching featured games:', error);
        console.log('Returning default games');
        return getDefaultGames();
    }
}

// Fetch user favorites
async function fetchUserFavorites() {
    try {
        const token = getAuthToken();
        if (!token) {
            // Return favorites from local storage if not logged in
            return getFavoritesFromLocalStorage();
        }
        
        // Try to get favorites from API
        try {
            const response = await fetch(`${API_URL}/users/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch favorites from API');
            }
            
            const favorites = await response.json();
            return favorites.map(game => game.id);
        } catch (apiError) {
            console.warn('Could not fetch favorites from API, using local storage', apiError);
            return getFavoritesFromLocalStorage();
        }
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return getFavoritesFromLocalStorage();
    }
}

// Get favorites from local storage
function getFavoritesFromLocalStorage() {
    try {
        const favoritesJson = localStorage.getItem('gameFavorites');
        return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
        console.error('Error parsing favorites from local storage:', error);
        return [];
    }
}

// Display games in the grid
function displayGames(games, favorites = []) {
    const gameGrid = document.querySelector('.game-grid');
    if (!gameGrid) {
        console.error('Game grid element not found!');
        return;
    }

    console.log('Displaying games:', games);

    if (!games || games.length === 0) {
        gameGrid.innerHTML = '<div class="no-results">No games found</div>';
        return;
    }

    // If this is the featured-preview on the home page, only show a limited number of games
    const isFeaturedPreview = gameGrid.classList.contains('featured-preview');
    const gamesToDisplay = isFeaturedPreview ? games.slice(0, 6) : games;

    gameGrid.innerHTML = gamesToDisplay.map(game => {
        const isFavorite = favorites.includes(game.id);
        
        return `
        <div class="game-card" data-id="${game.id}">
            <div class="game-image">
                <img src="${game.image}" alt="${game.title}" loading="lazy">
                <div class="game-category">${game.category}</div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${game.id}, '${game.title}')">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <div class="rating">
                    ${getRatingStars(game.rating)}
                    <span>${game.rating}</span>
                </div>
                <div class="game-actions">
                    ${isAuthenticated() 
                        ? `<button class="play-now-btn" onclick="playGame(${game.id})">
                            <i class="fas fa-play"></i>
                            <span>Play Now</span>
                           </button>`
                        : `<button class="login-to-play-btn" onclick="redirectToLogin()">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>Login to Play</span>
                           </button>`
                    }
                </div>
            </div>
        </div>
    `}).join('');
}

// Toggle favorite status for a game
async function toggleFavorite(gameId, gameTitle) {
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }
    
    const favoriteBtn = document.querySelector(`.game-card[data-id="${gameId}"] .favorite-btn`);
    const isFavorite = favoriteBtn.classList.contains('active');
    
    try {
        // Update UI immediately for responsive feeling
        if (isFavorite) {
            favoriteBtn.classList.remove('active');
            favoriteBtn.querySelector('i').className = 'far fa-heart';
        } else {
            favoriteBtn.classList.add('active');
            favoriteBtn.querySelector('i').className = 'fas fa-heart';
        }
        
        // Send request to server
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/games/${gameId}/favorite`, {
            method: isFavorite ? 'DELETE' : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
        }
        
        // Store in local storage temporarily to maintain state
        storeFavoriteInLocalStorage(gameId, !isFavorite);
        
        // Show success message
        showNotification(`${isFavorite ? 'Removed from' : 'Added to'} favorites: ${gameTitle}`);
        
    } catch (error) {
        console.error('Error toggling favorite:', error);
        
        // Revert UI change if error occurred
        if (isFavorite) {
            favoriteBtn.classList.add('active');
            favoriteBtn.querySelector('i').className = 'fas fa-heart';
        } else {
            favoriteBtn.classList.remove('active');
            favoriteBtn.querySelector('i').className = 'far fa-heart';
        }
        
        showNotification(`Failed to update favorites: ${error.message}`, 'error');
    }
}

// Store favorite state in local storage
function storeFavoriteInLocalStorage(gameId, isFavorite) {
    try {
        let favorites = JSON.parse(localStorage.getItem('gameFavorites') || '[]');
        
        if (isFavorite) {
            // Add to favorites if not already present
            if (!favorites.includes(gameId)) {
                favorites.push(gameId);
            }
        } else {
            // Remove from favorites
            favorites = favorites.filter(id => id !== gameId);
        }
        
        localStorage.setItem('gameFavorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error updating favorites in local storage:', error);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Get rating stars HTML
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Default games data
function getDefaultGames() {
    return [
        {
            id: 1,
            title: "Space Adventure",
            description: "Embark on an epic journey through the cosmos in this thrilling space exploration game.",
            image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&auto=format&fit=crop&q=60",
            rating: 4.8,
            category: "Adventure"
        },
        {
            id: 2,
            title: "Racing Masters",
            description: "Experience the ultimate racing thrill with realistic physics and stunning graphics.",
            image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&auto=format&fit=crop&q=60",
            rating: 4.6,
            category: "Racing"
        },
        {
            id: 3,
            title: "Puzzle Quest",
            description: "Challenge your mind with engaging puzzles and unlock new levels.",
            image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&auto=format&fit=crop&q=60",
            rating: 4.7,
            category: "Puzzle"
        },
        {
            id: 4,
            title: "Dragon's Lair",
            description: "Enter a magical world of dragons and epic battles in this fantasy RPG.",
            image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&auto=format&fit=crop&q=60",
            rating: 4.9,
            category: "RPG"
        },
        {
            id: 5,
            title: "Sports Arena",
            description: "Compete in various sports with realistic physics and multiplayer support.",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60",
            rating: 4.5,
            category: "Sports"
        },
        {
            id: 6,
            title: "Zombie Defense",
            description: "Survive the zombie apocalypse in this intense survival horror game.",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60",
            rating: 4.7,
            category: "Horror"
        },
        {
            id: 7,
            title: "Ocean Explorer",
            description: "Dive into the depths of the ocean in this underwater adventure game.",
            image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&auto=format&fit=crop&q=60",
            rating: 4.6,
            category: "Adventure"
        },
        {
            id: 8,
            title: "Cyber Racing",
            description: "Race through neon-lit streets in this futuristic racing experience.",
            image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&auto=format&fit=crop&q=60",
            rating: 4.8,
            category: "Racing"
        },
        {
            id: 9,
            title: "Medieval Conquest",
            description: "Build your empire and conquer kingdoms in this strategic warfare game.",
            image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800&auto=format&fit=crop&q=60",
            rating: 4.7,
            category: "Strategy"
        },
        {
            id: 10,
            title: "Ninja Warrior",
            description: "Master the art of stealth and combat in this action-packed ninja adventure.",
            image: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&auto=format&fit=crop&q=60",
            rating: 4.9,
            category: "Action"
        },
        {
            id: 11,
            title: "Mystery Manor",
            description: "Solve intricate puzzles and uncover dark secrets in this mysterious mansion.",
            image: "https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?w=800&auto=format&fit=crop&q=60",
            rating: 4.6,
            category: "Mystery"
        },
        {
            id: 12,
            title: "Galactic Warfare",
            description: "Command your fleet in epic space battles across the galaxy.",
            image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=60",
            rating: 4.8,
            category: "Strategy"
        }
    ];
}

// Update navigation based on authentication
function updateNavigation(token) {
    const authLinks = document.querySelector('.auth-links');
    const userLinks = document.querySelector('.user-links');
    const mobileAuthLinks = document.querySelector('.mobile-auth-links');
    const mobileUserLinks = document.querySelector('.mobile-user-links');
    const logoutLink = document.querySelector('.logout-btn');
    const mobileLogoutLink = document.getElementById('mobile-logout-link');
    
    // Logout function
    const handleLogout = function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        showNotification('Successfully logged out');
        setTimeout(() => {
            location.reload();
        }, 1000);
    };
    
    if (token) {
        // User is logged in
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        if (mobileAuthLinks) mobileAuthLinks.style.display = 'none';
        if (mobileUserLinks) mobileUserLinks.style.display = 'flex';
        
        // Setup logout handlers
        if (logoutLink) {
            logoutLink.addEventListener('click', handleLogout);
        }
        
        if (mobileLogoutLink) {
            mobileLogoutLink.addEventListener('click', handleLogout);
        }
    } else {
        // User is not logged in
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
        if (mobileAuthLinks) mobileAuthLinks.style.display = 'flex';
        if (mobileUserLinks) mobileUserLinks.style.display = 'none';
    }
}

// Play game
function playGame(gameId) {
    console.log(`Playing game ${gameId}`);
    // In a real app, this would navigate to the game page or start the game
    alert(`Starting game ${gameId}`);
}

// Redirect to login
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Mobile menu toggle
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            loadGames(); // Load default games if search query is too short
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/games/search?q=${query}`);
            if (!response.ok) throw new Error('Search failed');
            const games = await response.json();
            displayGames(games);
        } catch (error) {
            console.error('Search error:', error);
            // Show default games if search fails
            displayGames(getDefaultGames());
        }
    }, 300));
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    document.body.insertBefore(errorDiv, document.body.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Load user data
async function loadUserData() {
    try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load user data');
        }

        const userData = await response.json();
        
        // Update UI with user data
        const usernameElement = document.querySelector('.username');
        if (usernameElement) {
            usernameElement.textContent = userData.username;
        }

        // Update other user-specific elements as needed
    } catch (error) {
        console.error('Error loading user data:', error);
        showError('Failed to load user data');
    }
}

// Load featured games
async function loadFeaturedGames() {
    try {
        const response = await fetch('http://localhost:5000/api/games/featured', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load featured games');
        }

        const games = await response.json();
        
        // Update featured games section
        const featuredGamesGrid = document.querySelector('.featured-games-grid');
        if (featuredGamesGrid) {
            featuredGamesGrid.innerHTML = games.map(game => `
                <div class="game-card">
                    <img src="${game.thumbnail}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <div class="game-stats">
                        <span><i class="fas fa-star"></i> ${game.rating}</span>
                        <span><i class="fas fa-users"></i> ${game.players}</span>
                    </div>
                    <button class="play-btn" onclick="playGame('${game._id}')">Play Now</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading featured games:', error);
        showError('Failed to load featured games');
    }
}

// Load recent activity
async function loadRecentActivity() {
    try {
        const response = await fetch('http://localhost:5000/api/users/activity', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load recent activity');
        }

        const activities = await response.json();
        
        // Update recent activity section
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas ${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.description}</p>
                        <span class="activity-time">${formatTime(activity.timestamp)}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
        showError('Failed to load recent activity');
    }
}

// Utility functions
function getActivityIcon(type) {
    const icons = {
        'game_start': 'fa-gamepad',
        'achievement': 'fa-trophy',
        'favorite': 'fa-heart',
        'profile_update': 'fa-user-edit'
    };
    return icons[type] || 'fa-info-circle';
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}

// Set up category filters
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoriesContainer = document.querySelector('.categories-container');
    
    if (!categoryButtons.length) return;
    
    // Store the full list of games for filtering
    let allGames = [];
    
    // Enable horizontal scrolling with mouse drag for desktop
    let isDown = false;
    let startX;
    let scrollLeft;

    if (categoriesContainer) {
        // Add visual feedback when scrollable
        const updateScrollIndicator = () => {
            const scrollIndicator = document.querySelector('.categories-scroll-indicator');
            if (!scrollIndicator) return;
            
            const isScrollable = categoriesContainer.scrollWidth > categoriesContainer.clientWidth;
            scrollIndicator.style.display = isScrollable ? 'block' : 'none';
            
            // Update scroll indicator position
            if (isScrollable) {
                const scrollPercentage = categoriesContainer.scrollLeft / 
                    (categoriesContainer.scrollWidth - categoriesContainer.clientWidth);
                scrollIndicator.style.setProperty('--scroll-position', `${scrollPercentage * 100}%`);
            }
        };
        
        // Initialize scroll indicator
        window.addEventListener('resize', updateScrollIndicator);
        categoriesContainer.addEventListener('scroll', updateScrollIndicator);
        
        // Setup mouse drag scrolling for desktop
        categoriesContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - categoriesContainer.offsetLeft;
            scrollLeft = categoriesContainer.scrollLeft;
            categoriesContainer.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        categoriesContainer.addEventListener('mouseleave', () => {
            isDown = false;
            categoriesContainer.style.cursor = '';
        });
        
        categoriesContainer.addEventListener('mouseup', () => {
            isDown = false;
            categoriesContainer.style.cursor = '';
        });
        
        categoriesContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - categoriesContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            categoriesContainer.scrollLeft = scrollLeft - walk;
            updateScrollIndicator();
        });
        
        // Initial scroll indicator check
        setTimeout(updateScrollIndicator, 100);
    }
    
    // Get all games first
    fetchFeaturedGames().then(games => {
        allGames = games;
        
        // Setup click handlers for category buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Smooth scroll to selected button if it's not fully visible
                const buttonRect = button.getBoundingClientRect();
                const containerRect = categoriesContainer.getBoundingClientRect();
                
                if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
                    const scrollCenter = button.offsetLeft - (categoriesContainer.clientWidth / 2) + (button.clientWidth / 2);
                    categoriesContainer.scrollTo({
                        left: scrollCenter,
                        behavior: 'smooth'
                    });
                }
                
                // Get selected category
                const category = button.getAttribute('data-category');
                
                // Filter and display games
                if (category === 'all') {
                    displayGames(allGames);
                } else {
                    const filteredGames = allGames.filter(game => game.category === category);
                    displayGames(filteredGames);
                    
                    // Show message if no games in category
                    if (filteredGames.length === 0) {
                        const gameGrid = document.querySelector('.game-grid');
                        gameGrid.innerHTML = `
                            <div class="no-results">
                                <i class="fas fa-search"></i>
                                <p>No games found in the "${category}" category</p>
                            </div>
                        `;
                    }
                }
            });
        });
    }).catch(error => {
        console.error('Error setting up category filters:', error);
    });
}

// Initialize rewards system
function initializeRewards() {
    updateDailyRewardsUI();
    updateSpinWheelUI();
    updateUserBalance();
    
    // Set click event for daily claim button
    document.getElementById('claim-daily').addEventListener('click', handleDailyRewardClaim);
    
    // Set click event for spin button
    document.getElementById('spin-wheel-btn').addEventListener('click', handleSpinWheel);
    
    // Add touch events for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('.day-reward').forEach(day => {
            day.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            day.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
    
    // Initialize navbar rewards
    initializeNavbarRewards();
    
    // Start the countdown timer for next spin
    startSpinCountdown();
}

// Initialize navbar rewards functionality
function initializeNavbarRewards() {
    // Update rewards badge initially
    updateRewardsBadge();
    
    // Set up click handler for navbar rewards
    const navbarRewards = document.querySelector('.navbar-rewards');
    if (navbarRewards) {
        navbarRewards.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Smooth scroll to rewards section
            const rewardsSection = document.getElementById('rewards');
            if (rewardsSection) {
                rewardsSection.scrollIntoView({ behavior: 'smooth' });
                
                // Add highlight effect to rewards section
                rewardsSection.classList.add('highlight-section');
                setTimeout(() => {
                    rewardsSection.classList.remove('highlight-section');
                }, 2000);
            }
        });
    }
    
    // Schedule regular updates of the rewards badge
    setInterval(updateRewardsBadge, 60000); // Update every minute
}

// Initialize daily rewards
function initializeDailyRewards() {
    const claimButton = document.getElementById('claim-daily');
    if (!claimButton) return;
    
    // Get daily rewards data
    const dailyRewardsData = getDailyRewardsData();
    
    // Update streak display
    updateDailyRewardsUI(dailyRewardsData);
    
    // Add event listener for claim button
    claimButton.addEventListener('click', handleDailyRewardClaim);
}

// Get daily rewards data from local storage or initialize
function getDailyRewardsData() {
    // Try to get data from local storage
    let data = localStorage.getItem('dailyRewards');
    
    if (data) {
        return JSON.parse(data);
    } else {
        // Initialize with default values
        const defaultData = {
            lastClaimDate: null,
            currentStreak: 0,
            currentDay: 1,
            claimedDays: []
        };
        
        // Save to local storage
        localStorage.setItem('dailyRewards', JSON.stringify(defaultData));
        return defaultData;
    }
}

// Update daily rewards UI
function updateDailyRewardsUI(data) {
    // Update streak count
    const streakCount = document.getElementById('streak-count');
    if (streakCount) {
        streakCount.textContent = data.currentStreak;
    }
    
    // Update day rewards
    const dayRewards = document.querySelectorAll('.day-reward');
    dayRewards.forEach(day => {
        const dayNumber = parseInt(day.getAttribute('data-day'));
        
        // Remove existing classes
        day.classList.remove('active', 'claimed');
        
        // Add appropriate classes
        if (dayNumber === data.currentDay) {
            day.classList.add('active');
        }
        
        if (data.claimedDays.includes(dayNumber)) {
            day.classList.add('claimed');
        }
    });
    
    // Update claim button status
    const claimButton = document.getElementById('claim-daily');
    const claimStatus = document.getElementById('daily-claim-status');
    
    if (claimButton && claimStatus) {
        const today = new Date().toDateString();
        const lastClaimDate = data.lastClaimDate ? new Date(data.lastClaimDate).toDateString() : null;
        const canClaim = today !== lastClaimDate;
        
        claimButton.disabled = !canClaim;
        
        if (canClaim) {
            claimStatus.textContent = 'Claim your daily reward!';
            claimStatus.style.color = '#2563eb';
        } else {
            const nextResetTime = getNextResetTime();
            claimStatus.textContent = `Come back tomorrow for your next reward! (${nextResetTime})`;
            claimStatus.style.color = '#666';
        }
    }
}

// Handle daily reward claim
function handleDailyRewardClaim() {
    if (!isAuthenticated()) {
        showNotification('Please log in to claim your reward', 'error');
        redirectToLogin();
        return;
    }
    
    // Get daily rewards data
    let data = getDailyRewardsData();
    
    // Get current date
    const today = new Date();
    const todayString = today.toDateString();
    const lastClaimDate = data.lastClaimDate ? new Date(data.lastClaimDate).toDateString() : null;
    
    // Check if already claimed today
    if (todayString === lastClaimDate) {
        showNotification('You already claimed your reward today', 'error');
        return;
    }
    
    // Check if streak should be reset (more than a day since last claim)
    if (data.lastClaimDate) {
        const lastClaim = new Date(data.lastClaimDate);
        const daysSinceLastClaim = Math.floor((today - lastClaim) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastClaim > 1) {
            // Reset streak if more than a day has passed
            data.currentStreak = 1;
            data.currentDay = 1;
            data.claimedDays = [];
        } else {
            // Increment streak
            data.currentStreak++;
            
            // Update current day (cycle from 1 to 7)
            data.currentDay = data.currentDay % 7 + 1;
        }
    } else {
        // First time claiming
        data.currentStreak = 1;
        data.currentDay = 1;
    }
    
    // Add current day to claimed days
    if (!data.claimedDays.includes(data.currentDay)) {
        data.claimedDays.push(data.currentDay);
    }
    
    // Update last claim date
    data.lastClaimDate = today.toISOString();
    
    // Save updated data
    localStorage.setItem('dailyRewards', JSON.stringify(data));
    
    // Update UI
    updateDailyRewardsUI(data);
    
    // Calculate reward
    const reward = calculateDailyReward(data.currentDay);
    
    // Add reward to user balance
    addRewardToBalance(reward.type, reward.amount);
    
    // Show reward animation
    showRewardAnimation(reward.type, reward.amount);
    
    // Update user rewards balance display
    loadUserRewardsBalance();
}

// Calculate daily reward based on day
function calculateDailyReward(day) {
    switch (day) {
        case 1:
            return { type: 'coins', amount: 50 };
        case 2:
            return { type: 'coins', amount: 100 };
        case 3:
            return { type: 'coins', amount: 150 };
        case 4:
            return { type: 'coins', amount: 200 };
        case 5:
            return { type: 'gems', amount: 1 };
        case 6:
            return { type: 'coins', amount: 300 };
        case 7:
            return { type: 'gems', amount: 5 };
        default:
            return { type: 'coins', amount: 50 };
    }
}

// Get next reset time
function getNextResetTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow - now;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
}

// Initialize lucky spin
function initializeLuckySpin() {
    const spinButton = document.getElementById('spin-wheel-btn');
    if (!spinButton) return;
    
    // Get spin data
    const spinData = getSpinData();
    
    // Update spin UI
    updateSpinWheelUI(spinData);
    
    // Add event listener for spin button
    spinButton.addEventListener('click', handleSpinWheel);
    
    // Start the countdown timer
    startSpinCountdown();
}

// Get spin data from local storage or initialize
function getSpinData() {
    // Try to get data from local storage
    let data = localStorage.getItem('spinData');
    
    if (data) {
        return JSON.parse(data);
    } else {
        // Initialize with default values
        const defaultData = {
            spinsRemaining: 3,
            lastSpinDate: null,
            nextSpinTime: null
        };
        
        // Save to local storage
        localStorage.setItem('spinData', JSON.stringify(defaultData));
        return defaultData;
    }
}

// Update spin wheel UI
function updateSpinWheelUI(spinData) {
    const spinsLeft = document.getElementById('spins-left');
    const nextSpinTime = document.getElementById('next-spin-time');
    const spinButton = document.getElementById('spin-wheel-btn');
    
    // Update spins remaining
    if (spinsLeft) {
        spinsLeft.textContent = spinData.spinsRemaining;
        
        // Add visual indication for number of spins
        if (spinData.spinsRemaining === 0) {
            spinsLeft.classList.add('no-spins');
            spinsLeft.classList.remove('has-spins');
        } else {
            spinsLeft.classList.add('has-spins');
            spinsLeft.classList.remove('no-spins');
            
            // Add animation if spins were just refreshed
            if (spinData.spinsRemaining === 3) {
                spinsLeft.classList.add('refreshed');
                setTimeout(() => {
                    spinsLeft.classList.remove('refreshed');
                }, 2000);
            }
        }
    }
    
    // Update next spin time
    if (nextSpinTime) {
        if (spinData.nextSpinTime) {
            const timeLeft = calculateTimeLeft(spinData.nextSpinTime);
            nextSpinTime.textContent = timeLeft;
            nextSpinTime.classList.add('countdown-active');
        } else {
            nextSpinTime.textContent = 'Ready now!';
            nextSpinTime.classList.remove('countdown-active');
        }
    }
    
    // Update button state
    if (spinButton) {
        if (spinData.spinsRemaining <= 0) {
            spinButton.disabled = true;
            spinButton.classList.add('disabled');
            spinButton.innerHTML = '<i class="fas fa-hourglass-half"></i><span>No Spins Left</span>';
            
            // Hide glow when disabled
            const btnGlow = spinButton.querySelector('.btn-glow');
            if (btnGlow) {
                btnGlow.style.opacity = '0';
            }
        } else {
            spinButton.disabled = false;
            spinButton.classList.remove('disabled');
            spinButton.innerHTML = '<i class="fas fa-sync-alt"></i><span>Spin Now</span><div class="btn-glow"></div>';
            
            // Show glow when enabled
            const btnGlow = spinButton.querySelector('.btn-glow');
            if (btnGlow) {
                btnGlow.style.opacity = '1';
            }
        }
    }
    
    // Add pulsing effect to wheel if spins available
    const wheel = document.querySelector('.spin-wheel');
    if (wheel) {
        if (spinData.spinsRemaining > 0) {
            wheel.classList.add('ready-to-spin');
        } else {
            wheel.classList.remove('ready-to-spin');
        }
    }
}

// Start spin countdown timer
function startSpinCountdown() {
    const updateCountdown = () => {
        const data = getSpinData();
        
        // Check if next spin time reached
        if (data.nextSpinTime) {
            const now = new Date().getTime();
            const nextTime = new Date(data.nextSpinTime).getTime();
            
            if (now >= nextTime) {
                // Add a spin
                const previousSpins = data.spinsRemaining;
                data.spinsRemaining = Math.min(data.spinsRemaining + 1, 3);
                data.nextSpinTime = null;
                localStorage.setItem('spinData', JSON.stringify(data));
                
                // Notify if visible and spins increased
                if (document.visibilityState === 'visible' && data.spinsRemaining > previousSpins) {
                    showNotification('You received a free spin!', 'success');
                    
                    // Highlight the spin wheel briefly
                    const wheel = document.querySelector('.spin-wheel');
                    if (wheel) {
                        wheel.classList.add('spin-added');
                        setTimeout(() => {
                            wheel.classList.remove('spin-added');
                        }, 2000);
                    }
                    
                    // Update button with animation
                    const spinButton = document.getElementById('spin-wheel-btn');
                    if (spinButton) {
                        spinButton.classList.add('spin-added');
                        setTimeout(() => {
                            spinButton.classList.remove('spin-added');
                        }, 2000);
                    }
                }
            }
        }
        
        updateSpinWheelUI(data);
    };
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
    
    // Also update when tab becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateCountdown();
        }
    });
}

// Calculate time left for next spin
function calculateTimeLeft(nextTimeString) {
    const now = new Date().getTime();
    const nextTime = new Date(nextTimeString).getTime();
    
    let timeLeft = nextTime - now;
    
    if (timeLeft <= 0) {
        return '00:00:00';
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    timeLeft -= hours * (1000 * 60 * 60);
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    timeLeft -= minutes * (1000 * 60);
    
    const seconds = Math.floor(timeLeft / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Handle spin wheel
function handleSpinWheel() {
    if (!isAuthenticated()) {
        showNotification('Please log in to spin the wheel', 'error');
        return;
    }
    
    // Get spin data from storage
    let spinData = getSpinData();
    
    // Check if spins available
    if (spinData.spinsRemaining <= 0) {
        showNotification('No spins remaining. Wait for next free spin!', 'info');
        return;
    }
    
    // Decrease spin count
    spinData.spinsRemaining--;
    
    // If no spins left, set next spin time (3 hours from now)
    if (spinData.spinsRemaining === 0) {
        const nextTime = new Date();
        nextTime.setHours(nextTime.getHours() + 3);
        spinData.nextSpinTime = nextTime.toISOString();
    }
    
    // Update last spin date
    spinData.lastSpinDate = new Date().toISOString();
    
    // Save to storage
    localStorage.setItem('spinData', JSON.stringify(spinData));
    
    // Update UI
    updateSpinWheelUI(spinData);
    
    // Perform spin animation
    const wheel = document.querySelector('.spin-wheel');
    const result = document.getElementById('spin-result');
    const spinButton = document.getElementById('spin-wheel-btn');
    
    // If touch device, add haptic feedback
    if ('vibrate' in navigator) {
        navigator.vibrate(100);
    }
    
    // Add spinning effect to button
    if (spinButton) {
        spinButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Spinning...</span>';
        spinButton.classList.add('spinning-btn');
        spinButton.disabled = true;
    }
    
    // Clear previous result
    if (result) {
        result.textContent = '';
        result.classList.remove('prize-won');
    }
    
    // Reset wheel
    if (wheel) {
        wheel.classList.remove('spinning');
        void wheel.offsetWidth; // Force reflow
        
        // Add special effects
        const sparkles = document.querySelectorAll('.spin-wheel-container .reward-sparkles');
        sparkles.forEach(sparkle => {
            sparkle.style.opacity = '1';
            sparkle.style.animation = 'sparkle 2s infinite';
        });
        
        // Randomly determine prize segment (0-5)
        const segmentIndex = Math.floor(Math.random() * 6);
        
        // Calculate rotation (multiple spins + segment position + random offset)
        const baseRotation = segmentIndex * 60;
        const randomOffset = Math.floor(Math.random() * 30) + 15;
        const finalRotation = 1800 + baseRotation + randomOffset;
        
        // Set rotation
        wheel.style.setProperty('--rotate-deg', `${finalRotation}deg`);
        
        // Add spinning class
        wheel.classList.add('spinning');
        
        // Add temporary dramatic lighting
        const wheelContainer = document.querySelector('.spin-wheel-container');
        if (wheelContainer) {
            wheelContainer.classList.add('spinning-active');
        }
        
        // Determine prize based on segment
        let prize;
        const wheelSegments = document.querySelectorAll('.wheel-segment');
        if (wheelSegments && wheelSegments[segmentIndex]) {
            const prizeText = wheelSegments[segmentIndex].getAttribute('data-prize');
            if (prizeText.includes('Coins')) {
                const amount = parseInt(prizeText.split(' ')[0]);
                prize = { type: 'coins', amount: amount };
            } else if (prizeText.includes('Gem')) {
                const amount = parseInt(prizeText.split(' ')[0]);
                prize = { type: 'gems', amount: amount };
            }
        } else {
            // Fallback prizes if segments not found
            const prizes = [
                { type: 'coins', amount: 50 },
                { type: 'coins', amount: 100 },
                { type: 'coins', amount: 150 },
                { type: 'coins', amount: 200 },
                { type: 'gems', amount: 1 },
                { type: 'coins', amount: 500 }
            ];
            prize = prizes[segmentIndex];
        }
        
        // After animation completes, show result
        setTimeout(() => {
            // Reset sparkles animation
            sparkles.forEach(sparkle => {
                sparkle.style.opacity = '0.8';
                sparkle.style.animation = 'sparkle 3s infinite';
            });
            
            // Remove active spinning effect
            if (wheelContainer) {
                wheelContainer.classList.remove('spinning-active');
            }
            
            // Reset button
            if (spinButton) {
                spinButton.innerHTML = '<i class="fas fa-sync-alt"></i><span>Spin Now</span><div class="btn-glow"></div>';
                spinButton.classList.remove('spinning-btn');
                spinButton.disabled = spinData.spinsRemaining <= 0;
            }
            
            // Show result
            if (result) {
                result.textContent = `You won ${prize.amount} ${prize.type}!`;
                result.classList.add('prize-won');
            }
            
            // Update user balance
            const userCoins = parseInt(localStorage.getItem('userCoins') || '0');
            const userGems = parseInt(localStorage.getItem('userGems') || '0');
            
            if (prize.type === 'coins') {
                localStorage.setItem('userCoins', userCoins + prize.amount);
            } else {
                localStorage.setItem('userGems', userGems + prize.amount);
            }
            
            // Update UI
            loadUserRewardsBalance();
            
            // Show prize animation
            createConfetti();
            
            // Create celebration animation
            const prizeAnimation = document.createElement('div');
            prizeAnimation.className = 'prize-animation';
            prizeAnimation.innerHTML = `
                <div class="prize-content">
                    <div class="prize-icon">
                        <i class="fas ${prize.type === 'coins' ? 'fa-coins' : 'fa-gem'}"></i>
                    </div>
                    <div class="prize-title">You Won!</div>
                    <div class="prize-amount">${prize.amount} ${prize.type.toUpperCase()}</div>
                    <button class="prize-button">COLLECT</button>
                </div>
            `;
            document.body.appendChild(prizeAnimation);
            
            // Show animation
            setTimeout(() => {
                prizeAnimation.classList.add('show');
            }, 100);
            
            // Add click handler to dismiss
            const collectButton = prizeAnimation.querySelector('.prize-button');
            if (collectButton) {
                collectButton.addEventListener('click', () => {
                    prizeAnimation.classList.remove('show');
                    setTimeout(() => {
                        prizeAnimation.remove();
                    }, 300);
                });
            }
            
            // Show notification
            showNotification(`You won ${prize.amount} ${prize.type}!`, 'success');
            
        }, 4000); // Match with CSS animation duration
    }
}

// Add reward to user balance
function addRewardToBalance(type, amount) {
    // Get current balance
    let balance = getUserRewardsBalance();
    
    // Add reward
    if (type === 'coins') {
        balance.coins += amount;
    } else if (type === 'gems') {
        balance.gems += amount;
    }
    
    // Save updated balance
    localStorage.setItem('userRewards', JSON.stringify(balance));
    
    // Try to update on server if authenticated
    if (isAuthenticated()) {
        updateRewardsOnServer(type, amount);
    }
}

// Get user rewards balance
function getUserRewardsBalance() {
    // Try to get data from local storage
    let data = localStorage.getItem('userRewards');
    
    if (data) {
        return JSON.parse(data);
    } else {
        // Initialize with default values
        const defaultData = {
            coins: 0,
            gems: 0
        };
        
        // Save to local storage
        localStorage.setItem('userRewards', JSON.stringify(defaultData));
        return defaultData;
    }
}

// Load user rewards balance for display
function loadUserRewardsBalance() {
    const balance = getUserRewardsBalance();
    
    // Update the main balance display
    const coinsElement = document.getElementById('user-coins');
    const gemsElement = document.getElementById('user-gems');
    
    if (coinsElement) {
        coinsElement.textContent = balance.coins;
    }
    
    if (gemsElement) {
        gemsElement.textContent = balance.gems;
    }
    
    // Update the navbar balance display
    const navCoinsElement = document.getElementById('nav-coins');
    const navGemsElement = document.getElementById('nav-gems');
    
    if (navCoinsElement) {
        navCoinsElement.textContent = balance.coins;
    }
    
    if (navGemsElement) {
        navGemsElement.textContent = balance.gems;
    }
    
    // Show/hide rewards badge based on available rewards
    updateRewardsBadge();
}

// Update rewards on server
function updateRewardsOnServer(type, amount) {
    const token = getAuthToken();
    
    fetch(`${API_URL}/users/rewards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            type: type,
            amount: amount
        })
    }).catch(error => {
        console.error('Error updating rewards on server:', error);
    });
}

// Show reward animation
function showRewardAnimation(type, amount) {
    // Create animation container if it doesn't exist
    let prizeAnimation = document.querySelector('.prize-animation');
    
    if (!prizeAnimation) {
        prizeAnimation = document.createElement('div');
        prizeAnimation.className = 'prize-animation';
        document.body.appendChild(prizeAnimation);
    }
    
    // Set content based on reward type
    const icon = type === 'coins' ? 'fa-coins' : 'fa-gem';
    const color = type === 'coins' ? '#f59e0b' : '#ec4899';
    
    prizeAnimation.innerHTML = `
        <div class="prize-content">
            <div class="prize-icon">
                <i class="fas ${icon}" style="color: ${color}"></i>
            </div>
            <div class="prize-title">You Won!</div>
            <div class="prize-amount">${amount} ${type.toUpperCase()}</div>
            <button class="prize-button">COLLECT</button>
        </div>
    `;
    
    // Show animation
    setTimeout(() => {
        prizeAnimation.classList.add('show');
    }, 100);
    
    // Add event listener to close button
    const closeButton = prizeAnimation.querySelector('.prize-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            prizeAnimation.classList.remove('show');
            setTimeout(() => {
                prizeAnimation.remove();
            }, 300);
        });
    }
}

// Update rewards badge visibility
function updateRewardsBadge() {
    const rewardsBadge = document.querySelector('.rewards-badge');
    if (!rewardsBadge) return;
    
    // Check if daily reward is available
    const dailyRewardsData = getDailyRewardsData();
    const today = new Date().toDateString();
    const lastClaimDate = dailyRewardsData.lastClaimDate ? new Date(dailyRewardsData.lastClaimDate).toDateString() : null;
    const canClaimDaily = today !== lastClaimDate;
    
    // Check if spin is available
    const spinData = getSpinData();
    const canSpin = spinData.spinsRemaining > 0;
    
    // Show badge if any rewards are available
    if (canClaimDaily || canSpin) {
        rewardsBadge.style.display = 'flex';
        
        // Change badge content based on what's available
        if (canClaimDaily && canSpin) {
            rewardsBadge.textContent = '2';
        } else {
            rewardsBadge.textContent = '1';
        }
    } else {
        rewardsBadge.style.display = 'none';
    }
    
    // Update icon pulse animation based on rewards availability
    const rewardsIcon = document.querySelector('.rewards-icon');
    if (rewardsIcon) {
        if (canClaimDaily || canSpin) {
            rewardsIcon.classList.add('has-rewards');
        } else {
            rewardsIcon.classList.remove('has-rewards');
        }
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileAuthLinks = document.querySelector('.mobile-auth-links');
    
    if (mobileMenuBtn && mobileNav) {
        // Toggle mobile menu when button is clicked
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            // Add class to body to prevent scrolling when menu is open
            document.body.classList.toggle('mobile-menu-open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                mobileNav.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        });
        
        // Update mobile auth links based on authentication status
        const isLoggedIn = isAuthenticated();
        if (mobileAuthLinks) {
            mobileAuthLinks.style.display = isLoggedIn ? 'none' : 'flex';
        }
        
        // Update mobile balance display
        updateMobileBalance();
    }
}

// Update mobile balance display
function updateMobileBalance() {
    // Get user coins and gems
    const userCoins = localStorage.getItem('userCoins') || '0';
    const userGems = localStorage.getItem('userGems') || '0';
    
    // Update mobile coins and gems display
    const mobileCoins = document.getElementById('mobile-coins');
    const mobileGems = document.getElementById('mobile-gems');
    
    if (mobileCoins) {
        mobileCoins.textContent = userCoins;
    }
    
    if (mobileGems) {
        mobileGems.textContent = userGems;
    }
}

// Update user balance
function updateUserBalance() {
    // Get user coins and gems
    const userCoins = localStorage.getItem('userCoins') || '0';
    const userGems = localStorage.getItem('userGems') || '0';
    
    // Update all coin and gem displays
    const coinElements = document.querySelectorAll('#nav-coins, #user-coins, #mobile-coins');
    const gemElements = document.querySelectorAll('#nav-gems, #user-gems, #mobile-gems');
    
    coinElements.forEach(el => {
        if (el) el.textContent = userCoins;
    });
    
    gemElements.forEach(el => {
        if (el) el.textContent = userGems;
    });
} 