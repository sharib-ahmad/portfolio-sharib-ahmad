document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.getElementById('add-link');
    const container = document.getElementById('link-container');
    const form = document.getElementById('projectForm');
    const submitBtn = document.getElementById('submitBtn');

    let linkIndex = 1;

    // Create floating particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 7000);
    }

    // Create particles periodically
    setInterval(createParticle, 3000);

    // Add link functionality with enhanced animation
    addBtn.addEventListener('click', function () {
        const row = document.createElement('div');
        row.className = 'link-row row';
        row.style.transform = 'translateX(-100px) scale(0.8)';
        row.style.opacity = '0';

        row.innerHTML = `
                    <div class="col">
                        <label class="form-label" for="links-${linkIndex}-name">Link Name</label>
                        <input class="form-control" type="text" name="links-${linkIndex}-name" id="links-${linkIndex}-name" value="" placeholder="e.g., GitHub">
                    </div>
                    <div class="col">
                        <label class="form-label" for="links-${linkIndex}-url">Link URL</label>
                        <input class="form-control" type="url" name="links-${linkIndex}-url" id="links-${linkIndex}-url" value="" placeholder="https://github.com/...">
                    </div>
                    <div class="col-auto d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm remove-link">🗑️</button>
                    </div>
                `;

        container.appendChild(row);
        linkIndex++;

        // Enhanced entrance animation
        setTimeout(() => {
            row.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            row.style.transform = 'translateX(0) scale(1)';
            row.style.opacity = '1';
        }, 10);
    });

    // Enhanced remove functionality
    container.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-link')) {
            if (container.children.length > 1) {
                const row = e.target.closest('.link-row');
                row.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                row.style.transform = 'translateX(100px) scale(0.8)';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                }, 400);
            } else {
                // Enhanced error feedback
                const alert = document.createElement('div');
                alert.className = 'alert alert-danger alert-dismissible fade show mt-3';
                alert.innerHTML = `
                            ⚠️ You must have at least one link field.
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        `;
                e.target.closest('.links-section').appendChild(alert);

                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.style.transition = 'all 0.3s ease-out';
                        alert.style.opacity = '0';
                        alert.style.transform = 'translateY(-20px)';
                        setTimeout(() => alert.remove(), 300);
                    }
                }, 3000);
            }
        }
    });

    // Enhanced form submission
    form.addEventListener('submit', function (e) {
        submitBtn.classList.add('btn-loading');
        submitBtn.textContent = 'Creating Magic...';

        // Add subtle shake animation to form
        const formContainer = document.querySelector('.form-container');
        formContainer.style.animation = 'none';
        setTimeout(() => {
            formContainer.style.animation = 'pulse 2s ease-in-out infinite';
        }, 10);
    });

    // Enhanced input focus effects
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            const parent = this.closest('.form-section, .link-row');
            parent.style.transform = 'scale(1.02)';
            parent.style.zIndex = '10';
        });

        input.addEventListener('blur', function () {
            const parent = this.closest('.form-section, .link-row');
            parent.style.transform = 'scale(1)';
            parent.style.zIndex = '1';
        });
    });

    // Smooth scroll behavior
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        const formContainer = document.querySelector('.form-container');
        formContainer.style.transform = `translateY(${rate}px)`;
    });

    // Add pulse animation keyframes
    const style = document.createElement('style');
    style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
            `;
    document.head.appendChild(style);
});