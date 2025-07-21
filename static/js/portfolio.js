window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.style.cursor = 'none';
        }, 800);
    }, 2000);
});

// Custom Cursor
const cursor = document.getElementById('cursor');
const trails = [];
const trailCount = 10;

// Create cursor trails
for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trails.push({
        element: trail,
        x: 0,
        y: 0
    });
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX - 10 + 'px';
    cursor.style.top = mouseY - 10 + 'px';
});

// Animate cursor trails
function animateTrails() {
    for (let i = 0; i < trails.length; i++) {
        const trail = trails[i];
        const factor = (i + 1) * 0.1;

        trail.x += (mouseX - trail.x) * factor;
        trail.y += (mouseY - trail.y) * factor;

        trail.element.style.left = trail.x - 2 + 'px';
        trail.element.style.top = trail.y - 2 + 'px';
        trail.element.style.opacity = (1 - i * 0.1);
    }
    requestAnimationFrame(animateTrails);
}
animateTrails();

// Hover effects for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-orb, .social-link');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.background = 'radial-gradient(circle, var(--neon-blue), var(--neon-purple))';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'radial-gradient(circle, var(--neon-pink), var(--neon-blue))';
    });
});

// Floating Particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}
createParticles();

// Smooth Scrolling
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-in').forEach(el => {
    observer.observe(el);
});

// Dynamic skill orb interactions
document.querySelectorAll('.skill-orb').forEach(orb => {
    orb.addEventListener('click', () => {
        orb.style.animation = 'none';
        setTimeout(() => {
            orb.style.animation = 'float-shape 2s ease-in-out';
        }, 10);
    });
});

// Project card 3D tilt effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Mobile cursor fallback
if ('ontouchstart' in window) {
    document.body.style.cursor = 'auto';
    cursor.style.display = 'none';
    trails.forEach(trail => trail.element.style.display = 'none');
}

document.addEventListener("DOMContentLoaded", () => {
  const skillsContainer = document.getElementById("skills-container");
  const allSkills = Array.from(skillsContainer.children);
  const prevBtn = document.getElementById("prev-skill");
  const nextBtn = document.getElementById("next-skill");
  const controlBox = document.getElementById("skill-controls");
  const dotBox = document.getElementById("skill-dots");

  const perPage = 6;
  let currentPage = 0;
  const totalPages = Math.ceil(allSkills.length / perPage);

  let autoTimer;
  let isHovered = false;

  function updateDots() {
    dotBox.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("div");
      dot.className = "skill-dot";
      if (i === currentPage) dot.classList.add("active");
      dotBox.appendChild(dot);
    }
  }

  function renderPage(index) {
    skillsContainer.classList.remove("visible");

    setTimeout(() => {
      skillsContainer.innerHTML = "";
      const start = index * perPage;
      const end = start + perPage;
      const pageSkills = allSkills.slice(start, end);
      pageSkills.forEach(skill => {
        skillsContainer.appendChild(skill);

        // Add hover listeners to pause auto-slide
        skill.addEventListener("mouseenter", () => {
          isHovered = true;
          clearInterval(autoTimer);
        });

        skill.addEventListener("mouseleave", () => {
          isHovered = false;
          startAutoSlide(); // resume
        });
      });

      skillsContainer.classList.add("visible");
      updateDots();
    }, 200);
  }

  function updateControls() {
    if (totalPages > 1) controlBox.style.display = "flex";
  }

  function startAutoSlide() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!isHovered && totalPages > 1) {
        currentPage = (currentPage + 1) % totalPages;
        renderPage(currentPage);
      }
    }, 7000);
  }

  function goToNextPage() {
    currentPage = (currentPage + 1) % totalPages;
    renderPage(currentPage);
    startAutoSlide(); // reset timer
  }

  function goToPrevPage() {
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    renderPage(currentPage);
    startAutoSlide(); // reset timer
  }

  prevBtn.addEventListener("click", goToPrevPage);
  nextBtn.addEventListener("click", goToNextPage);

  renderPage(0);
  updateControls();
  startAutoSlide();
});

