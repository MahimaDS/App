// Home.js - Dedicated script for loading games on the home page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Home page loaded - Loading games directly');
    loadFeaturedGames();
    setupEventListeners();
});

// Load featured games on the home page
function loadFeaturedGames() {
    const gameGrid = document.querySelector('.game-grid.featured-preview');
    if (!gameGrid) {
        console.error('Game grid not found on home page!');
        return;
    }
    
    // Hide loading indicator
    const loadingElement = gameGrid.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
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
}

// Setup event listeners
function setupEventListeners() {
    // Set up favorite button click handlers
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(btn.closest('.game-card').dataset.id, btn.closest('.game-card').querySelector('h3').textContent);
        });
    });
    
    // Set up play button click handlers
    document.querySelectorAll('.play-now-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            playGame(btn.closest('.game-card').dataset.id);
        });
    });
}

// Toggle favorite status
function toggleFavorite(gameId, gameTitle) {
    console.log(`Toggle favorite for game: ${gameId} - ${gameTitle}`);
    const btn = document.querySelector(`.game-card[data-id="${gameId}"] .favorite-btn`);
    
    if (btn) {
        const isFavorite = btn.classList.contains('active');
        
        if (isFavorite) {
            btn.classList.remove('active');
            btn.querySelector('i').className = 'far fa-heart';
            showNotification(`Removed from favorites: ${gameTitle}`);
        } else {
            btn.classList.add('active');
            btn.querySelector('i').className = 'fas fa-heart';
            showNotification(`Added to favorites: ${gameTitle}`);
        }
    }
}

// Play game
function playGame(gameId) {
    console.log(`Playing game ${gameId}`);
    alert(`Starting game ${gameId}`);
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