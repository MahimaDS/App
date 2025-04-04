// Profile page demo mode
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the profile page without requiring login
    initializeTabs();
    setupMobileMenu();
    loadDemoUserData();
    setupAvatarChange();
    setupFormSubmit();

    // Simulate loading data
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Set up tab switching functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Save the active tab to localStorage
            localStorage.setItem('activeProfileTab', targetTab);
        });
    });
    
    // Check if there's a saved active tab
    const savedTab = localStorage.getItem('activeProfileTab');
    if (savedTab) {
        const savedTabButton = document.querySelector(`.tab-btn[data-tab="${savedTab}"]`);
        if (savedTabButton) {
            savedTabButton.click();
        }
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    // Create menu HTML and add it directly to document body
    document.body.insertAdjacentHTML('beforeend', `
        <div id="simple-mobile-menu" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #1a1a1a;
            z-index: 100000;
            display: none;
            padding: 60px 20px 20px;
            overflow-y: auto;
        ">
            <button id="close-mobile-menu" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                z-index: 100001;
            "><i class="fas fa-times"></i></button>
            
            <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
                <a href="index.html" style="color: white; text-decoration: none; padding: 12px; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <i class="fas fa-home" style="margin-right: 10px;"></i> Home
                </a>
                <a href="games.html" style="color: white; text-decoration: none; padding: 12px; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <i class="fas fa-gamepad" style="margin-right: 10px;"></i> Games
                </a>
                <a href="#" style="color: white; text-decoration: none; padding: 12px; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <i class="fas fa-list" style="margin-right: 10px;"></i> Categories
                </a>
                <a href="favorites.html" style="color: white; text-decoration: none; padding: 12px; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <i class="fas fa-heart" style="margin-right: 10px;"></i> Favorites
                </a>
                <a href="profile.html" style="color: #ff4757; text-decoration: none; padding: 12px; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <i class="fas fa-user" style="margin-right: 10px;"></i> Profile
                </a>
                <a href="rewards.html" style="color: white; text-decoration: none; padding: 12px; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <i class="fas fa-gift" style="margin-right: 10px;"></i> Rewards
                </a>
            </div>
            
            <div style="margin-top: auto; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; color: white;">
                        <i class="fas fa-coins" style="color: #FFD700; margin-right: 5px;"></i>
                        <span id="inline-menu-coins">2,450</span>
                    </div>
                    <div style="display: flex; align-items: center; color: white;">
                        <i class="fas fa-gem" style="color: #FF6B9E; margin-right: 5px;"></i>
                        <span id="inline-menu-gems">175</span>
                    </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <a href="login.html" style="background-color: #ff4757; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: 500;">Login</a>
                    <a href="register.html" style="background-color: #ff4757; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: 500;">Register</a>
                </div>
            </div>
        </div>
    `);
    
    // Add direct event handlers
    document.addEventListener('DOMContentLoaded', function() {
        // Update menu currency values
        const menuCoins = document.getElementById('inline-menu-coins');
        const menuGems = document.getElementById('inline-menu-gems');
        const navCoins = document.getElementById('nav-coins');
        const navGems = document.getElementById('nav-gems');
        
        if (menuCoins && navCoins) menuCoins.textContent = navCoins.textContent;
        if (menuGems && navGems) menuGems.textContent = navGems.textContent;
    });
    
    // Direct event listeners for all buttons - these are applied immediately
    // Get references to menu elements
    const menu = document.getElementById('simple-mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    
    // Use direct onclick handlers to avoid event binding issues
    // For menu button - add directly to the HTML element
    const mobileMenuBtns = document.querySelectorAll('.mobile-menu-btn');
    mobileMenuBtns.forEach(btn => {
        btn.setAttribute('onclick', "document.getElementById('simple-mobile-menu').style.display='block'; document.body.style.overflow='hidden';");
    });
    
    // For close button
    if (closeBtn) {
        closeBtn.setAttribute('onclick', "document.getElementById('simple-mobile-menu').style.display='none'; document.body.style.overflow='auto';");
    }
    
    // For all links in the menu
    const menuLinks = menu ? menu.querySelectorAll('a') : [];
    menuLinks.forEach(link => {
        link.setAttribute('onclick', "document.getElementById('simple-mobile-menu').style.display='none'; document.body.style.overflow='auto';");
    });
    
    // Add a global click listener for clicks outside menu
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('simple-mobile-menu');
        if (!menu) return;
        
        // If menu is visible and click is outside menu and not on menu button
        if (menu.style.display === 'block' && 
            !menu.contains(e.target) && 
            !e.target.closest('.mobile-menu-btn')) {
            menu.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Load demo user data instead of requiring authentication
function loadDemoUserData() {
    try {
        // Update UI based on login status - show both for demo purposes
        const authLinks = document.querySelector('.auth-links');
        const userLinks = document.querySelector('.user-links');
        
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'flex';
        
        // Update mobile auth links
        const mobileAuthLinks = document.querySelector('.mobile-auth-links');
        if (mobileAuthLinks) {
            mobileAuthLinks.style.display = 'flex';
        }
        
        // Demo user data
        const userData = {
            username: 'GameMaster',
            email: 'example@mgamer.com',
            bio: 'Passionate gamer with a love for strategy and adventure games. Always looking for new challenges!',
            level: '25',
            xp: '7500',
            xpNeeded: '10000',
            coins: '2,450',
            gems: '175',
            gamesPlayed: '157',
            favorites: '32',
            achievements: '89',
            totalXp: '12.8K'
        };
        
        // Update profile info
        const elements = {
            profileUsername: document.getElementById('profileUsername'),
            profileBio: document.getElementById('profileBio'),
            userLevel: document.getElementById('userLevel'),
            gamesPlayed: document.getElementById('gamesPlayed'),
            favoriteGames: document.getElementById('favoriteGames'),
            achievements: document.getElementById('achievements'),
            totalXp: document.getElementById('totalXp'),
            username: document.getElementById('username'),
            email: document.getElementById('email'),
            bio: document.getElementById('bio')
        };
        
        // Only update elements that exist in the DOM
        if (elements.profileUsername) elements.profileUsername.textContent = userData.username;
        if (elements.profileBio) elements.profileBio.textContent = userData.bio;
        if (elements.userLevel) elements.userLevel.textContent = userData.level;
        if (elements.gamesPlayed) elements.gamesPlayed.textContent = userData.gamesPlayed;
        if (elements.favoriteGames) elements.favoriteGames.textContent = userData.favorites;
        if (elements.achievements) elements.achievements.textContent = userData.achievements;
        if (elements.totalXp) elements.totalXp.textContent = userData.totalXp;
        
        // Update form fields
        if (elements.username) elements.username.value = userData.username;
        if (elements.email) elements.email.value = userData.email;
        if (elements.bio) elements.bio.value = userData.bio;
        
        // Update XP progress
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progress = (parseFloat(userData.xp) / parseFloat(userData.xpNeeded)) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        // Update XP info
        const xpInfo = document.querySelector('.xp-info span');
        if (xpInfo) {
            xpInfo.textContent = `${userData.xp} / ${userData.xpNeeded} XP`;
        }
        
        // Update nav coins and gems
        document.querySelectorAll('#nav-coins, #mobile-coins, #user-coins, #menu-coins').forEach(el => {
            if (el) el.textContent = userData.coins;
        });
        
        document.querySelectorAll('#nav-gems, #mobile-gems, #user-gems, #menu-gems').forEach(el => {
            if (el) el.textContent = userData.gems;
        });
        
        // Load achievements and activity data
        loadAchievements();
        loadDemoActivity();
    } catch (error) {
        console.error('Error loading demo data:', error);
        showNotification('Error loading demo data. Please refresh the page.', 'error');
    }
}

// Load demo activity data
function loadDemoActivity() {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;
    
    // Demo activity data
    const activities = [
        {
            type: 'game-played',
            title: 'Played Medieval Kingdom',
            description: 'Reached level 12 and unlocked the "Master Strategist" achievement',
            time: '2 hours ago'
        },
        {
            type: 'achievement',
            title: 'Unlocked Achievement',
            description: 'Earned "Speed Demon" for completing Space Shooter in under 20 minutes',
            time: 'Yesterday'
        },
        {
            type: 'favorite-added',
            title: 'Added to Favorites',
            description: 'Added "Dragon Quest" to your favorites list',
            time: '2 days ago'
        },
        {
            type: 'game-played',
            title: 'Played Puzzle Master',
            description: 'Solved 15 difficult puzzles in one session',
            time: '3 days ago'
        }
    ];
    
    // Clear existing content
    activityList.innerHTML = '';
    
    // Add activities to the list
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <div class="activity-header">
                    <h3>${activity.title}</h3>
                    <span class="activity-time">${activity.time}</span>
                </div>
                <p>${activity.description}</p>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Helper function to get activity icon
function getActivityIcon(type) {
    const icons = {
        'game-played': 'gamepad',
        'achievement': 'trophy',
        'favorite-added': 'heart',
        'profile-update': 'user-edit'
    };
    return icons[type] || 'info-circle';
}

// Set up avatar change functionality
function setupAvatarChange() {
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (changeAvatarBtn && profileAvatar) {
        changeAvatarBtn.addEventListener('click', function() {
            // Show notification that this is demo mode
            showNotification('This feature requires login. Currently viewing in demo mode.');
        });
    }
    
    // Cover image change
    const changeCoverBtn = document.querySelector('.change-cover-btn');
    
    if (changeCoverBtn) {
        changeCoverBtn.addEventListener('click', function() {
            // Show notification that this is demo mode
            showNotification('This feature requires login. Currently viewing in demo mode.');
        });
    }
}

// Set up form submission - demo version
function setupFormSubmit() {
    const profileForm = document.getElementById('profileSettingsForm');
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show notification that this is demo mode
            showNotification('Settings cannot be saved in demo mode. Please login to save changes.');
        });
    }
    
    // Add event listener to edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Find and click the settings tab
            const settingsTab = document.querySelector('.tab-btn[data-tab="settings"]');
            if (settingsTab) {
                settingsTab.click();
            }
        });
    }
}

