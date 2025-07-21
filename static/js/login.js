// Form submission with loading animation
document.getElementById('loginForm').addEventListener('submit', function (e) {
    const btn = document.querySelector('.btn-login');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
        e.preventDefault();
        alert('Please fill in all fields');
        return;
    }

    // Add loading animation but DON'T prevent form submission
    btn.classList.add('loading');
    btn.innerHTML = 'Signing In...';
    btn.disabled = true;

    // Let the form submit normally to Flask backend
    // The form will submit after this function completes
    console.log('Form submitting to Flask backend...');
});

// Forgot password animation
document.getElementById('forgotPassword').addEventListener('click', function (e) {
    e.preventDefault();

    // Add shake animation to the card
    const card = document.querySelector('.login-card');
    card.style.animation = 'shake 0.5s ease-in-out';

    setTimeout(() => {
        card.style.animation = '';
    }, 500);

    // Show alert
    setTimeout(() => {
        alert('Password reset link would be sent to your email!');
    }, 200);
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Input focus animations
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Add floating particles animation
function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: 100%;
        pointer-events: none;
        animation: floatUp ${Math.random() * 3 + 2}s linear infinite;
    `;

    document.querySelector('.bg-animation').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Add CSS for floating particles
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatStyle);

// Create particles periodically
setInterval(createFloatingParticle, 300);