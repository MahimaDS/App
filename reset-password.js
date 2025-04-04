// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const resetPasswordForm = document.getElementById('resetPasswordForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordStrengthBar = document.querySelector('.password-strength-bar');
const passwordRequirements = {
    length: document.getElementById('length'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    number: document.getElementById('number'),
    special: document.getElementById('special')
};

// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

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
    
    resetPasswordForm.insertBefore(errorDiv, resetPasswordForm.firstChild);
    
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
    
    resetPasswordForm.insertBefore(successDiv, resetPasswordForm.firstChild);
}

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

// Handle form submission
resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check if token exists
    if (!token) {
        showError('Invalid or expired reset link');
        return;
    }
    
    // Get form data
    const password = passwordInput.value;
    
    // Basic validation
    if (!password) {
        showError('Please enter a new password');
        return;
    }
    
    if (!validatePassword()) {
        return;
    }
    
    if (!validatePasswordStrength(password)) {
        showError('Password does not meet requirements');
        return;
    }
    
    // Show loading state
    const submitButton = resetPasswordForm.querySelector('button[type="submit"]');
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    try {
        // Make API request
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to reset password');
        }
        
        // Show success message
        showSuccess('Password reset successful! Redirecting to login...');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        
    } catch (error) {
        showError(error.message);
    } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
}); 