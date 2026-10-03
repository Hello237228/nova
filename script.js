/**
 * NOVAFLOW INTERACTIVE SCRIPTS
 * Comprehensive client-side logic for responsive interactions,
 * animations, theme toggling, form validation, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollHeader();
  initActiveNavSpy();
  initScrollReveal();
  initStatsCounter();
  initHeroTilt();
  initFeatureTabs();
  initModal();
  initContactForm();
  initBackToTop();
});

/* ========================================================
   1. THEME TOGGLER (DARK / LIGHT MODE)
   ======================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('novaflow_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('novaflow_theme', nextTheme);
      
      showToast('Theme Changed', `Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} mode`, 'info');
    });
  }
}

/* ========================================================
   2. MOBILE NAVIGATION DRAWER
   ======================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link, #mobile-cta-btn');

  if (!menuBtn || !drawer) return;

  function toggleMenu(isOpen) {
    const state = typeof isOpen === 'boolean' ? isOpen : !drawer.classList.contains('open');
    drawer.classList.toggle('open', state);
    menuBtn.setAttribute('aria-expanded', state ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', state ? 'false' : 'true');
    
    // Lock body scroll on mobile when drawer is active
    document.body.style.overflow = state ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', () => toggleMenu());

  // Close when tapping any link
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when resizing window to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ========================================================
   3. STICKY HEADER & SCROLL BEHAVIOR
   ======================================================== */
function initScrollHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ========================================================
   4. ACTIVE NAVIGATION LINK SPY
   ======================================================== */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !desktopNavLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => spyObserver.observe(section));
}

/* ========================================================
   5. INTERSECTION OBSERVER SCROLL REVEAL
   ======================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay, 10));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ========================================================
   6. ANIMATED STATISTICS COUNTER
   ======================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;
  const statsContainer = document.querySelector('.stats-counter-grid');

  if (!statsContainer) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const decimals = parseInt(stat.getAttribute('data-decimals') || '0', 10);
          const duration = 2000;
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const counterInterval = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentVal = target * progress;
            stat.textContent = currentVal.toFixed(decimals);

            if (frame >= totalFrames) {
              stat.textContent = target.toFixed(decimals);
              clearInterval(counterInterval);
            }
          }, frameDuration);
        });
      }
    });
  }, { threshold: 0.25 });

  counterObserver.observe(statsContainer);

  function easeOutQuad(t) {
    return t * (2 - t);
  }
}

/* ========================================================
   7. 3D HERO MOCKUP TILT EFFECT & FEATURE CARDS TILT
   ======================================================== */
function initHeroTilt() {
  const mockup = document.getElementById('hero-mockup-frame');
  if (mockup && window.innerWidth > 1024) {
    mockup.addEventListener('mousemove', (e) => {
      const rect = mockup.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      mockup.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    mockup.addEventListener('mouseleave', () => {
      mockup.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // Feature cards subtle tilt
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const light = card.querySelector('.card-ambient-light');
      if (light) {
        light.style.transform = `translate(${x - rect.width / 2}px, ${y - rect.height / 2}px)`;
      }
    });
  });
}

/* ========================================================
   8. INTERACTIVE FEATURE CODE DEMO TABS
   ======================================================== */
function initFeatureTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const codeBlocks = document.querySelectorAll('.code-block');

  if (!tabBtns.length || !codeBlocks.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      codeBlocks.forEach(block => block.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const activeBlock = document.getElementById(targetId);
      if (activeBlock) {
        activeBlock.classList.add('active');
      }
    });
  });
}

/* ========================================================
   9. INTERACTIVE PRODUCT TOUR MODAL
   ======================================================== */
function initModal() {
  const modal = document.getElementById('demo-modal');
  const openBtn = document.getElementById('hero-demo-btn');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalActionBtn = document.getElementById('modal-primary-action');

  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close when clicking modal backdrop outside content card
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close with Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (modalActionBtn) {
    modalActionBtn.addEventListener('click', () => {
      closeModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ========================================================
   10. CONTACT FORM VALIDATION & SUBMISSION
   ======================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const consentCheck = document.getElementById('contact-consent');
  const submitBtn = document.getElementById('contact-submit-btn');
  const charCounter = document.getElementById('char-counter');

  if (!form) return;

  // Real-time character counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len >= 480) {
        charCounter.style.color = 'var(--accent-amber)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Real-time validation clear on input
  [nameInput, emailInput, messageInput].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
      const errEl = document.getElementById(`${field.name}-error`);
      if (errEl) errEl.classList.remove('visible');
    });
  });

  if (consentCheck) {
    consentCheck.addEventListener('change', () => {
      const errEl = document.getElementById('consent-error');
      if (errEl) errEl.classList.remove('visible');
    });
  }

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput, 'name-error');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      setError(emailInput, 'email-error');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError(messageInput, 'message-error');
      isValid = false;
    }

    // Validate Consent
    if (!consentCheck.checked) {
      const consentErr = document.getElementById('consent-error');
      if (consentErr) consentErr.classList.add('visible');
      isValid = false;
    }

    if (!isValid) {
      showToast('Validation Error', 'Please check the highlighted fields above.', 'error');
      return;
    }

    // Simulate submission with button loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      
      const userName = nameInput.value.trim().split(' ')[0] || 'Friend';
      showToast(
        'Request Received!',
        `Thank you, ${userName}! A NovaFlow solutions architect will email you within 15 minutes.`,
        'success'
      );

      form.reset();
      if (charCounter) charCounter.textContent = '0 / 500';
    }, 1200);
  });

  function setError(inputEl, errorId) {
    inputEl.classList.add('is-invalid');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.classList.add('visible');
    inputEl.focus();
  }
}

/* ========================================================
   11. TOAST NOTIFICATION UTILITY
   ======================================================== */
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSvg = type === 'success' 
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div>
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 4500);
}

/* ========================================================
   12. BACK TO TOP BUTTON
   ======================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
