// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    console.log('Rewards Center Loaded');
    const token = getAuthToken();
    updateNavigation(token);
    initializeRewards();
    setupMobileMenu();

    // Event listeners
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.mobile-nav').classList.toggle('active');
        });
    }

    // Setup video modal events
    setupVideoModal();
});

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Update navigation based on authentication status
function updateNavigation(token) {
    const authLinks = document.querySelector('.auth-links');
    const userLinks = document.querySelector('.user-links');
    const mobileAuthLinks = document.querySelector('.mobile-auth-links');
    
    if (token) {
        // User is logged in
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        if (mobileAuthLinks) mobileAuthLinks.style.display = 'none';
        
        // Set up logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        }
    } else {
        // User is not logged in
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
        if (mobileAuthLinks) mobileAuthLinks.style.display = 'flex';
    }
}

// Show notification to user
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    notification.className = `notification ${type}`;
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
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
        document.body.classList.add('touch-device');
        
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
    
    // Set up invite code copying
    setupInviteCode();
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

// Set up the invite code copying feature
function setupInviteCode() {
    const copyBtn = document.getElementById('copy-invite');
    const inviteCode = document.getElementById('invite-code');
    
    if (copyBtn && inviteCode) {
        copyBtn.addEventListener('click', () => {
            inviteCode.select();
            document.execCommand('copy');
            
            showNotification('Invite code copied to clipboard!', 'success');
        });
    }
}

// Set up video modal events
function setupVideoModal() {
    const watchVideoBtn = document.getElementById('watch-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.querySelector('.close-video');
    const collectRewardBtn = document.querySelector('.collect-reward');
    
    if (watchVideoBtn && videoModal) {
        watchVideoBtn.addEventListener('click', () => {
            videoModal.classList.add('open');
            
            // Simulate video playback progress
            simulateVideoPlayback(collectRewardBtn);
        });
    }
    
    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', () => {
            videoModal.classList.remove('open');
        });
    }
    
    if (collectRewardBtn) {
        collectRewardBtn.addEventListener('click', () => {
            // Add reward
            addRewardToBalance('coins', 50);
            
            // Update UI
            showNotification('You earned 50 coins!', 'success');
            loadUserRewardsBalance();
            
            // Close modal
            videoModal.classList.remove('open');
            
            // Reset button
            collectRewardBtn.disabled = true;
            collectRewardBtn.textContent = 'Continue watching to collect reward';
        });
    }
}

// Simulate video playback
function simulateVideoPlayback(collectRewardBtn) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        
        if (progress >= 100) {
            clearInterval(interval);
            
            if (collectRewardBtn) {
                collectRewardBtn.disabled = false;
                collectRewardBtn.textContent = 'Collect 50 Coins';
            }
        }
    }, 1000); // 10 seconds to complete
}

