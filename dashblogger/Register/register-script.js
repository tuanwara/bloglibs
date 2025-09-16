// ===== REAL FIREBASE REGISTER SCRIPT =====
// 100% REAL REGISTRATION - NO DEMO DATA

// Global Template Hiding
function hideTemplateElements() {
    const hideSelectors = [
        'header.s', '#table-of-content', '.post-body #table-of-content',
        '.post-body .table-of-content', '#daftar-isi', '.toc', '.post-toc-wrapper',
        '.toc-container', '.table-of-contents', '.post-toc', '.entry-toc',
        '.content-toc', 'div[id*="toc"]', 'div[class*="toc"]', 'div[id*="daftar"]',
        '.igniplex-toc', '.auto-toc', '.post-top', '.post-top .entry-title',
        '.entry-title', 'h1.entry-title', '.post-title.entry-title'
    ];
    
    hideSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.height = '0';
            el.style.overflow = 'hidden';
        });
    });
}

// Run periodically to ensure template elements stay hidden
document.addEventListener('DOMContentLoaded', hideTemplateElements);
setInterval(hideTemplateElements, 5000);

// ===== GLOBAL VARIABLES =====
let isLoading = false;
let passwordStrength = 0;

// ===== UTILITY FUNCTIONS =====
function showAlert(message, type = 'error') {
    const alert = document.getElementById('registerAlert');
    if (!alert) return;
    
    alert.textContent = message;
    alert.className = `alert ${type}`;
    alert.style.display = 'block';
    
    // Auto hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }
}

function hideAlert() {
    const alert = document.getElementById('registerAlert');
    if (alert) {
        alert.style.display = 'none';
    }
}

function setLoading(loading, buttonId = 'registerButton') {
    isLoading = loading;
    const button = document.getElementById(buttonId);
    const text = document.getElementById(buttonId + 'Text');
    const spinner = document.getElementById(buttonId + 'Spinner');
    
    if (button) {
        button.disabled = loading;
        
        if (text && spinner) {
            if (loading) {
                text.style.display = 'none';
                spinner.style.display = 'block';
            } else {
                text.style.display = 'block';
                spinner.style.display = 'none';
            }
        }
    }
}

// ===== VALIDATION FUNCTIONS =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password && password.length >= 8;
}

function validateName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (!password) return { strength: 0, feedback: ['Enter a password'] };
    
    // Length check
    if (password.length >= 8) {
        strength += 25;
    } else {
        feedback.push('At least 8 characters');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('One uppercase letter');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('One lowercase letter');
    }
    
    // Number or special character check
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('One number or special character');
    }
    
    // Bonus for very strong passwords
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && 
        /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        strength = 100;
        feedback = ['Excellent password!'];
    }
    
    return { strength, feedback };
}

function updatePasswordStrength(password) {
    const { strength, feedback } = calculatePasswordStrength(password);
    const strengthText = document.getElementById('strengthText');
    const strengthFill = document.getElementById('strengthFill');
    
    passwordStrength = strength;
    
    if (strengthText && strengthFill) {
        strengthFill.style.width = `${strength}%`;
        strengthFill.className = 'strength-fill';
        
        if (strength === 0) {
            strengthText.textContent = '';
            strengthFill.classList.add('strength-weak');
        } else if (strength < 50) {
            strengthText.textContent = `Weak password. Need: ${feedback.join(', ')}`;
            strengthText.style.color = 'var(--danger)';
            strengthFill.classList.add('strength-weak');
        } else if (strength < 75) {
            strengthText.textContent = `Fair password. Could add: ${feedback.join(', ')}`;
            strengthText.style.color = 'var(--warning)';
            strengthFill.classList.add('strength-fair');
        } else if (strength < 100) {
            strengthText.textContent = 'Good password';
            strengthText.style.color = 'var(--info)';
            strengthFill.classList.add('strength-good');
        } else {
            strengthText.textContent = 'Strong password!';
            strengthText.style.color = 'var(--success)';
            strengthFill.classList.add('strength-strong');
        }
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    const successDiv = document.getElementById(fieldId + 'Success');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
        field.classList.add('shake');
        
        setTimeout(() => {
            field.classList.remove('shake');
        }, 500);
    }
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    
    if (successDiv) {
        successDiv.style.display = 'none';
    }
}

function showFieldSuccess(fieldId, message = '') {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    const successDiv = document.getElementById(fieldId + 'Success');
    
    if (field) {
        field.classList.add('success');
        field.classList.remove('error');
    }
    
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    if (successDiv && message) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    const successDiv = document.getElementById(fieldId + 'Success');
    
    if (field) {
        field.classList.remove('error', 'success');
    }
    
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
    
    if (successDiv) {
        successDiv.style.display = 'none';
        successDiv.textContent = '';
    }
}

