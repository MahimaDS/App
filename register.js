// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const showLoginLink = document.getElementById('showLogin');
const passwordStrengthBar = document.querySelector('.password-strength-bar');
const passwordRequirements = {
    length: document.getElementById('length'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    number: document.getElementById('number'),
    special: document.getElementById('special')
};

// Password strength validation
function validatePasswordStrength(password) {
    const requirements = {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Update UI
    Object.keys(requirements).forEach(req => {
        passwordRequirements[req].classList.toggle('valid', requirements[req]);
    });

    // Calculate strength
    const strength = Object.values(requirements).filter(Boolean).length;
    const strengthPercentage = (strength / 5) * 100;

    // Update strength bar
    passwordStrengthBar.style.width = `${strengthPercentage}%`;
    passwordStrengthBar.parentElement.className = 'password-strength ' + 
        (strengthPercentage <= 33 ? 'weak' : strengthPercentage <= 66 ? 'medium' : 'strong');

    return Object.values(requirements).every(Boolean);
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

// Real-time password validation
passwordInput.addEventListener('input', function() {
    validatePasswordStrength(this.value);
});

// Email verification
async function sendVerificationEmail(email) {
    try {
        const response = await fetch(`${API_URL}/auth/send-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Failed to send verification email');
        }

        showSuccess('Verification email sent! Please check your inbox.');
    } catch (error) {
        showError('Failed to send verification email. Please try again.');
    }
}

// Social login handlers
document.querySelector('.social-button.google').addEventListener('click', () => {
    window.location.href = `${API_URL}/auth/google`;
});

document.querySelector('.social-button.facebook').addEventListener('click', () => {
    window.location.href = `${API_URL}/auth/facebook`;
});

document.querySelector('.social-button.twitter').addEventListener('click', () => {
    window.location.href = `${API_URL}/auth/twitter`;
});

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    registerForm.insertBefore(errorDiv, registerForm.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Remove any existing success messages
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    registerForm.insertBefore(successDiv, registerForm.firstChild);
}

// Validate password match
function validatePassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return false;
    }
    return true;
}

// Handle registration form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Basic validation
    if (!username || !email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!validatePassword()) {
        return;
    }
    
    if (!validatePasswordStrength(password)) {
        showError('Password does not meet requirements');
        return;
    }
    
    if (!termsCheckbox.checked) {
        showError('Please agree to the Terms of Service and Privacy Policy');
        return;
    }
    
    // Show loading state
    const submitButton = registerForm.querySelector('button[type="submit"]');
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    try {
        // Make API request
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Send verification email
        await sendVerificationEmail(email);
        
        // Show success message
        showSuccess('Registration successful! Please check your email to verify your account.');
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        
    } catch (error) {
        showError(error.message);
    } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
});

// Real-time password validation
confirmPasswordInput.addEventListener('input', validatePassword);

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
}); 