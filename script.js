/* ============================================
   PROTEJA-SE — Interactive Features
   Accessibility controls, animations, accordion
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navBottom = document.getElementById('navBottom');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navBottom.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      navBottom.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    });
  });

  // ============================================
  // FONT SIZE CONTROLS
  // ============================================
  const fontScales = ['normal', 'large', 'extra-large'];
  let currentScaleIndex = 0;

  // Load saved preference
  const savedScale = localStorage.getItem('proteja-se-font-scale');
  if (savedScale && fontScales.includes(savedScale)) {
    currentScaleIndex = fontScales.indexOf(savedScale);
    document.documentElement.setAttribute('data-font-scale', savedScale);
  }

  const btnFontIncrease = document.getElementById('btnFontIncrease');
  const btnFontDecrease = document.getElementById('btnFontDecrease');

  btnFontIncrease.addEventListener('click', () => {
    if (currentScaleIndex < fontScales.length - 1) {
      currentScaleIndex++;
      const newScale = fontScales[currentScaleIndex];
      document.documentElement.setAttribute('data-font-scale', newScale);
      localStorage.setItem('proteja-se-font-scale', newScale);
      announceToScreenReader(`Tamanho da letra: ${getScaleLabel(newScale)}`);
    }
  });

  btnFontDecrease.addEventListener('click', () => {
    if (currentScaleIndex > 0) {
      currentScaleIndex--;
      const newScale = fontScales[currentScaleIndex];
      document.documentElement.setAttribute('data-font-scale', newScale);
      localStorage.setItem('proteja-se-font-scale', newScale);
      announceToScreenReader(`Tamanho da letra: ${getScaleLabel(newScale)}`);
    }
  });

  function getScaleLabel(scale) {
    const labels = { 'normal': 'normal', 'large': 'grande', 'extra-large': 'extra grande' };
    return labels[scale] || scale;
  }

  // ============================================
  // DARK MODE TOGGLE
  // ============================================
  const btnDarkMode = document.getElementById('btnDarkMode');
  let isDark = false;

  // Helper to update dark mode button content
  const updateDarkModeBtn = (dark) => {
    btnDarkMode.innerHTML = dark
      ? '<span class="control-btn__icon">☀️</span><span class="control-btn__label">Modo Claro</span>'
      : '<span class="control-btn__icon">🌙</span><span class="control-btn__label">Modo Noturno</span>';
  };

  // Load saved preference
  const savedTheme = localStorage.getItem('proteja-se-theme');
  if (savedTheme === 'dark') {
    isDark = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    updateDarkModeBtn(true);
    btnDarkMode.classList.add('active');
  }

  btnDarkMode.addEventListener('click', () => {
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('proteja-se-theme', theme);
    updateDarkModeBtn(isDark);
    btnDarkMode.classList.toggle('active', isDark);
    announceToScreenReader(isDark ? 'Modo escuro ativado' : 'Modo claro ativado');
  });

  // ============================================
  // ACCORDION
  // ============================================
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      accordionItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.accordion__header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      header.setAttribute('aria-expanded', !isActive);
    });

    // Keyboard support
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If user prefers reduced motion, show everything immediately
    animatedElements.forEach(el => el.classList.add('visible'));
  } else {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // If it's a stagger parent, animate children
          if (entry.target.closest('.stagger-children')) {
            const parent = entry.target.closest('.stagger-children');
            const children = parent.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
            children.forEach(child => child.classList.add('visible'));
          }

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('backToTop');

  const handleBackToTopVisibility = () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // ============================================
  // SCREEN READER ANNOUNCEMENTS
  // ============================================
  function announceToScreenReader(message) {
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
      document.body.appendChild(announcer);
    }
    announcer.textContent = '';
    setTimeout(() => { announcer.textContent = message; }, 100);
  }

  // ============================================
  // HERO STAT COUNTER ANIMATION
  // ============================================
  const statNumbers = document.querySelectorAll('.hero__stat-number');
  let statsAnimated = false;

  const animateStats = () => {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(stat => {
      const text = stat.textContent.trim();
      // Simple fade-in effect for stats
      stat.style.opacity = '0';
      stat.style.transform = 'translateY(10px)';
      stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      setTimeout(() => {
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
      }, 200);
    });
  };

  // Animate stats when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) heroObserver.observe(heroStats);

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.navbar__link');

  const highlightNav = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    let activeId = null;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeId = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (activeId && link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ============================================
  // KEYBOARD NAVIGATION SUPPORT
  // ============================================
  document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
      if (navBottom.classList.contains('open')) {
        navBottom.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    }
  });

  // ============================================
  // INITIAL SETUP
  // ============================================
  handleScroll();
  handleBackToTopVisibility();

  console.log('🛡️ Proteja-se — Site carregado com sucesso!');
});