// Load achievements - demo data
function loadAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    
    if (!achievementsGrid) return;
    
    // Sample achievements data
    const achievements = [
        {
            id: 1,
            name: 'First Victory',
            description: 'Win your first game',
            icon: 'trophy',
            rarity: 'common',
            unlocked: true,
            date: '2024-03-15'
        },
        {
            id: 2,
            name: 'Sharpshooter',
            description: 'Achieve 95% accuracy in Space Shooter',
            icon: 'bullseye',
            rarity: 'rare',
            unlocked: true,
            date: '2024-03-18'
        },
        {
            id: 3,
            name: 'Master Strategist',
            description: 'Win 10 strategy games',
            icon: 'chess',
            rarity: 'rare',
            unlocked: true,
            date: '2024-04-01'
        },
        {
            id: 4,
            name: 'Explorer',
            description: 'Play games from 5 different categories',
            icon: 'compass',
            rarity: 'common',
            unlocked: true,
            date: '2024-03-22'
        },
        {
            id: 5,
            name: 'Dedicated Gamer',
            description: 'Play games for 50 hours',
            icon: 'clock',
            rarity: 'common',
            unlocked: true,
            date: '2024-03-29'
        },
        {
            id: 6,
            name: 'Puzzle Master',
            description: 'Solve 20 difficult puzzles',
            icon: 'puzzle-piece',
            rarity: 'common',
            unlocked: false
        },
        {
            id: 7,
            name: 'Speed Demon',
            description: 'Complete Space Shooter in under 20 minutes',
            icon: 'rocket',
            rarity: 'rare',
            unlocked: true,
            date: '2024-04-02'
        },
        {
            id: 8,
            name: 'Collector',
            description: 'Add 30 games to your favorites',
            icon: 'heart',
            rarity: 'common',
            unlocked: true,
            date: '2024-03-25'
        }
    ];
    
    // Clear existing content
    achievementsGrid.innerHTML = '';
    
    // Add achievements to grid
    achievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`;
        
        achievementEl.innerHTML = `
            <div class="achievement-icon">
                <i class="fas fa-${achievement.icon}"></i>
            </div>
            <div class="achievement-info">
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                ${achievement.unlocked ? `<span class="achievement-date">Unlocked: ${formatDate(achievement.date)}</span>` : '<span class="achievement-locked">Locked</span>'}
            </div>
            <div class="achievement-rarity ${achievement.rarity}">
                <span>${achievement.rarity}</span>
            </div>
        `;
        
        achievementsGrid.appendChild(achievementEl);
    });
    
    // Set up achievement category filters
    const categoryButtons = document.querySelectorAll('.achievement-categories .category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter achievements
            const achievementItems = document.querySelectorAll('.achievement-item');
            achievementItems.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'flex';
                } else if (category === 'locked' && !item.classList.contains('unlocked')) {
                    item.style.display = 'flex';
                } else if (category === 'rare' && item.classList.contains('rare')) {
                    item.style.display = 'flex';
                } else if (category === 'common' && item.classList.contains('common')) {
                    item.style.display = 'flex';
                } else if (category === 'recent' && item.classList.contains('unlocked')) {
                    // For demo purposes, all unlocked achievements are considered "recent"
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #3498db;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    transform: translateY(100px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 1000;
}

.notification.error {
    background-color: #e74c3c;
}

.notification.success {
    background-color: #2ecc71;
}

.notification.show {
    transform: translateY(0);
    opacity: 1;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-content i {
    font-size: 1.2rem;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    margin-left: 15px;
    cursor: pointer;
}

/* Achievement styles */
.achievement-item {
    display: flex;
    background-color: var(--bg-darker);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    gap: 15px;
    align-items: center;
}

.achievement-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3498db, #2980b9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.achievement-item.rare .achievement-icon {
    background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.achievement-item.locked .achievement-icon {
    background: linear-gradient(135deg, #7f8c8d, #95a5a6);
    opacity: 0.7;
}

.achievement-icon i {
    color: white;
    font-size: 1.5rem;
}

.achievement-info {
    flex: 1;
}

.achievement-info h3 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
    color: white;
}

.achievement-info p {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    color: var(--text-light);
    line-height: 1.4;
}

.achievement-date, .achievement-locked {
    font-size: 0.8rem;
    display: block;
}

.achievement-date {
    color: var(--accent-color);
}

.achievement-locked {
    color: #95a5a6;
}

.achievement-rarity {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    flex-shrink: 0;
}

.achievement-rarity.common {
    background-color: rgba(52, 152, 219, 0.2);
    color: #3498db;
}

.achievement-rarity.rare {
    background-color: rgba(155, 89, 182, 0.2);
    color: #9b59b6;
}

.achievement-item.locked {
    opacity: 0.7;
}
`;
document.head.appendChild(notificationStyles); 