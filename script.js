// DOM Elements
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const gameCards = document.querySelectorAll('.game-card');
const categoryCards = document.querySelectorAll('.category-card');
const ctaButton = document.querySelector('.cta-button');

// Sample game data
const games = [
    {
        title: 'Game Title 1',
        category: 'Action, Adventure',
        rating: 4,
        image: 'https://via.placeholder.com/300x200'
    },
    {
        title: 'Game Title 2',
        category: 'Strategy, RPG',
        rating: 5,
        image: 'https://via.placeholder.com/300x200'
    },
    {
        title: 'Game Title 3',
        category: 'Sports, Racing',
        rating: 4.5,
        image: 'https://via.placeholder.com/300x200'
    }
];

// Search functionality
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const gameGrid = document.querySelector('.game-grid');
    gameGrid.innerHTML = '';

    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)
    );

    if (filteredGames.length === 0) {
        gameGrid.innerHTML = '<p class="no-results">No games found matching your search.</p>';
        return;
    }

    filteredGames.forEach(game => {
        const gameCard = createGameCard(game);
        gameGrid.appendChild(gameCard);
    });
});

// Create game card element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card fade-in';
    
    const stars = Array(5).fill('').map((_, index) => {
        if (index < Math.floor(game.rating)) {
            return '<i class="fas fa-star"></i>';
        } else if (index === Math.floor(game.rating) && game.rating % 1 !== 0) {
            return '<i class="fas fa-star-half-alt"></i>';
        } else {
            return '<i class="far fa-star"></i>';
        }
    }).join('');

    card.innerHTML = `
        <img src="${game.image}" alt="${game.title}">
        <div class="game-info">
            <h3>${game.title}</h3>
            <p>${game.category}</p>
            <div class="rating">
                ${stars}
            </div>
        </div>
    `;

    return card;
}

// Category filter functionality
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.querySelector('h3').textContent;
        const gameGrid = document.querySelector('.game-grid');
        gameGrid.innerHTML = '';

        const filteredGames = games.filter(game => 
            game.category.toLowerCase().includes(category.toLowerCase())
        );

        if (filteredGames.length === 0) {
            gameGrid.innerHTML = '<p class="no-results">No games found in this category.</p>';
            return;
        }

        filteredGames.forEach(game => {
            const gameCard = createGameCard(game);
            gameGrid.appendChild(gameCard);
        });
    });
});

// CTA Button animation
ctaButton.addEventListener('click', () => {
    ctaButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        ctaButton.style.transform = 'scale(1)';
    }, 200);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all game cards and category cards
gameCards.forEach(card => observer.observe(card));
categoryCards.forEach(card => observer.observe(card));

// Mobile menu toggle
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const mobileNav = document.querySelector('.mobile-nav');
    
    // Check if there's already a mobile menu button
    if (document.querySelector('.mobile-menu-btn')) {
        return;
    }
    
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-btn';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.setAttribute('aria-label', 'Toggle menu');
    
    navbar.insertBefore(menuButton, navLinks);
    
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        
        menuButton.classList.toggle('active');
        
        // For Surface Pro and larger tablets, show dropdown navigation
        navLinks.classList.toggle('active');
        
        // For all mobile devices, show side panel navigation
        if (mobileNav) {
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        // If menu is active and click is outside menu elements
        if ((menuButton.classList.contains('active')) && 
            !e.target.closest('.mobile-menu-btn') && 
            !e.target.closest('.nav-links') &&
            !e.target.closest('.mobile-nav')) {
            
            menuButton.classList.remove('active');
            navLinks.classList.remove('active');
            
            if (mobileNav) {
                mobileNav.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        }
    });
    
    // Handle ESC key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuButton.classList.contains('active')) {
            menuButton.classList.remove('active');
            navLinks.classList.remove('active');
            
            if (mobileNav) {
                mobileNav.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        }
    });
};

// Initialize mobile menu if screen width matches Surface Pro size
if (window.innerWidth <= 992) {
    createMobileMenu();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 992) {
        createMobileMenu();
    } else {
        const menuButton = document.querySelector('.mobile-menu-btn');
        if (menuButton) {
            menuButton.remove();
        }
        document.querySelector('.nav-links').classList.remove('active');
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
            mobileNav.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    }
}); 