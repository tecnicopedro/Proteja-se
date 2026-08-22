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
  const navDrawerClose = document.getElementById('navDrawerClose');
  const navBottomPanel = document.getElementById('navBottomPanel');

  const closeMobileMenu = () => {
    navBottom.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    navBottom.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navBottom.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close via the drawer's X button
  if (navDrawerClose) {
    navDrawerClose.addEventListener('click', closeMobileMenu);
  }

  // Close when clicking the overlay (the dark backdrop), but NOT the inner panel
  navBottom.addEventListener('click', (e) => {
    if (navBottomPanel && !navBottomPanel.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
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
  const btnFontIncreaseMob = document.getElementById('btnFontIncreaseMob');
  const btnFontDecreaseMob = document.getElementById('btnFontDecreaseMob');

  const increaseFont = () => {
    if (currentScaleIndex < fontScales.length - 1) {
      currentScaleIndex++;
      const newScale = fontScales[currentScaleIndex];
      document.documentElement.setAttribute('data-font-scale', newScale);
      localStorage.setItem('proteja-se-font-scale', newScale);
      announceToScreenReader(`Tamanho da letra: ${getScaleLabel(newScale)}`);
    }
  };

  const decreaseFont = () => {
    if (currentScaleIndex > 0) {
      currentScaleIndex--;
      const newScale = fontScales[currentScaleIndex];
      document.documentElement.setAttribute('data-font-scale', newScale);
      localStorage.setItem('proteja-se-font-scale', newScale);
      announceToScreenReader(`Tamanho da letra: ${getScaleLabel(newScale)}`);
    }
  };

  if (btnFontIncrease) btnFontIncrease.addEventListener('click', increaseFont);
  if (btnFontIncreaseMob) btnFontIncreaseMob.addEventListener('click', increaseFont);
  if (btnFontDecrease) btnFontDecrease.addEventListener('click', decreaseFont);
  if (btnFontDecreaseMob) btnFontDecreaseMob.addEventListener('click', decreaseFont);

  function getScaleLabel(scale) {
    const labels = { 'normal': 'normal', 'large': 'grande', 'extra-large': 'extra grande' };
    return labels[scale] || scale;
  }

  // ============================================
  // DARK MODE TOGGLE
  // ============================================
  const btnDarkMode = document.getElementById('btnDarkMode');
  const btnDarkModeMob = document.getElementById('btnDarkModeMob');
  let isDark = false;

  const updateDarkModeBtn = (dark) => {
    const html = dark
      ? '<span class="control-btn__icon">☀️</span><span class="control-btn__label">Modo Claro</span>'
      : '<span class="control-btn__icon">🌙</span><span class="control-btn__label">Modo Noturno</span>';
    if (btnDarkMode) {
      btnDarkMode.innerHTML = html;
      btnDarkMode.classList.toggle('active', dark);
    }
    if (btnDarkModeMob) {
      btnDarkModeMob.innerHTML = dark
        ? '<span class="control-btn__icon">☀️</span> Claro'
        : '<span class="control-btn__icon">🌙</span> Noturno';
      btnDarkModeMob.classList.toggle('active', dark);
    }
  };

  // Load saved preference
  const savedTheme = localStorage.getItem('proteja-se-theme');
  if (savedTheme === 'dark') {
    isDark = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    updateDarkModeBtn(true);
  }

  const toggleDarkMode = () => {
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('proteja-se-theme', theme);
    updateDarkModeBtn(isDark);
    announceToScreenReader(isDark ? 'Modo escuro ativado' : 'Modo claro ativado');
  };

  if (btnDarkMode) btnDarkMode.addEventListener('click', toggleDarkMode);
  if (btnDarkModeMob) btnDarkModeMob.addEventListener('click', toggleDarkMode);

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
        closeMobileMenu();
        navToggle.focus();
      }
    }
  });

  // ============================================
  // TEXT TO SPEECH (AUDIO NARRATION FOR ELDERLY)
  // ============================================
  const btnAudioTTS = document.getElementById('btnAudioTTS');
  const audioPlayer = document.getElementById('audioPlayer');
  const audioStatus = document.getElementById('audioStatus');
  const btnAudioPause = document.getElementById('btnAudioPause');
  const btnAudioStop = document.getElementById('btnAudioStop');

  let synth = window.speechSynthesis;
  let isSpeaking = false;
  let isPaused = false;

  if (!synth) {
    if (btnAudioTTS) btnAudioTTS.style.display = 'none';
  } else {
    const cleanSpeechText = (str) => {
      if (!str) return '';
      return str
        .replace(/R\$\s*([\d\.\,]+)/gi, (match, val) => {
          let numStr = val.replace(/\./g, '').replace(',', '.');
          let num = parseFloat(numStr);
          if (isNaN(num)) return val + ' reais';
          if (num === 10000) return 'dez mil reais';
          if (num === 5000) return 'cinco mil reais';
          if (num === 800) return 'oitocentos reais';
          if (num === 150) return 'cento e cinquenta reais';
          if (num === 99) return 'noventa e nove reais';
          return Math.floor(num) + ' reais';
        })
        .replace(/R\$/gi, 'reais')
        .replace(/\bPIX\b/gi, 'Pícs')
        .replace(/\bINSS\b/gi, 'I N S S')
        .replace(/\bB\.O\.\b|\bB\.O\b|\bBO\b/gi, 'Boletim de Ocorrência')
        .replace(/\bCPF\b/gi, 'C P F')
        .replace(/\bRG\b/gi, 'R G')
        .replace(/\bCVV\b/gi, 'C V V')
        .replace(/\bCDC\b/gi, 'Código de Defesa do Consumidor')
        .replace(/\bLGPD\b/gi, 'Lei Geral de Proteção de Dados')
        .replace(/\b190\b/g, 'cento e noventa')
        .replace(/\b100\b/g, 'cem')
        .replace(/\b197\b/g, 'cento e noventa e sete')
        .replace(/\b135\b/g, 'cento e trinta e cinco')
        .replace(/\b145\b/g, 'cento e quarenta e cinco')
        .replace(/\b151\b/g, 'cento e cinquenta e um')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const getPageTextChunks = () => {
      const chunks = [];
      chunks.push(cleanSpeechText("Bem-vindo ao Proteja-se: Guia de Segurança Financeira para Idosos."));
      chunks.push(cleanSpeechText("Seu dinheiro merece proteção. Um guia feito com carinho para ajudar você a reconhecer golpes, conhecer seus direitos e saber exatamente como agir."));
      chunks.push(cleanSpeechText("Atenção importante: Nenhum banco, I N S S ou órgão do governo liga pedindo senha, Pícs ou dados pessoais. Nunca!"));

      const sections = document.querySelectorAll('main section');
      sections.forEach(sec => {
        const title = sec.querySelector('.section__title');
        const subtitle = sec.querySelector('.section__subtitle');
        if (title) chunks.push(cleanSpeechText(title.textContent));
        if (subtitle) chunks.push(cleanSpeechText(subtitle.textContent));

        // Scam cards
        const cards = sec.querySelectorAll('.card');
        cards.forEach(card => {
          const cardTitle = card.querySelector('.card__title');
          const cardText = card.querySelector('.card__text');
          const scamExampleMsg = card.querySelector('.scam-example__message');
          const protectionItems = card.querySelectorAll('.protection-box__list li');

          if (cardTitle) chunks.push(cleanSpeechText("Atenção para o " + cardTitle.textContent));
          if (cardText) chunks.push(cleanSpeechText(cardText.textContent));
          if (scamExampleMsg) chunks.push(cleanSpeechText("Exemplo de mensagem ou ligação falsa: " + scamExampleMsg.textContent));
          if (protectionItems.length > 0) {
            chunks.push(cleanSpeechText("Orientações de como se proteger:"));
            protectionItems.forEach(li => {
              chunks.push(cleanSpeechText(li.textContent));
            });
          }
        });

        // Alert signs
        const alertSigns = sec.querySelectorAll('.alert-sign');
        alertSigns.forEach(sign => {
          const st = sign.querySelector('.alert-sign__title');
          const sd = sign.querySelector('.alert-sign__desc');
          if (st && sd) chunks.push(cleanSpeechText("Sinal de alerta: " + st.textContent + ". " + sd.textContent));
        });

        // Rights cards
        const rights = sec.querySelectorAll('.right-card');
        rights.forEach(r => {
          const rt = r.querySelector('.right-card__title');
          const rd = r.querySelector('.right-card__text');
          const rl = r.querySelector('.right-card__law');
          if (rt && rd) {
            let txt = "Seu direito: " + rt.textContent + ". " + rd.textContent;
            if (rl) txt += " Amparado pela " + rl.textContent;
            chunks.push(cleanSpeechText(txt));
          }
        });

        // Recovery steps
        const stepOrdinals = ['Primeiro passo', 'Segundo passo', 'Terceiro passo', 'Quarto passo', 'Quinto passo', 'Sexto passo'];
        const steps = sec.querySelectorAll('.step');
        steps.forEach((st, idx) => {
          const stTitle = st.querySelector('.step__title');
          const stText = st.querySelector('.step__text');
          const stHighlight = st.querySelector('.step__highlight');
          if (stTitle && stText) {
            const ordinal = stepOrdinals[idx] || `Passo ${idx + 1}`;
            let txt = ordinal + ': ' + stTitle.textContent + '. ' + stText.textContent;
            if (stHighlight) txt += ' ' + stHighlight.textContent;
            chunks.push(cleanSpeechText(txt));
          }
        });

        // Contact cards
        const contacts = sec.querySelectorAll('.contact-card');
        contacts.forEach(c => {
          const cn = c.querySelector('.contact-card__name');
          const cnum = c.querySelector('.contact-card__number');
          const cd = c.querySelector('.contact-card__desc');
          if (cn && cnum) {
            const numText = cnum.textContent.trim();
            // Only convert numeric phone numbers, leave text like 'Procure na sua cidade' as-is
            chunks.push(cleanSpeechText(`Canal de ajuda: ${cn.textContent}. Número: ${numText}. ${cd ? cd.textContent : ''}`));
          }
        });

        // FAQ Accordion
        const faqs = sec.querySelectorAll('.accordion__item');
        faqs.forEach(faq => {
          const q = faq.querySelector('.accordion__header span:nth-child(2)');
          const a = faq.querySelector('.accordion__content');
          if (q && a) {
            chunks.push(cleanSpeechText("Pergunta frequente: " + q.textContent));
            chunks.push(cleanSpeechText("Resposta: " + a.textContent));
          }
        });

        // Quotes
        const quotes = sec.querySelectorAll('.highlight-quote__text');
        quotes.forEach(q => chunks.push(cleanSpeechText(q.textContent)));
      });

      return chunks.filter(c => c && c.length > 0);
    };

    let textChunks = [];
    let currentChunkIndex = 0;

    const speakNextChunk = () => {
      if (currentChunkIndex >= textChunks.length) {
        stopAudio();
        return;
      }

      const text = textChunks[currentChunkIndex];
      if (audioStatus) audioStatus.textContent = text.slice(0, 45) + '...';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.92; // Slightly slower, natural rate for elderly

      const voices = synth.getVoices();
      const ptVoice = voices.find(v => v.lang && (v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.lang.includes('pt')));
      if (ptVoice) utterance.voice = ptVoice;

      utterance.onend = () => {
        if (isSpeaking && !isPaused) {
          currentChunkIndex++;
          speakNextChunk();
        }
      };

      utterance.onerror = () => {
        if (isSpeaking) {
          currentChunkIndex++;
          speakNextChunk();
        }
      };

      synth.speak(utterance);
    };

    const startAudio = () => {
      synth.cancel();
      textChunks = getPageTextChunks();
      currentChunkIndex = 0;
      isSpeaking = true;
      isPaused = false;

      if (audioPlayer) audioPlayer.classList.add('active');
      if (btnAudioTTS) btnAudioTTS.classList.add('active');
      if (btnAudioTTSMob) btnAudioTTSMob.classList.add('active');
      if (btnAudioPause) btnAudioPause.innerHTML = '⏸️ Pausar';

      speakNextChunk();
      announceToScreenReader("Iniciando leitura do site em áudio");
    };

    const pauseAudio = () => {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        isPaused = true;
        if (btnAudioPause) btnAudioPause.innerHTML = '▶️ Continuar';
        if (audioStatus) audioStatus.textContent = 'Leitura pausada';
        announceToScreenReader("Leitura em áudio pausada");
      } else if (synth.paused) {
        synth.resume();
        isPaused = false;
        if (btnAudioPause) btnAudioPause.innerHTML = '⏸️ Pausar';
        if (audioStatus) audioStatus.textContent = 'Continuando leitura...';
        announceToScreenReader("Continuando leitura em áudio");
      }
    };

    const stopAudio = () => {
      synth.cancel();
      isSpeaking = false;
      isPaused = false;

      if (audioPlayer) audioPlayer.classList.remove('active');
      if (btnAudioTTS) btnAudioTTS.classList.remove('active');
      if (btnAudioTTSMob) btnAudioTTSMob.classList.remove('active');
      if (btnAudioPause) btnAudioPause.innerHTML = '⏸️ Pausar';
      announceToScreenReader("Leitura em áudio encerrada");
    };

    const toggleAudioTTS = () => {
      if (isSpeaking) {
        stopAudio();
      } else {
        startAudio();
      }
    };

    if (btnAudioTTS) btnAudioTTS.addEventListener('click', toggleAudioTTS);
    if (btnAudioTTSMob) btnAudioTTSMob.addEventListener('click', toggleAudioTTS);

    if (btnAudioPause) btnAudioPause.addEventListener('click', pauseAudio);
    if (btnAudioStop) btnAudioStop.addEventListener('click', stopAudio);
  }

  // ============================================
  // INITIAL SETUP
  // ============================================
  handleScroll();
  handleBackToTopVisibility();

  console.log('🛡️ Proteja-se — Site carregado com sucesso!');
});
