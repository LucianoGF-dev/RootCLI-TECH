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

// ==========================================
// GALERÍA DE PROYECTOS REALES (IMÁGENES)
// ==========================================
(function initProjectGallery() {

  const projectsData = [
    // === PROYECTOS REALES (0-2) ===
    {
      id: 0,
      title: 'Sistema de administración para banco de sangre',
      description: 'Plataforma digital diseñada para controlar y optimizar todos los procesos relacionados con la donación, almacenamiento y distribución de sangre.',
      images: [
        { src: 'bancoSangre/bloodbank.png', alt: 'Dashboard principal - Banco de Sangre' },
        { src: 'bancoSangre/Captura de pantalla 2025-11-27 193448.png', alt: 'Módulo de analíticas en tiempo real' },
        { src: 'bancoSangre/Captura de pantalla 2025-11-27 193512.png', alt: 'Gestión de donantes y registros' },
        { src: 'bancoSangre/Captura de pantalla 2025-11-27 193712.png', alt: 'Panel de control administrativo' }
      ]
    },
    {
      id: 1,
      title: 'Sistema de gestión para empresa de transporte',
      description: 'Plataforma digital diseñada para planificar, controlar y optimizar el movimiento de vehículos, mercancías o fletes.',
      images: [
        { src: 'siempreCargo/siempreCargo.png', alt: 'Dashboard principal - Gestión de Transporte' },
        { src: 'siempreCargo/Captura de pantalla 2025-11-28 145542.png', alt: 'Mapa de rutas y seguimiento en vivo' },
        { src: 'siempreCargo/Captura de pantalla 2025-11-28 145454.png', alt: 'Panel de administración de flota' },
        { src: 'siempreCargo/Captura de pantalla 2025-11-28 145304.png', alt: 'Reportes y métricas operativas' }
      ]
    },
    {
      id: 2,
      title: 'Sistema integral de gestión de stock',
      description: 'Plataforma digital diseñada para controlar y optimizar todos los procesos de inventario con integración hardware.',
      images: [
        { src: 'gestock/image.png', alt: 'Dashboard principal - Gestión de Stock' },
        { src: 'gestock/image-2.png', alt: 'Control de inventario en tiempo real' },
        { src: 'gestock/image-3.png', alt: 'Integración con dispositivos hardware' },
        { src: 'gestock/image-4.png', alt: 'Reportes de movimiento y alertas' }
      ]
    },

    // === DEMOS / PROTOTIPOS (3-8) - AHORA CON IMÁGENES ===
    {
      id: 3,
      title: '🥐 Prototipo Panadería Artesanal',
      description: 'Template optimizado para panaderías y pastelerías. Incluye catálogo de productos, horarios, pedidos por WhatsApp y sección de "productos del día". Diseño cálido y apetitoso.',
      images: [
        { src: 'demos/panaderia/hero.jpg', alt: 'Vista principal - Template Panadería' },
       
      ]
    },
    {
      id: 4,
      title: '🌲 Template Empresa Forestal',
      description: 'Diseño profesional para empresas del sector forestal. Secciones para servicios, sustentabilidad, proyectos y contacto B2B. Enfoque serio, confiable y orientado a resultados.',
      images: [
        { src: 'demos/forestal/hero.jpg', alt: 'Vista principal - Template Forestal' },
      
      ]
    },
    {
      id: 5,
      title: '💻 Template Comercio de Tecnología',
      description: 'Template moderno para tiendas de electrónica, computación y accesorios. Filtros por categoría, fichas técnicas, comparador de productos y integración con métodos de pago.',
      images: [
        { src: 'demos/tecnologia/hero.jpg', alt: 'Vista principal - Template Tecnología' },
        
      ]
    },
    {
      id: 6,
      title: '✂️ Template Peluquería & Estética',
      description: 'Diseño elegante para salones de belleza. Incluye galería de trabajos, lista de servicios con precios, reserva de turnos por WhatsApp y sección de promociones.',
      images: [
        { src: 'demos/peluqueria/hero.jpg', alt: 'Vista principal - Template Peluquería' },
        
      ]
    },
    {
      id: 7,
      title: '👗 Template Tienda de Moda',
      description: 'Template minimalista y visual para marcas de ropa. Galería tipo lookbook, tallas y colores, carrito de compras y enlaces directos a redes sociales para impulsar ventas.',
      images: [
        { src: 'demos/ropa/hero.jpg', alt: 'Vista principal - Template Tienda de Moda' },
        
      ]
    },
    {
      id: 8,
      title: '🎨 Template Artesanías & Handmade',
      description: 'Diseño cálido y auténtico para artesanos. Destaca la historia detrás de cada pieza, proceso de creación, envíos y opción de pedidos personalizados por WhatsApp.',
      images: [
        { src: 'demos/artesanias/hero.jpg', alt: 'Vista principal - Template Artesanías' },
      
      ]
    }
  ];



  // Estado del modal
  let currentItemIndex = 0;
  let currentSlideIndex = 0;
  let isAnimating = false;

  // Elementos del DOM (con validación segura)
  const modal = document.getElementById('gallery-modal');
  const modalContent = modal?.querySelector('.modal-content');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCounter = document.getElementById('modal-counter');
  const modalMediaContainer = document.querySelector('.modal-image-container');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');
  const modalThumbnails = document.getElementById('modal-thumbnails');
  const modalDescription = document.getElementById('modal-description');

  // ==========================================
  // 2. INICIALIZACIÓN DE CARRUSELES EN CARDS
  // ==========================================

  function initCardCarousels() {
    document.querySelectorAll('.project-card[data-project]').forEach((card) => {
      const projectIndex = parseInt(card.dataset.project);
      const carousel = card.querySelector('.project-carousel');
      if (!carousel) return;

      const track = carousel.querySelector('.carousel-track');
      const slides = carousel.querySelectorAll('.carousel-slide');
      const dots = carousel.querySelectorAll('.carousel-dot');
      const expandBtn = carousel.querySelector('.carousel-expand');

      let currentIndex = 0;

      // Función para navegar entre slides
      function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;

        slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
      }

      // Event listeners para navegación
      carousel.querySelector('.carousel-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });

      carousel.querySelector('.carousel-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });

      dots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(i);
        });
      });

      // Swipe táctil para móviles
      let touchStartX = 0;
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        }
      }, { passive: true });

      // Abrir modal al hacer click en expandir o en la imagen
      const openHandler = () => openModal(projectIndex, currentIndex);

      expandBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openHandler();
      });

      // Click en la imagen principal también abre el modal
      const firstImg = slides[0]?.querySelector('.carousel-img');
      if (firstImg) {
        firstImg.style.cursor = 'pointer';
        firstImg.addEventListener('click', openHandler);
      }
    });
  }

  // ==========================================
  // 3. FUNCIONES DEL MODAL (SOLO IMÁGENES)
  // ==========================================

  function openModal(projectIndex, slideIndex = 0) {
    if (!modal || !projectsData[projectIndex]) return;

    currentItemIndex = projectIndex;
    currentSlideIndex = slideIndex;
    const project = projectsData[projectIndex];

    // Actualizar contenido del modal
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    updateCounter();

    // Generar miniaturas
    renderThumbnails(project.images);

    // Mostrar imagen actual
    updateModalImage();

    // Mostrar modal con animación
    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    });

    // Enfocar botón de cerrar para accesibilidad
    setTimeout(() => modalClose?.focus(), 300);
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove('active');
    document.body.classList.remove('modal-open');

    // Ocultar después de la animación
    setTimeout(() => {
      modal.hidden = true;
      // Limpiar contenedor para liberar memoria
      if (modalMediaContainer) {
        const img = modalMediaContainer.querySelector('.modal-image');
        if (img) img.src = '';
      }
    }, 300);
  }

  function updateCounter() {
    const project = projectsData[currentItemIndex];
    if (modalCounter && project) {
      modalCounter.textContent = `${currentSlideIndex + 1} / ${project.images.length}`;
    }
  }

  function renderThumbnails(images) {
    if (!modalThumbnails) return;

    modalThumbnails.innerHTML = '';

    images.forEach((image, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = `modal-thumb${index === currentSlideIndex ? ' active' : ''}`;
      thumb.setAttribute('aria-label', `Ver: ${image.alt}`);
      thumb.innerHTML = `<img src="${image.src}" alt="${image.alt}" loading="lazy">`;

      thumb.addEventListener('click', () => goToSlide(index));
      modalThumbnails.appendChild(thumb);
    });
  }

  function updateModalImage() {
    const project = projectsData[currentItemIndex];
    const image = project?.images[currentSlideIndex];

    if (!modalMediaContainer || !image) return;

    // Crear nueva imagen con transición suave
    const newImg = document.createElement('img');
    newImg.src = image.src;
    newImg.alt = image.alt;
    newImg.className = 'modal-image';
    newImg.id = 'modal-image';

    // Efecto de fade al cambiar
    const currentImg = modalMediaContainer.querySelector('.modal-image');
    if (currentImg) {
      currentImg.classList.add('changing');
      setTimeout(() => {
        currentImg.remove();
        modalMediaContainer.insertBefore(newImg, modalPrev);
      }, 150);
    } else {
      modalMediaContainer.insertBefore(newImg, modalPrev);
    }
  }

  function goToSlide(index) {
    if (isAnimating || !projectsData[currentItemIndex]) return;

    const project = projectsData[currentItemIndex];
    if (index < 0) index = project.images.length - 1;
    if (index >= project.images.length) index = 0;

    isAnimating = true;
    currentSlideIndex = index;

    // Actualizar contador y miniaturas
    updateCounter();

    const thumbs = modalThumbnails?.querySelectorAll('.modal-thumb');
    if (thumbs) {
      thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
      // Scroll suave hacia la miniatura activa
      thumbs[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }

    // Actualizar imagen con pequeña demora para la animación
    setTimeout(() => {
      updateModalImage();
      isAnimating = false;
    }, 150);
  }

  function nextSlide() {
    const project = projectsData[currentItemIndex];
    if (project) goToSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    const project = projectsData[currentItemIndex];
    if (project) goToSlide(currentSlideIndex - 1);
  }

  // ==========================================
  // 4. EVENT LISTENERS DEL MODAL
  // ==========================================

  function initModalEvents() {
    // Cerrar modal
    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // Navegación
    modalNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });

    modalPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });

    // Prevenir cierre al hacer click dentro del contenido
    modalContent?.addEventListener('click', (e) => e.stopPropagation());

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (!modal?.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
      }
    });

    // Swipe táctil en el modal
    let touchStartX = 0;
    modal?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal?.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 60) {
        diff > 0 ? nextSlide() : prevSlide();
      }
    }, { passive: true });
  }

  // ==========================================
  // 5. INICIALIZACIÓN
  // ==========================================

  function init() {
    // Solo inicializar si el modal existe en el DOM
    if (!modal) {
      console.warn('⚠️ Modal de galería no encontrado en el DOM');
      return;
    }

    initCardCarousels();
    initModalEvents();

    // Pre-cargar imágenes de miniaturas para mejor UX (opcional)
    if ('connection' in navigator && navigator.connection.saveData !== true) {
      projectsData.forEach(project => {
        project.images.forEach(img => {
          const preload = new Image();
          preload.src = img.src;
        });
      });
    }
  }

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exponer funciones para uso externo si es necesario (opcional)
  window.ProjectGallery = {
    open: openModal,
    close: closeModal,
    goTo: goToSlide
  };

})();

