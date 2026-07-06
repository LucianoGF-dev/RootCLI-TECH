
'use strict';

/* ---------- NAVBAR ---------- */
(function(){
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    if(window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = navToggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });
})();

/* ---------- AOS INIT ---------- */
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
  disable: window.innerWidth < 768 ? 'phone' : false
});

/* ---------- GSAP HERO ANIMATIONS ---------- */
(function(){
  if(typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({defaults:{ease:'power3.out'}});
  tl.from('.hero-badge', {y:20, opacity:0, duration:.8})
    .from('.hero-title .line span', {y:80, opacity:0, duration:1, stagger:.15}, '-=.4')
    .from('.hero-subtitle', {y:30, opacity:0, duration:.8}, '-=.6')
    .from('.hero-ctas', {y:30, opacity:0, duration:.8}, '-=.5')
    .from('.hero-stat', {y:20, opacity:0, duration:.6, stagger:.1}, '-=.4');

  gsap.to('.hero-glow.g1', {
    yPercent: 30,
    scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}
  });
  gsap.to('.hero-glow.g2', {
    yPercent: -20,
    scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}
  });
})();

/* ---------- COUNTER ANIMATION ---------- */
(function(){
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    if(el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) animateCounter(entry.target);
    });
  }, {threshold: 0.4});

  counters.forEach(c => observer.observe(c));
})();

/* ---------- TIMELINE REVEAL ---------- */
(function(){
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.2});
  items.forEach(item => observer.observe(item));
})();

/* ---------- FAQ ACCORDION ---------- */
(function(){
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if(!isActive){
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

/* ---------- PARTICLES BACKGROUND ---------- */
(function(){
  const canvas = document.getElementById('particles-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  const resize = () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const count = Math.min(50, Math.floor(w * h / 25000));
  for(let i = 0; i < count; i++){
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.5,
      a: Math.random() * 0.5 + 0.2
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 43, 43, ${p.a})`;
      ctx.fill();
    });
    for(let i = 0; i < particles.length; i++){
      for(let j = i + 1; j < particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 43, 43, ${0.15 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  };
  animate();
})();

/* ---------- MOUSE PARALLAX EN HERO ---------- */
(function(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const visual = document.querySelector('.hero-visual');
    if(visual){
      visual.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    }
  });
})();

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({top, behavior: 'smooth'});
    }
  });
});
