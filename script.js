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
// CARRUSEL DE PROYECTOS + MODAL
// ==========================================
// ==========================================
// CARRUSEL DE PROYECTOS + MODAL (UNIFICADO)
// ==========================================
(function initProjectGallery() {
  
  // ==========================================
  // 1. DATOS DE PROYECTOS REALES
  // ==========================================
  const projectsData = [
    {
      title: 'Sistema de administración y gestión para banco de sangre',
      description: 'Plataforma digital diseñada para controlar y optimizar todos los procesos relacionados con la donación, almacenamiento y distribución de sangre.',
      images: [
        { src: 'bancoSangre/bloodbank.png', alt: 'Sistema de gestión de banco de sangre' },
        { src: 'bancoSangre/Captura de pantalla 2025-11-27 193448.png', alt: 'Sistema de gestión de banco de sangre' },
        { src: 'bancoSangre/Captura de pantalla 2025-11-27 193512.png', alt: 'Sistema de gestión de banco de sangre' },
        { src: 'bancoSangre/Captura de pantalla 2025-11-27 193712.png', alt: 'Sistema de gestión de banco de sangre' }
      ],
      type: 'project' // ← Identificador
    },
    {
      title: 'Sistema de administración y gestión para empresa de transporte',
      description: 'Plataforma digital diseñada para planificar, controlar y optimizar el movimiento de vehículos, mercancías o fletes.',
      images: [
        { src: 'siempreCargo/siempreCargo.png', alt: 'Sistema de gestión de transporte' },
        { src: 'siempreCargo/Captura de pantalla 2025-11-28 145542.png', alt: 'Sistema de gestión de transporte' },
        { src: 'siempreCargo/Captura de pantalla 2025-11-28 145454.png', alt: 'Sistema de gestión de transporte' },
        { src: 'siempreCargo/Captura de pantalla 2025-11-28 145304.png', alt: 'Sistema de gestión de transporte' }
      ],
      type: 'project'
    },
    {
      title: 'Sistema de gestión de stock',
      description: 'Plataforma digital diseñada para controlar y optimizar todos los procesos relacionados con el inventario, permitiendo una gestión eficiente de productos y recursos.',
      images: [
        { src: 'gestock/image.png', alt: 'Sistema de gestión de stock' },
        { src: 'gestock/image-2.png', alt: 'Sistema de gestión de stock' },
        { src: 'gestock/image-3.png', alt: 'Sistema de gestión de stock' },
        { src: 'gestock/image-4.png', alt: 'Sistema de gestión de stock' }
      ],
      type: 'project'
    }
  ];

  // ==========================================
  // 2. DATOS DE TEMPLATES/DEMOS
  // ==========================================
  const templatesData = [
    {
      title: '🥐 Prototipo Panadería Artesanal',
      description: 'Template optimizado para panaderías y pastelerías. Incluye catálogo de productos, horarios, pedidos por WhatsApp y sección de "productos del día". Diseño cálido y apetitoso.',
      images: [
        { src: 'demos/panaderia/hero.jpg', alt: 'Vista principal del template panadería' },
        { src: 'demos/panaderia/catalogo.jpg', alt: 'Catálogo de productos con precios' },
        { src: 'demos/panaderia/pedidos-whatsapp.jpg', alt: 'Botón de pedidos por WhatsApp integrado' },
        { src: 'demos/panaderia/horarios.jpg', alt: 'Sección de horarios y ubicación' }
      ],
      type: 'demo' // ← Identificador
    },
    {
      title: '🌲 Template Empresa Forestal',
      description: 'Diseño profesional para empresas del sector forestal. Secciones para servicios, sustentabilidad, proyectos y contacto B2B. Enfoque serio, confiable y orientado a resultados.',
      images: [
        { src: 'demos/forestal/hero.jpg', alt: 'Vista principal del template forestal' },
        { src: 'demos/forestal/servicios.jpg', alt: 'Sección de servicios corporativos' },
        { src: 'demos/forestal/sustentabilidad.jpg', alt: 'Página de sustentabilidad y certificaciones' },
        { src: 'demos/forestal/proyectos.jpg', alt: 'Galería de proyectos realizados' }
      ],
      type: 'demo'
    },
    {
      title: '💻 Template Comercio de Tecnología',
      description: 'Template moderno para tiendas de electrónica, computación y accesorios. Filtros por categoría, fichas técnicas, comparador de productos y integración con métodos de pago.',
      images: [
        { src: 'demos/tecnologia/hero.jpg', alt: 'Vista principal del template tecnología' },
        { src: 'demos/tecnologia/catalogo.jpg', alt: 'Catálogo con filtros y categorías' },
        { src: 'demos/tecnologia/ficha-producto.jpg', alt: 'Ficha técnica de producto con especificaciones' },
        { src: 'demos/tecnologia/carrito.jpg', alt: 'Carrito de compras y checkout' }
      ],
      type: 'demo'
    },
    {
      title: '✂️ Template Peluquería & Estética',
      description: 'Diseño elegante para salones de belleza. Incluye galería de trabajos, lista de servicios con precios, reserva de turnos por WhatsApp y sección de promociones.',
      images: [
        { src: 'demos/peluqueria/hero.jpg', alt: 'Vista principal del template peluquería' },
        { src: 'demos/peluqueria/servicios.jpg', alt: 'Lista de servicios con precios' },
        { src: 'demos/peluqueria/galeria.jpg', alt: 'Galería de trabajos y estilos' },
        { src: 'demos/peluqueria/reservas.jpg', alt: 'Sistema de reserva de turnos por WhatsApp' }
      ],
      type: 'demo'
    },
    {
      title: '👗 Template Tienda de Moda',
      description: 'Template minimalista y visual para marcas de ropa. Galería tipo lookbook, tallas y colores, carrito de compras y enlaces directos a redes sociales para impulsar ventas.',
      images: [
        { src: 'demos/ropa/hero.jpg', alt: 'Vista principal del template tienda de ropa' },
        { src: 'demos/ropa/lookbook.jpg', alt: 'Galería lookbook con modelos' },
        { src: 'demos/ropa/ficha-producto.jpg', alt: 'Ficha de producto con tallas y colores' },
        { src: 'demos/ropa/carrito.jpg', alt: 'Carrito de compras integrado' }
      ],
      type: 'demo'
    },
    {
      title: '🎨 Template Artesanías & Handmade',
      description: 'Diseño cálido y auténtico para artesanos. Destaca la historia detrás de cada pieza, proceso de creación, envíos y opción de pedidos personalizados por WhatsApp.',
      images: [
        { src: 'demos/artesanias/hero.jpg', alt: 'Vista principal del template artesanías' },
        { src: 'demos/artesanias/proceso.jpg', alt: 'Sección del proceso de creación artesanal' },
        { src: 'demos/artesanias/catalogo.jpg', alt: 'Catálogo de piezas handmade' },
        { src: 'demos/artesanias/pedidos.jpg', alt: 'Formulario de pedidos personalizados' }
      ],
      type: 'demo'
    }
  ];

  // ==========================================
  // 3. FUSIÓN DE ARRAYS (SOLUCIÓN DEL ERROR)
  // ==========================================
  // Creamos un único array con todos los items
  const allGalleryItems = [...projectsData, ...templatesData];

  // Estado del modal
  let currentItemIndex = 0; // ← Renombrado para claridad (ya no es solo "project")
  let currentSlide = 0;
  let isAnimating = false;

  // Elementos del DOM
  const modal = document.getElementById('gallery-modal');
  const modalContent = modal?.querySelector('.modal-content');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCounter = document.getElementById('modal-counter');
  const modalImage = document.getElementById('modal-image');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');
  const modalThumbnails = document.getElementById('modal-thumbnails');
  const modalDescription = document.getElementById('modal-description');

  // ==========================================
  // 4. CARRUSELES DE CADA CARD (PROYECTOS Y TEMPLATES)
  // ==========================================
  
  document.querySelectorAll('.project-carousel').forEach((carousel, visualIndex) => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const expandBtn = carousel.querySelector('.carousel-expand');
    const card = carousel.closest('.project-card');
    
    // 🔑 CLAVE: Obtener el índice REAL del array fusionado desde data-project
    const realIndex = parseInt(card?.dataset.project || visualIndex);
    
    let currentIndex = 0;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      
      slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    // Event listeners del carrusel
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(i); });
    });

    // Touch/swipe
    let touchStartX = 0, touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
    }, { passive: true });

    // 🔑 CLAVE: Abrir modal usando el índice real del array fusionado
    const openModalHandler = () => openModal(realIndex, currentIndex);
    
    const firstImg = slides[0]?.querySelector('.carousel-img');
    if (firstImg) {
      firstImg.style.cursor = 'pointer';
      firstImg.addEventListener('click', openModalHandler);
    }
    expandBtn?.addEventListener('click', openModalHandler);
  });

  // ==========================================
  // 5. FUNCIONES DEL MODAL (USAN allGalleryItems)
  // ==========================================

  function openModal(itemIndex, slideIndex = 0) {
    if (!modal || !allGalleryItems[itemIndex]) return;
    
    currentItemIndex = itemIndex;
    currentSlide = slideIndex;
    const item = allGalleryItems[itemIndex]; // ← Usa el array fusionado

    // Configurar contenido
    modalTitle.textContent = item.title;
    modalDescription.textContent = item.description;
    modalCounter.textContent = `${slideIndex + 1} / ${item.images.length}`;
    
    // Generar miniaturas
    modalThumbnails.innerHTML = '';
    item.images.forEach((img, i) => {
      const thumb = document.createElement('div');
      thumb.className = `modal-thumb${i === slideIndex ? ' active' : ''}`;
      thumb.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
      thumb.addEventListener('click', () => goToModalSlide(i));
      modalThumbnails.appendChild(thumb);
    });

    updateModalImage();

    // Mostrar modal
    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    });
    setTimeout(() => modalClose?.focus(), 300);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    setTimeout(() => { modal.hidden = true; }, 300);
  }

  function goToModalSlide(index) {
    if (isAnimating || index === currentSlide) return;
    
    isAnimating = true;
    currentSlide = index;
    const item = allGalleryItems[currentItemIndex]; // ← Array fusionado

    modalCounter.textContent = `${index + 1} / ${item.images.length}`;

    const thumbs = modalThumbnails.querySelectorAll('.modal-thumb');
    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
    
    if (thumbs[index]) {
      thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    modalImage.classList.add('changing');
    setTimeout(() => {
      updateModalImage();
      modalImage.classList.remove('changing');
      isAnimating = false;
    }, 200);
  }

  function updateModalImage() {
    const item = allGalleryItems[currentItemIndex]; // ← Array fusionado
    if (!item?.images[currentSlide]) return;
    const img = item.images[currentSlide];
    modalImage.src = img.src;
    modalImage.alt = img.alt;
  }

  function nextModalSlide() {
    const item = allGalleryItems[currentItemIndex];
    const next = (currentSlide + 1) % item.images.length;
    goToModalSlide(next);
  }

  function prevModalSlide() {
    const item = allGalleryItems[currentItemIndex];
    const prev = (currentSlide - 1 + item.images.length) % item.images.length;
    goToModalSlide(prev);
  }

  // Event listeners del modal
  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);
  modalNext?.addEventListener('click', nextModalSlide);
  modalPrev?.addEventListener('click', prevModalSlide);

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (modal?.classList.contains('active')) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextModalSlide();
      if (e.key === 'ArrowLeft') prevModalSlide();
    }
  });

  // Swipe en modal
  let modalTouchStartX = 0;
  modal?.addEventListener('touchstart', (e) => { modalTouchStartX = e.changedTouches[0].screenX; }, { passive: true });
  modal?.addEventListener('touchend', (e) => {
    const diff = modalTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 60) { diff > 0 ? nextModalSlide() : prevModalSlide(); }
  }, { passive: true });

  modalContent?.addEventListener('click', (e) => e.stopPropagation());

})();

