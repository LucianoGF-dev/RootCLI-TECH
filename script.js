(function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu.querySelectorAll('.nav-link');

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);


  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
    overlay.classList.toggle('active');

    navToggle.setAttribute('aria-expanded', isOpen);

    document.body.style.overflow = isOpen ? 'hidden' : '';
  }


  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    overlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
})();




(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();




(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');


  function highlightNavLink() {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });
  highlightNavLink();
})();




(function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');


  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
})();




(function initTypingEffect() {
  const container = document.getElementById('typing-container');
  const texts = [
    'Y mantenimiento de hardware PC, consolas, etc.',
    'Soluciones web, APIs y backend a medida.',
    'Reparación y optimización de equipos gaming.',
    'Tu proyecto digital comienza aquí.'
  ];

  const typingSpeed = 50;
  const deletingSpeed = 30;
  const pauseDuration = 2500;
  const pauseBeforeType = 500;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;


  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      charIndex--;
      container.innerHTML = currentText.substring(0, charIndex) + '<span class="typing-cursor"></span>';
    } else {
      charIndex++;
      container.innerHTML = currentText.substring(0, charIndex) + '<span class="typing-cursor"></span>';
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentText.length) {
      speed = pauseDuration;
      isDeleting = true;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = pauseBeforeType;
    }

    setTimeout(type, speed);
  }


  setTimeout(type, 1000);
})();




(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observerOptions = {
    threshold: 0.5
  };

  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      counter.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animar todos los contadores
        counters.forEach(counter => animateCounter(counter));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }
})();




(function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const successMessage = document.getElementById('form-success');



  const fields = {
    name: {
      element: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => {
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      }
    },
    email: {
      element: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) => {
        if (!value.trim()) return 'El email es obligatorio';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Ingresa un email válido';
        return '';
      }
    },
    message: {
      element: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (value) => {
        if (!value.trim()) return 'El mensaje es obligatorio';
        if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        return '';
      }
    }
  };

  function validateField(fieldName) {
    const field = fields[fieldName];
    const value = field.element.value;
    const errorMessage = field.validate(value);

    if (errorMessage) {
      field.element.classList.add('error');
      field.error.textContent = errorMessage;
      return false;
    } else {
      field.element.classList.remove('error');
      field.error.textContent = '';
      return true;
    }
  }

  function validateAllFields() {
    let isValid = true;
    Object.keys(fields).forEach(fieldName => {
      if (!validateField(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  }

  function prepareEmailJSData(formData) {
    return {
      from_name: formData.get('name').trim(),
      from_email: formData.get('email').trim(),
      message: formData.get('message').trim(),
      reply_to: formData.get('email').trim(),
    };
  }


  function setLoadingState(isLoading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const btnIcon = submitBtn.querySelector('.btn-icon');

    if (isLoading) {
      btnText.textContent = 'Enviando...';
      btnLoader.hidden = false;
      btnIcon.hidden = true;
      submitBtn.disabled = true;
    } else {
      btnText.textContent = 'Enviar Mensaje';
      btnLoader.hidden = true;
      btnIcon.hidden = false;
      submitBtn.disabled = false;
    }
  }


  async function sendEmail(formData) {
    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        prepareEmailJSData(formData),
        EMAILJS_CONFIG.publicKey
      );

      if (response.status === 200) {
        return { success: true };
      }
      return { success: false, error: 'Error en la respuesta del servidor' };
    } catch (error) {
      console.error('EmailJS Error:', error);

      if (error.text?.includes('rate limit')) {
        return { success: false, error: 'Demasiados intentos. Espera unos segundos.' };
      }
      if (error.text?.includes('invalid')) {
        return { success: false, error: 'Configuración de EmailJS inválida.' };
      }
      return { success: false, error: 'No se pudo enviar el mensaje. Intenta de nuevo.' };
    }
  }



  Object.keys(fields).forEach(fieldName => {
    fields[fieldName].element.addEventListener('blur', () => {
      validateField(fieldName);
    });

    fields[fieldName].element.addEventListener('input', () => {
      if (fields[fieldName].element.classList.contains('error')) {
        validateField(fieldName);
      }
    });
  });

  // Submit del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      const firstError = form.querySelector('.form-input.error');
      if (firstError) {
        firstError.focus();
        firstError.style.animation = 'none';
        firstError.offsetHeight; // Trigger reflow
        firstError.style.animation = 'shake 0.5s ease';
      }
      return;
    }

    setLoadingState(true);

    const formData = new FormData(form);

    const result = await sendEmail(formData);

    if (result.success) {
      successMessage.hidden = false;
      form.reset();
      setLoadingState(false);

      setTimeout(() => {
        successMessage.hidden = true;
      }, 5000);
    } else {
      setLoadingState(false);
      alert(`⚠️ ${result.error}`);
    }
  });

  successMessage.addEventListener('click', () => {
    successMessage.hidden = true;
    form.style.display = 'block';
    form.reset();
    Object.values(fields).forEach(field => field.element.classList.remove('error'));
  });
})();

(function initScrollTop() {
  const scrollBtn = document.getElementById('scroll-top');
  const visibilityThreshold = 400;

  function handleScroll() {
    if (window.scrollY > visibilityThreshold) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


(function initFooterYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();



(function injectShakeAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();


(function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 26, 26, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const maxDistance = 120;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 26, 26, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  resizeCanvas();
  initParticles();
  animate();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();