// =======================================================================
// VIDEO PROMO SECTION - Funcionalidad Completa y Corregida
// =======================================================================
(function () {
  'use strict';

  // Esperar a que el DOM esté listo
  function initVideoPromo() {
    const videoPlaceholder = document.getElementById('video-placeholder');
    const videoPlayBtn = document.getElementById('video-play-btn');
    const videoElement = document.getElementById('promo-video');
    const videoMuteBtn = document.getElementById('video-mute-btn');
    const videoFullscreenBtn = document.getElementById('video-fullscreen-btn');

    // Validar que los elementos existan
    if (!videoElement || !videoPlaceholder) {
      console.warn('⚠️ Elementos de video no encontrados');
      return;
    }

    // Función principal para reproducir el video
    function playVideo() {
      // Ocultar placeholder con transición
      videoPlaceholder.classList.add('hidden');

      // Mostrar video: múltiples métodos para máxima compatibilidad
      videoElement.style.display = 'block';
      videoElement.hidden = false;
      videoElement.removeAttribute('hidden');

      // Forzar reflow para aplicar cambios de estilo
      void videoElement.offsetWidth;

      // Intentar reproducir
      videoElement.play()
        .then(() => {
          console.log('✅ Video reproduciéndose correctamente');
          // Pausar animación del botón play
          const playButton = videoPlayBtn?.querySelector('.play-button');
          if (playButton) playButton.style.animation = 'none';
        })
        .catch(error => {
          console.warn('⚠️ Autoplay bloqueado o error:', error);
          // Mostrar controles nativos para que el usuario pueda hacer play manualmente
          videoElement.controls = true;
          // Mensaje amigable en consola (no alert para no molestar)
          if (error.name === 'NotAllowedError') {
            console.log('💡 El usuario debe interactuar para reproducir el video');
          }
        });
    }

    // Event listeners para el botón de play
    if (videoPlayBtn) {
      videoPlayBtn.addEventListener('click', playVideo);
      videoPlayBtn.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playVideo();
        }
      });
    }

    // Toggle mute/unmute
    if (videoMuteBtn && videoElement) {
      videoMuteBtn.addEventListener('click', () => {
        videoElement.muted = !videoElement.muted;
        videoMuteBtn.classList.toggle('muted', videoElement.muted);

        // Feedback visual sutil
        videoMuteBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
          videoMuteBtn.style.transform = '';
        }, 150);
      });
    }

    // Pantalla completa
    if (videoFullscreenBtn && videoElement) {
      videoFullscreenBtn.addEventListener('click', () => {
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        } else if (videoElement.webkitRequestFullscreen) {
          videoElement.webkitRequestFullscreen(); // Safari
        } else if (videoElement.msRequestFullscreen) {
          videoElement.msRequestFullscreen(); // IE11
        }
      });
    }

    // Efecto hover en el placeholder
    if (videoPlaceholder) {
      videoPlaceholder.addEventListener('mouseenter', function () {
        this.style.cursor = 'pointer';
      });
    }

    // Manejar fin del video: mostrar placeholder nuevamente (opcional)
    if (videoElement) {
      videoElement.addEventListener('ended', () => {
        // Opcional: volver a mostrar el placeholder cuando termine
        // videoPlaceholder.classList.remove('hidden');
        // videoElement.style.display = 'none';
        console.log('🎬 Video finalizado');
      });

      // Manejar errores de carga del video
      videoElement.addEventListener('error', (e) => {
        console.error('❌ Error cargando el video:', videoElement.error);
        // Mostrar mensaje en la UI si es necesario
        if (videoPlaceholder) {
          const overlay = videoPlaceholder.querySelector('.video-play-overlay');
          if (overlay) {
            overlay.innerHTML = '<span style="color:#f87171;font-size:0.9rem">⚠️ Video no disponible</span>';
          }
        }
      });
    }

    // Precargar video en segundo plano (opcional, mejora experiencia)
    if (videoElement && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && videoElement.readyState === 0) {
            videoElement.load(); // Comenzar carga cuando está visible
            observer.unobserve(videoElement);
          }
        });
      }, { rootMargin: '100px' });

      observer.observe(videoElement);
    }

    console.log('🎥 Video promo inicializado correctamente');
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoPromo);
  } else {
    initVideoPromo();
  }

})();