document.addEventListener("DOMContentLoaded", () => {
  const projectsGrid = document.getElementById("projects-grid");
  const allProjects = Array.from(projectsGrid.children);
  const prevProjectBtn = document.getElementById("prev-project");
  const nextProjectBtn = document.getElementById("next-project");
  const projectControlBox = document.getElementById("project-controls");
  const projectDotBox = document.getElementById("project-dots");

  const projectsPerPage = 4;
  let currentProjectPage = 0;
  const totalProjectPages = Math.ceil(allProjects.length / projectsPerPage);

  let projectTimer;
  let projectHovered = false;

  function updateProjectDots() {
    projectDotBox.innerHTML = "";
    for (let i = 0; i < totalProjectPages; i++) {
      const dot = document.createElement("div");
      dot.className = "project-dot";
      if (i === currentProjectPage) dot.classList.add("active");
      projectDotBox.appendChild(dot);
    }
  }

  function renderProjectPage(index) {
    projectsGrid.classList.remove("visible");

    setTimeout(() => {
      projectsGrid.innerHTML = "";
      const start = index * projectsPerPage;
      const end = start + projectsPerPage;
      const pageProjects = allProjects.slice(start, end);
      pageProjects.forEach(project => {
        projectsGrid.appendChild(project);

        // Pause on hover
        project.addEventListener("mouseenter", () => {
          projectHovered = true;
          clearInterval(projectTimer);
        });

        project.addEventListener("mouseleave", () => {
          projectHovered = false;
          startProjectAutoSlide();
        });
      });

      projectsGrid.classList.add("visible");
      updateProjectDots();
    }, 200);
  }

  function startProjectAutoSlide() {
    clearInterval(projectTimer);
    projectTimer = setInterval(() => {
      if (!projectHovered && totalProjectPages > 1) {
        currentProjectPage = (currentProjectPage + 1) % totalProjectPages;
        renderProjectPage(currentProjectPage);
      }
    }, 7000);
  }

  function goToNextProjectPage() {
    currentProjectPage = (currentProjectPage + 1) % totalProjectPages;
    renderProjectPage(currentProjectPage);
    startProjectAutoSlide();
  }

  function goToPrevProjectPage() {
    currentProjectPage = (currentProjectPage - 1 + totalProjectPages) % totalProjectPages;
    renderProjectPage(currentProjectPage);
    startProjectAutoSlide();
  }

  if (totalProjectPages > 1) {
    projectControlBox.style.display = "flex";
  }

  prevProjectBtn.addEventListener("click", goToPrevProjectPage);
  nextProjectBtn.addEventListener("click", goToNextProjectPage);

  renderProjectPage(0);
  startProjectAutoSlide();
});

// Add this to the end of portfolio.js

document.addEventListener("DOMContentLoaded", () => {
  const flashMessage = document.querySelector('.flash-message');

  if (flashMessage) {
    // Wait 4 seconds (4000 milliseconds)
    setTimeout(() => {
      // Add the fade-out class to trigger the CSS transition
      flashMessage.classList.add('fade-out');

      // Optional: a little later, remove the element completely
      setTimeout(() => {
        flashMessage.style.display = 'none';
      }, 500); // This should match the transition duration in the CSS
    }, 4000);
  }
});


// Add this entire block to the end of your portfolio.js file

document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById('hero-title');
  const subtitleEl = document.getElementById('hero-subtitle');

  if (titleEl && subtitleEl) {
    const titleText = "Sharib Ahmad";
    const subtitleTexts = ['Data Scientist', 'Web Developer', 'Machine Learning Enthusiast'];

    // A short delay to allow the page to settle before starting
    setTimeout(() => {
      typewriterSequence();
    }, 1000);

    const type = (element, text, delay = 100) => {
      return new Promise(resolve => {
        element.classList.add('typing');
        let i = 0;
        const interval = setInterval(() => {
          if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
          } else {
            clearInterval(interval);
            element.classList.remove('typing');
            resolve();
          }
        }, delay);
      });
    };

    const erase = (element, delay = 50) => {
      return new Promise(resolve => {
        element.classList.add('typing');
        let text = element.innerHTML;
        const interval = setInterval(() => {
          if (text.length > 0) {
            text = text.substring(0, text.length - 1);
            element.innerHTML = text;
          } else {
            clearInterval(interval);
            element.classList.remove('typing');
            resolve();
          }
        }, delay);
      });
    };

    const typewriterSequence = async () => {
      // 1. Type the main title
      await type(titleEl, titleText);
      titleEl.classList.add('animation-on'); // Restore the glow animations

      // 2. Start the infinite loop for the subtitle
      let subtitleIndex = 0;
      while (true) {
        const currentSubtitle = subtitleTexts[subtitleIndex];
        await new Promise(resolve => setTimeout(resolve, 500)); // Pause before typing new subtitle
        await type(subtitleEl, currentSubtitle);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait with the full text
        await erase(subtitleEl);
        subtitleIndex = (subtitleIndex + 1) % subtitleTexts.length;
      }
    };
  }
});