function clearAllErrors() {
    ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'terms'].forEach(clearFieldError);
    hideAlert();
}

// ===== FIREBASE REGISTRATION FUNCTIONS =====
async function registerWithEmail(userData) {
    try {
        console.log('🔄 Creating Firebase account for:', userData.email);
        
        // Create user with email and password
        const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(
            userData.email, 
            userData.password
        );
        
        const user = userCredential.user;
        console.log('✅ Firebase account created:', user.uid);
        
        // Update user profile with display name
        await user.updateProfile({
            displayName: `${userData.firstName} ${userData.lastName}`
        });
        
        console.log('✅ User profile updated');
        
        // Send email verification
        await user.sendEmailVerification();
        console.log('✅ Verification email sent');
        
        // Create user record in database
        const userRecord = {
            uid: user.uid,
            email: user.email,
            displayName: `${userData.firstName} ${userData.lastName}`,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'user',
            isPremium: false,
            emailVerified: false,
            marketingEmails: userData.marketingEmails,
            createdAt: Date.now(),
            lastLogin: null,
            registrationMethod: 'email',
            profileComplete: true,
            status: 'active'
        };
        
        // Save to Firebase Realtime Database
        await window.firebaseDB.ref(`users/${user.uid}`).set(userRecord);
        console.log('✅ User record created in database');
        
        // Log registration event
        await window.firebaseDB.ref('analytics/registrations').push({
            uid: user.uid,
            method: 'email',
            timestamp: Date.now(),
            userAgent: navigator.userAgent.substring(0, 200)
        });
        
        return { success: true, user, needsVerification: true };
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        
        let errorMessage = 'Registration failed. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered. Please use a different email or try logging in.';
                showFieldError('email', 'Email already in use');
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                showFieldError('email', 'Invalid email format');
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email registration is not enabled. Please contact support.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please choose a stronger password.';
                showFieldError('password', 'Password too weak');
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection and try again.';
                break;
            default:
                errorMessage = error.message || errorMessage;
        }
        
        return { success: false, error: errorMessage };
    }
}

async function registerWithGoogle(marketingEmails = false) {
    try {
        console.log('🔄 Starting Google registration...');
        
        // Sign up with Google popup
        const result = await window.firebaseAuth.signInWithPopup(window.googleProvider);
        const user = result.user;
        
        console.log('✅ Google registration successful:', user.uid);
        
        // Check if user already exists
        const existingUserSnapshot = await window.firebaseDB.ref(`users/${user.uid}`).once('value');
        
        if (existingUserSnapshot.exists()) {
            console.log('👤 User already exists, updating login info');
            
            // Update last login
            await window.firebaseDB.ref(`users/${user.uid}`).update({
                lastLogin: Date.now(),
                loginMethod: 'google'
            });
            
            return { success: true, user, isExistingUser: true };
        }
        
        // Split display name
        const nameParts = (user.displayName || '').split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Create new user record
        const userRecord = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || firstName,
            firstName,
            lastName,
            photoURL: user.photoURL,
            role: 'user',
            isPremium: false,
            emailVerified: user.emailVerified,
            marketingEmails,
            createdAt: Date.now(),
            lastLogin: Date.now(),
            registrationMethod: 'google',
            provider: 'google.com',
            profileComplete: true,
            status: 'active'
        };
        
        // Save to database
        await window.firebaseDB.ref(`users/${user.uid}`).set(userRecord);
        console.log('✅ Google user record created in database');
        
        // Log registration event
        await window.firebaseDB.ref('analytics/registrations').push({
            uid: user.uid,
            method: 'google',
            timestamp: Date.now(),
            userAgent: navigator.userAgent.substring(0, 200)
        });
        
        return { success: true, user, isNewUser: true };
        
    } catch (error) {
        console.error('❌ Google registration error:', error);
        
        let errorMessage = 'Google registration failed. Please try again.';
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Registration cancelled. Please try again.';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Popup blocked. Please allow popups for this site and try again.';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Registration cancelled. Please try again.';
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = 'An account with this email already exists using a different sign-in method. Please try logging in instead.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection and try again.';
                break;
            default:
                errorMessage = error.message || errorMessage;
        }
        
        return { success: false, error: errorMessage };
    }
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    const fields = {
        firstName: {
            validate: (value) => validateName(value),
            successMessage: 'Looks good!'
        },
        lastName: {
            validate: (value) => validateName(value),
            successMessage: 'Looks good!'
        },
        email: {
            validate: (value) => validateEmail(value),
            successMessage: 'Valid email address'
        },
        password: {
            validate: (value) => validatePassword(value),
            successMessage: 'Password meets requirements'
        },
        confirmPassword: {
            validate: (value, formData) => value === formData.password && validatePassword(value),
            successMessage: 'Passwords match'
        }
    };
    
    Object.keys(fields).forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const field = fields[fieldId];
        
        if (input) {
            // Real-time validation on input
            input.addEventListener('input', () => {
                const value = input.value.trim();
                clearFieldError(fieldId);
                
                if (value) {
                    const formData = getFormData();
                    
                    if (field.validate(value, formData)) {
                        showFieldSuccess(fieldId, field.successMessage);
                    } else {
                        let errorMessage = '';
                        
                        switch (fieldId) {
                            case 'firstName':
                            case 'lastName':
                                errorMessage = 'Must be 2-50 characters long';
                                break;
                            case 'email':
                                errorMessage = 'Please enter a valid email address';
                                break;
                            case 'password':
                                errorMessage = 'Password must be at least 8 characters long';
                                break;
                            case 'confirmPassword':
                                errorMessage = 'Passwords do not match';
                                break;
                        }
                        
                        showFieldError(fieldId, errorMessage);
                    }
                }
            });
            
            // Validation on blur
            input.addEventListener('blur', () => {
                const value = input.value.trim();
                
                if (value) {
                    const formData = getFormData();
                    
                    if (!field.validate(value, formData)) {
                        input.classList.add('shake');
                        setTimeout(() => input.classList.remove('shake'), 500);
                    }
                }
            });
        }
    });
    
    // Special handling for password strength
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updatePasswordStrength(passwordInput.value);
        });
    }
    
    // Real-time password confirmation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            clearFieldError('confirmPassword');
            
            if (confirmPassword) {
                if (password === confirmPassword) {
                    showFieldSuccess('confirmPassword', 'Passwords match');
                } else {
                    showFieldError('confirmPassword', 'Passwords do not match');
                }
            }
        });
    }
}

