document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Load all games
    loadAllGames();
    
    // Set up category filters
    setupCategoryFilters();
    
    // Set up mobile menu
    setupMobileMenu();
});

function loadUserData() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Update UI based on login status
    document.querySelector('.auth-links').style.display = isLoggedIn ? 'none' : 'flex';
    document.querySelector('.user-links').style.display = isLoggedIn ? 'flex' : 'none';
    
    // Update mobile auth links
    const mobileAuthLinks = document.querySelector('.mobile-auth-links');
    if (mobileAuthLinks) {
        mobileAuthLinks.style.display = isLoggedIn ? 'none' : 'flex';
    }
    
    // Load user coins and gems
    if (isLoggedIn) {
        const coins = localStorage.getItem('userCoins') || '0';
        const gems = localStorage.getItem('userGems') || '0';
        
        // Update all coin and gem displays
        document.querySelectorAll('#nav-coins, #user-coins, #mobile-coins').forEach(el => {
            if (el) el.textContent = coins;
        });
        document.querySelectorAll('#nav-gems, #user-gems, #mobile-gems').forEach(el => {
            if (el) el.textContent = gems;
        });
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && mobileNav) {
        // Toggle mobile menu when button is clicked
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            
            mobileMenuBtn.classList.toggle('active');
            
            // For Surface Pro and larger tablets, show dropdown navigation
            navLinks.classList.toggle('active');
            
            // For all mobile devices, show side panel navigation
            mobileNav.classList.toggle('active');
            
            // Add class to body to prevent scrolling and create overlay
            document.body.classList.toggle('mobile-menu-open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            // If menu is active and click is outside menu elements
            if ((mobileNav.classList.contains('active') || navLinks.classList.contains('active')) && 
                !e.target.closest('.mobile-menu-btn') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.mobile-nav')) {
                
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        });
        
        // Handle ESC key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && (mobileNav.classList.contains('active') || navLinks.classList.contains('active'))) {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        });
    }
}

function loadAllGames() {
    const gameGrid = document.querySelector('.game-grid.full-grid');
    if (!gameGrid) {
        console.error('Game grid not found on page!');
        return;
    }
    
    // Show loading indicator
    gameGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span class="loading-text">Loading games...</span>
        </div>
    `;
    
    // Fetch games (in a real app, this would be an API call)
    fetchGames()
        .then(games => {
            if (!games || games.length === 0) {
                gameGrid.innerHTML = '<div class="error-message">No games available. Please check back later.</div>';
                return;
            }
            
            // Clear loading indicator
            gameGrid.innerHTML = '';
            
            console.log(`Loaded ${games.length} games`);
            
            // Render all games
            games.forEach(game => {
                try {
                    const gameCard = createGameCard(game);
                    gameGrid.appendChild(gameCard);
                } catch (err) {
                    console.error(`Error creating game card for game ${game.id}:`, err);
                }
            });
            
            // Set up the category filter after games are loaded
            setupCategoryFilters();
        })
        .catch(error => {
            console.error('Error loading games:', error);
            gameGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load games. Please try again later.</p>
                    <button id="retry-games-btn" class="retry-btn">Retry</button>
                </div>
            `;
            
            // Add retry button functionality
            const retryBtn = document.getElementById('retry-games-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    loadAllGames();
                });
            }
        });
}