// Initialize the daily rewards UI
function updateDailyRewardsUI() {
    const data = getDailyRewardsData();
    
    // Update streak count
    const streakCount = document.getElementById('streak-count');
    if (streakCount) {
        streakCount.textContent = data.currentStreak;
    }
    
    // Update streak meter
    const streakMeter = document.querySelector('.streak-progress');
    if (streakMeter) {
        const percentage = Math.min((data.currentStreak / 7) * 100, 100);
        streakMeter.style.width = `${percentage}%`;
    }
    
    // Update day rewards status
    document.querySelectorAll('.day-reward').forEach(day => {
        const dayNumber = parseInt(day.getAttribute('data-day'));
        
        if (data.claimedDays.includes(dayNumber)) {
            day.classList.add('claimed');
        } else if (dayNumber === data.currentDay) {
            day.classList.add('active');
        } else {
            day.classList.remove('active');
            day.classList.remove('claimed');
        }
    });
    
    // Update claim button status
    const claimBtn = document.getElementById('claim-daily');
    const claimStatus = document.getElementById('daily-claim-status');
    
    if (claimBtn && claimStatus) {
        const today = new Date();
        let canClaim = true;
        
        if (data.lastClaimDate) {
            const lastClaim = new Date(data.lastClaimDate);
            const daysSinceLastClaim = Math.floor((today - lastClaim) / (1000 * 60 * 60 * 24));
            
            if (daysSinceLastClaim < 1) {
                canClaim = false;
                
                // Calculate time until next claim
                const nextResetTime = getNextResetTime();
                const timeLeft = calculateTimeLeft(nextResetTime);
                
                claimStatus.textContent = `Next reward available in ${timeLeft}`;
                claimBtn.disabled = true;
            }
        }
        
        if (canClaim) {
            claimStatus.textContent = 'Claim your daily reward now!';
            claimBtn.disabled = false;
        }
    }
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

// Handle daily reward claim
function handleDailyRewardClaim() {
    if (!isAuthenticated()) {
        showNotification('Please log in to claim rewards', 'info');
        return;
    }
    
    // Get current data
    let data = getDailyRewardsData();
    
    // Check if already claimed today
    const today = new Date();
    let canClaim = true;
    
    if (data.lastClaimDate) {
        const lastClaim = new Date(data.lastClaimDate);
        const daysSinceLastClaim = Math.floor((today - lastClaim) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastClaim < 1) {
            canClaim = false;
            showNotification('You already claimed your reward today!', 'info');
        }
    }
    
    if (!canClaim) {
        return;
    }
    
    // Increment streak
    data.currentStreak++;
    
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
    updateDailyRewardsUI();
    
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
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}

// Initialize spin wheel UI and data
function updateSpinWheelUI() {
    const spinData = getSpinData();
    
    // Update spins display
    const spinsLeft = document.getElementById('spins-left');
    if (spinsLeft) {
        spinsLeft.textContent = spinData.spinsRemaining;
    }
    
    // Update next spin time
    const nextSpinTime = document.getElementById('next-spin-time');
    if (nextSpinTime && spinData.nextSpinTime) {
        const timeLeft = calculateTimeLeft(spinData.nextSpinTime);
        nextSpinTime.textContent = timeLeft;
    }
    
    // Update spin button state
    const spinBtn = document.getElementById('spin-wheel-btn');
    if (spinBtn) {
        if (spinData.spinsRemaining <= 0) {
            spinBtn.disabled = true;
            spinBtn.innerHTML = `
                <i class="fas fa-lock"></i>
                <span>No Spins Left</span>
            `;
        } else {
            spinBtn.disabled = false;
            spinBtn.innerHTML = `
                <i class="fas fa-sync-alt"></i>
                <span>Spin Now</span>
                <div class="btn-glow"></div>
            `;
        }
    }
}

// Get spin data
function getSpinData() {
    // Try to get data from local storage
    let data = localStorage.getItem('spinData');
    
    if (data) {
        return JSON.parse(data);
    } else {
        // Initialize with default values
        const now = new Date();
        const nextSpinTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        nextSpinTime.setHours(0, 0, 0, 0);
        
        const defaultData = {
            spinsRemaining: 3,
            nextSpinTime: nextSpinTime.toISOString(),
            lastSpinDate: null
        };
        
        // Save to local storage
        localStorage.setItem('spinData', JSON.stringify(defaultData));
        return defaultData;
    }
}

// Start spin wheel countdown
function startSpinCountdown() {
    const updateCountdown = () => {
        const spinData = getSpinData();
        
        if (spinData.nextSpinTime) {
            const nextSpinTime = new Date(spinData.nextSpinTime);
            const now = new Date();
            
            // If we've passed the next spin time, add a new spin
            if (now >= nextSpinTime && spinData.spinsRemaining < 3) {
                // Add a spin
                spinData.spinsRemaining++;
                
                // Set next spin time to 24 hours from now
                const nextTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                spinData.nextSpinTime = nextTime.toISOString();
                
                // Save data
                localStorage.setItem('spinData', JSON.stringify(spinData));
                
                // Update UI
                updateSpinWheelUI();
                
                // Show notification
                showNotification('You received a new free spin!', 'success');
                
                // Add animation to wheel and button
                const spinWheel = document.querySelector('.spin-wheel');
                const spinBtn = document.getElementById('spin-wheel-btn');
                
                if (spinWheel && spinBtn) {
                    spinWheel.classList.add('spin-added');
                    spinBtn.classList.add('spin-added');
                    
                    setTimeout(() => {
                        spinWheel.classList.remove('spin-added');
                        spinBtn.classList.remove('spin-added');
                    }, 2000);
                }
            } else {
                // Update time display
                const nextSpinTime = document.getElementById('next-spin-time');
                if (nextSpinTime) {
                    const timeLeft = calculateTimeLeft(spinData.nextSpinTime);
                    nextSpinTime.textContent = timeLeft;
                }
            }
        }
    };
    
    // Update immediately
    updateCountdown();
    
    // Update every minute
    setInterval(updateCountdown, 60000);
}

// Calculate time left from ISO string
function calculateTimeLeft(nextTimeString) {
    const now = new Date();
    const nextTime = new Date(nextTimeString);
    
    let diff = nextTime - now;
    
    // If past the time, return "Now"
    if (diff <= 0) {
        return "Now";
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    
    const secs = Math.floor(diff / 1000);
    
    // Format the time
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Handle spin wheel
function handleSpinWheel() {
    if (!isAuthenticated()) {
        showNotification('Please log in to spin the wheel', 'info');
        return;
    }
    
    // Get spin data
    const spinData = getSpinData();
    
    // Check if spins remaining
    if (spinData.spinsRemaining <= 0) {
        showNotification('No spins remaining', 'info');
        return;
    }
    
    // Subtract a spin
    spinData.spinsRemaining--;
    
    // Update last spin date
    spinData.lastSpinDate = new Date().toISOString();
    
    // Save updated data
    localStorage.setItem('spinData', JSON.stringify(spinData));
    
    // Update UI
    updateSpinWheelUI();
    
    // Get wheel element
    const spinWheel = document.querySelector('.spin-wheel');
    const spinResult = document.getElementById('spin-result');
    
    if (!spinWheel || !spinResult) {
        return;
    }
    
    // Disable spin button during spin
    const spinBtn = document.getElementById('spin-wheel-btn');
    if (spinBtn) {
        spinBtn.disabled = true;
    }
    
    // Clear previous result
    spinResult.textContent = "";
    
    // Determine prize
    const prizes = [
        { type: 'coins', amount: 50 },
        { type: 'coins', amount: 100 },
        { type: 'coins', amount: 150 },
        { type: 'coins', amount: 200 },
        { type: 'gems', amount: 1 },
        { type: 'coins', amount: 500 }
    ];
    
    // Select random prize
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[prizeIndex];
    
    // Calculate rotation based on prize index (each segment is 60 degrees)
    // Add extra rotations for effect, and offset to land at center of segment
    const baseRotation = prizeIndex * 60;
    const randomOffset = Math.floor(Math.random() * 30) - 15; // Random offset between -15 and 15 degrees
    const extraRotations = 360 * 5; // 5 full rotations for effect
    const finalRotation = extraRotations + baseRotation + randomOffset;
    
    // Set animation variable and add spinning class
    spinWheel.style.setProperty('--rotate-deg', `${finalRotation}deg`);
    spinWheel.classList.add('spinning');
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
    
    // Wait for animation to finish
    setTimeout(() => {
        // Animation completed
        spinWheel.classList.remove('spinning');
        
        // Display result
        spinResult.textContent = `You won ${prize.amount} ${prize.type}!`;
        
        // Add reward to balance
        addRewardToBalance(prize.type, prize.amount);
        
        // Show reward animation
        showRewardAnimation(prize.type, prize.amount);
        
        // Update user balance display
        loadUserRewardsBalance();
        
        // Re-enable spin button if spins remaining
        if (spinBtn) {
            spinBtn.disabled = false;
        }
    }, 4000); // Match this time with the CSS animation duration
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

// Update rewards badge in navbar
function updateRewardsBadge() {
    const rewardsIcon = document.querySelector('.rewards-icon');
    const rewardsBadge = document.querySelector('.rewards-badge');
    
    if (!rewardsIcon || !rewardsBadge) return;
    
    // Check for claimable rewards
    const dailyRewardsData = getDailyRewardsData();
    const spinData = getSpinData();
    
    const today = new Date();
    let hasClaimableRewards = false;
    
    // Check daily rewards
    if (dailyRewardsData.lastClaimDate) {
        const lastClaim = new Date(dailyRewardsData.lastClaimDate);
        const daysSinceLastClaim = Math.floor((today - lastClaim) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastClaim >= 1) {
            hasClaimableRewards = true;
        }
    } else {
        // First time user, can claim
        hasClaimableRewards = true;
    }
    
    // Check spin rewards
    if (spinData.spinsRemaining > 0) {
        hasClaimableRewards = true;
    }
    
    // Update badge and animation
    if (hasClaimableRewards) {
        rewardsBadge.style.display = 'flex';
        rewardsIcon.classList.add('has-rewards');
    } else {
        rewardsBadge.style.display = 'none';
        rewardsIcon.classList.remove('has-rewards');
    }
}

// Setup mobile menu
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