function getFormData() {
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        agreeTerms: document.getElementById('agreeTerms').checked,
        marketingEmails: document.getElementById('marketingEmails').checked
    };
}

function validateForm(formData) {
    let hasErrors = false;
    
    // First name validation
    if (!formData.firstName) {
        showFieldError('firstName', 'First name is required');
        hasErrors = true;
    } else if (!validateName(formData.firstName)) {
        showFieldError('firstName', 'Must be 2-50 characters long');
        hasErrors = true;
    }
    
    // Last name validation
    if (!formData.lastName) {
        showFieldError('lastName', 'Last name is required');
        hasErrors = true;
    } else if (!validateName(formData.lastName)) {
        showFieldError('lastName', 'Must be 2-50 characters long');
        hasErrors = true;
    }
    
    // Email validation
    if (!formData.email) {
        showFieldError('email', 'Email is required');
        hasErrors = true;
    } else if (!validateEmail(formData.email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    // Password validation
    if (!formData.password) {
        showFieldError('password', 'Password is required');
        hasErrors = true;
    } else if (!validatePassword(formData.password)) {
        showFieldError('password', 'Password must be at least 8 characters long');
        hasErrors = true;
    } else if (passwordStrength < 50) {
        showFieldError('password', 'Password is too weak. Please choose a stronger password');
        hasErrors = true;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        hasErrors = true;
    } else if (formData.password !== formData.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        hasErrors = true;
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
        showFieldError('terms', 'You must agree to the Terms of Service and Privacy Policy');
        document.getElementById('termsError').style.display = 'block';
        hasErrors = true;
    }
    
    return !hasErrors;
}

// ===== AUTHENTICATION STATE LISTENER =====
window.firebaseAuth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log('👤 User already authenticated:', user.uid);
        
        try {
            // Check user data
            const userRef = window.firebaseDB.ref(`users/${user.uid}`);
            const userSnapshot = await userRef.once('value');
            const userData = userSnapshot.val();
            
            if (userData) {
                // User is authenticated and has data, redirect to dashboard
                if (userData.role === 'admin' || userData.isAdmin) {
                    window.location.href = '/p/admin-dashboard.html';
                } else {
                    window.location.href = '/p/dashboard.html';
                }
            }
        } catch (error) {
            console.error('❌ Auth state check error:', error);
        }
    }
});

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Register page initialized');
    
    // Setup form validation
    setupFormValidation();
    
    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (isLoading) return;
            
            clearAllErrors();
            
            const formData = getFormData();
            
            // Validate form
            if (!validateForm(formData)) {
                showAlert('Please correct the errors below.', 'error');
                return;
            }
            
            // Attempt registration
            setLoading(true, 'register');
            
            try {
                const result = await registerWithEmail(formData);
                
                if (result.success) {
                    if (result.needsVerification) {
                        showAlert(
                            'Account created successfully! Please check your email and click the verification link before signing in.',
                            'success'
                        );
                        
                        // Clear form
                        registerForm.reset();
                        updatePasswordStrength('');
                        clearAllErrors();
                        
                        // Redirect to login after delay
                        setTimeout(() => {
                            window.location.href = '/p/login.html?verified=pending';
                        }, 3000);
                    }
                } else {
                    showAlert(result.error, 'error');
                }
                
                setLoading(false, 'register');
                
            } catch (error) {
                console.error('❌ Registration submission error:', error);
                showAlert('An unexpected error occurred. Please try again.', 'error');
                setLoading(false, 'register');
            }
        });
    }
    
    // Google registration button
    const googleRegisterButton = document.getElementById('googleRegisterButton');
    if (googleRegisterButton) {
        googleRegisterButton.addEventListener('click', async () => {
            if (isLoading) return;
            
            clearAllErrors();
            setLoading(true, 'googleRegister');
            
            try {
                const marketingEmails = document.getElementById('marketingEmails')?.checked || false;
                const result = await registerWithGoogle(marketingEmails);
                
                if (result.success) {
                    if (result.isExistingUser) {
                        showAlert('Welcome back! Redirecting to your dashboard...', 'success');
                    } else {
                        showAlert('Account created successfully! Redirecting to your dashboard...', 'success');
                    }
                    
                    // Redirect based on user role
                    setTimeout(() => {
                        // Google users are usually regular users unless manually promoted
                        window.location.href = '/p/dashboard.html';
                    }, 1500);
                } else {
                    showAlert(result.error, 'error');
                    setLoading(false, 'googleRegister');
                }
                
            } catch (error) {
                console.error('❌ Google registration error:', error);
                showAlert('Google registration failed. Please try again.', 'error');
                setLoading(false, 'googleRegister');
            }
        });
    }
    
    // Password toggle buttons
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordToggle && passwordInput && eyeIcon) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            
            passwordInput.type = isPassword ? 'text' : 'password';
            
            eyeIcon.innerHTML = isPassword ? 
                '<path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>' :
                '<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>';
        });
    }
    
    // Confirm password toggle
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const eyeIcon2 = document.getElementById('eyeIcon2');
    
    if (confirmPasswordToggle && confirmPasswordInput && eyeIcon2) {
        confirmPasswordToggle.addEventListener('click', () => {
            const isPassword = confirmPasswordInput.type === 'password';
            
            confirmPasswordInput.type = isPassword ? 'text' : 'password';
            
            eyeIcon2.innerHTML = isPassword ? 
                '<path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>' :
                '<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>';
        });
    }
    
    // Login button (redirect to login page)
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = '/p/login.html';
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (themeToggle && themeIcon) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeIcon.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeIcon.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
    
    // Terms checkbox validation
    const termsCheckbox = document.getElementById('agreeTerms');
    const termsError = document.getElementById('termsError');
    
    if (termsCheckbox && termsError) {
        termsCheckbox.addEventListener('change', () => {
            if (termsCheckbox.checked) {
                termsError.style.display = 'none';
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const registerButton = document.getElementById('registerButton');
            if (registerButton && !registerButton.disabled) {
                registerButton.click();
            }
        }
        
        // Escape to clear alerts
        if (e.key === 'Escape') {
            hideAlert();
        }
    });
    
    // Auto-focus first name field
    const firstNameInput = document.getElementById('firstName');
    if (firstNameInput) {
        firstNameInput.focus();
    }
    
    // Prevent form submission on Enter key in input fields (except submit button)
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                
                // Move to next field or submit
                const form = input.closest('form');
                const inputs = Array.from(form.querySelectorAll('.form-input, .checkbox'));
                const currentIndex = inputs.indexOf(input);
                
                if (currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus();
                } else {
                    // Last field, submit form
                    const submitButton = form.querySelector('button[type="submit"]');
                    if (submitButton && !submitButton.disabled) {
                        submitButton.click();
                    }
                }
            }
        });
    });
    
    console.log('✅ Register page event listeners setup complete');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('💥 Global error:', e.error);
    showAlert('An unexpected error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('💥 Unhandled promise rejection:', e.reason);
    showAlert('A background process failed. Please try again.', 'error');
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = Math.round(performance.now());
        console.log(`⚡ Register page loaded in ${loadTime}ms`);
    });
}

console.log('✅ Real Firebase Register Script loaded successfully!');
console.log('🎯 Version: 2.0.0 | Production Ready | No Demo Data');
console.log('🔥 100% Firebase Registration | Real User Creation System');