function fetchGames() {
    // This would normally be an API call
    // For demo purposes, we'll return mock data
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: 'Space Adventure',
                    category: 'Adventure',
                    description: 'Explore the vast universe and discover new planets in this exciting adventure game.',
                    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.8,
                    reviews: 120,
                    plays: 25600
                },
                {
                    id: 2,
                    title: 'Speed Racer',
                    category: 'Racing',
                    description: 'Race through challenging tracks and become the ultimate racing champion.',
                    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.5,
                    reviews: 95,
                    plays: 18900
                },
                {
                    id: 3,
                    title: 'Puzzle Master',
                    category: 'Puzzle',
                    description: 'Test your brain with increasingly difficult puzzles and mind-bending challenges.',
                    image: 'https://images.unsplash.com/photo-1577702312572-5b7b17123874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.7,
                    reviews: 85,
                    plays: 14500
                },
                {
                    id: 4,
                    title: 'Zombie Survival',
                    category: 'Horror',
                    description: 'Survive the zombie apocalypse by gathering resources and building defenses.',
                    image: 'https://images.unsplash.com/photo-1605806616949-59450e93c90c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.6,
                    reviews: 110,
                    plays: 22300
                },
                {
                    id: 5,
                    title: 'Medieval Kingdom',
                    category: 'Strategy',
                    description: 'Build your kingdom, train your army, and conquer neighboring territories.',
                    image: 'https://images.unsplash.com/photo-1519074069390-a79c8b701cf6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.9,
                    reviews: 150,
                    plays: 30100
                },
                {
                    id: 6,
                    title: 'Basketball Pro',
                    category: 'Sports',
                    description: 'Experience the thrill of professional basketball with realistic gameplay.',
                    image: 'https://images.unsplash.com/photo-1546519638-68e109acd27d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.4,
                    reviews: 75,
                    plays: 12800
                },
                {
                    id: 7,
                    title: 'Dragon Quest',
                    category: 'RPG',
                    description: 'Embark on an epic journey to defeat the dragon and save the kingdom.',
                    image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.8,
                    reviews: 130,
                    plays: 28700
                },
                {
                    id: 8,
                    title: 'Ninja Warrior',
                    category: 'Action',
                    description: 'Master the art of stealth and combat as you progress through challenging levels.',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.7,
                    reviews: 100,
                    plays: 19500
                },
                {
                    id: 9,
                    title: 'City Builder',
                    category: 'Strategy',
                    description: 'Plan and develop your own city, manage resources and keep citizens happy.',
                    image: 'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.5,
                    reviews: 90,
                    plays: 15600
                },
                {
                    id: 10,
                    title: 'Treasure Hunt',
                    category: 'Adventure',
                    description: 'Search for hidden treasures across exotic locations around the world.',
                    image: 'https://images.unsplash.com/photo-1523867574998-1a336b93add4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.6,
                    reviews: 85,
                    plays: 14300
                },
                {
                    id: 11,
                    title: 'Space Shooter',
                    category: 'Action',
                    description: 'Defend Earth from alien invasions in this fast-paced space shooter.',
                    image: 'https://images.unsplash.com/photo-1596838132731-31a6de564f3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.4,
                    reviews: 70,
                    plays: 11700
                },
                {
                    id: 12,
                    title: 'Word Master',
                    category: 'Puzzle',
                    description: 'Expand your vocabulary and solve challenging word puzzles.',
                    image: 'https://images.unsplash.com/photo-1595561629463-651ce90b34e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350',
                    rating: 4.3,
                    reviews: 60,
                    plays: 9800
                }
            ]);
        }, 800);
    });
}

function createGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    gameCard.setAttribute('data-id', game.id);
    
    // Store the category in lowercase for consistent comparison
    gameCard.setAttribute('data-category', game.category.toLowerCase());
    
    // Generate rating stars based on actual rating value
    const ratingStars = getRatingStars(game.rating);
    
    // Use a fallback image URL in case the main one fails to load
    const fallbackImg = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop";
    
    gameCard.innerHTML = `
        <div class="game-image">
            <img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.src='${fallbackImg}'">
            <div class="game-category">${game.category}</div>
            <button class="favorite-btn" data-id="${game.id}" aria-label="Add to favorites">
                <i class="far fa-heart"></i>
            </button>
        </div>
        <div class="game-info">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="rating">
                ${ratingStars}
                <span>${game.rating} (${game.reviews} reviews)</span>
            </div>
            <div class="game-actions">
                <button class="play-now-btn">
                    <i class="fas fa-play"></i>
                    <span>Play Now</span>
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const playBtn = gameCard.querySelector('.play-now-btn');
    playBtn.addEventListener('click', () => playGame(game.id));
    
    const favoriteBtn = gameCard.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', function() {
        toggleFavorite(this, game.id);
    });
    
    return gameCard;
}

// Get rating stars HTML - copy from index.js
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

// Set up category filters - KEEP THIS VERSION
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoriesContainer = document.querySelector('.categories-container');
    
    // Debug logs to help troubleshoot
    console.log('Setting up category filters');
    console.log('Found category buttons:', categoryButtons.length);
    
    // Convert all category button data-attributes to lowercase
    categoryButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        if (category && category !== 'all') {
            button.setAttribute('data-category', category.toLowerCase());
        }
        console.log(`Category button: ${category} → ${button.getAttribute('data-category')}`);
    });
    
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
        setTimeout(updateScrollIndicator, 100);
    }
    
    // Setup click handlers for category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Category button clicked:', this.getAttribute('data-category'));
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter games by category (lowercase for consistency)
            const category = this.getAttribute('data-category').toLowerCase();
            filterGamesByCategory(category);
            
            // Scroll to game grid on mobile
            if (window.innerWidth < 768) {
                const gamesSection = document.getElementById('all-games');
                if (gamesSection) {
                    gamesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Make sure "All Games" is active by default
    const allGamesBtn = document.querySelector('.category-btn[data-category="all"]');
    if (allGamesBtn) {
        console.log('Setting "All Games" as default active category');
        allGamesBtn.classList.add('active');
    }
}

function filterGamesByCategory(category) {
    console.log(`Filtering games by category: "${category}"`);
    const gameCards = document.querySelectorAll('.game-card');
    let visibleCount = 0;
    
    // Log all game cards and their categories for debugging
    console.log(`Found ${gameCards.length} game cards to filter`);
    
    gameCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        console.log(`Game card: ${card.querySelector('h3').textContent}, Category: ${cardCategory}`);
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`Displaying ${visibleCount} games after filtering`);
    
    // If no games found, show a message
    const gameGrid = document.querySelector('.game-grid.full-grid');
    const noResultsEl = document.querySelector('.no-results');
    
    if (visibleCount === 0 && !noResultsEl) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <p>No games found in "${category}" category</p>
            <button class="reset-filters-btn">Show All Games</button>
        `;
        gameGrid.appendChild(noResults);
        
        // Add event listener to the reset button
        const resetBtn = noResults.querySelector('.reset-filters-btn');
        resetBtn.addEventListener('click', () => {
            // Reset to "All Games" category
            const allGamesBtn = document.querySelector('.category-btn[data-category="all"]');
            if (allGamesBtn) {
                allGamesBtn.click();
            }
        });
    } else if (visibleCount > 0 && noResultsEl) {
        noResultsEl.remove();
    }
}

function playGame(gameId) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Prompt user to login
        const shouldLogin = confirm('Please log in to play this game. Would you like to log in now?');
        if (shouldLogin) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    console.log(`Playing game with ID: ${gameId}`);
    
    // Add a visual effect before launching the game
    const gameCard = document.querySelector(`.game-card[data-id="${gameId}"]`);
    if (gameCard) {
        gameCard.classList.add('game-starting');
        
        // Add vibration feedback for mobile devices
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // Remove effect after animation completes
        setTimeout(() => {
            gameCard.classList.remove('game-starting');
            // In a real app, this would redirect to the game page or launch the game
            alert(`Playing game ID: ${gameId}`);
        }, 500);
    } else {
        // Fallback if card not found
        alert(`Playing game ID: ${gameId}`);
    }
}

function toggleFavorite(button, gameId) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        const shouldLogin = confirm('Please log in to add games to favorites. Would you like to log in now?');
        if (shouldLogin) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    const icon = button.querySelector('i');
    
    // Toggle favorite status
    if (icon.classList.contains('far')) {
        // Add to favorites
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('active');
        
        // Store in local storage
        addToFavorites(gameId);
        
        // Add vibration feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // Show a small notification
        showNotification('Added to favorites!');
    } else {
        // Remove from favorites
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('active');
        
        // Remove from local storage
        removeFromFavorites(gameId);
        
        // Show notification
        showNotification('Removed from favorites');
    }
}

// Helper function to add a game to favorites
function addToFavorites(gameId) {
    try {
        // Get existing favorites
        let favorites = JSON.parse(localStorage.getItem('gameFavorites') || '[]');
        
        // Add if not already in favorites
        if (!favorites.includes(gameId)) {
            favorites.push(gameId);
            localStorage.setItem('gameFavorites', JSON.stringify(favorites));
        }
        
        console.log(`Added game ${gameId} to favorites`);
    } catch (error) {
        console.error('Error saving favorite:', error);
    }
}

// Helper function to remove a game from favorites
function removeFromFavorites(gameId) {
    try {
        // Get existing favorites
        let favorites = JSON.parse(localStorage.getItem('gameFavorites') || '[]');
        
        // Remove from favorites
        favorites = favorites.filter(id => id !== gameId);
        localStorage.setItem('gameFavorites', JSON.stringify(favorites));
        
        console.log(`Removed game ${gameId} from favorites`);
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}

// Show a temporary notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add animation class after a brief delay (for transition effect)
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove element after fade out animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
} 