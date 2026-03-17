/* ================================
   KAMBETWINS GALLERY — Main Script
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeaderScroll();
  initHamburgerMenu();
  initSmootherScroll();
  initLightbox();
  initParticles();
  initCinematicReveal();
  initProfileLangToggle();
});

/* --------------------------------
   Global Language Toggle (EN/JP)
   -------------------------------- */
function initProfileLangToggle() {
  const allLangBtns = document.querySelectorAll('.nav-lang-btn');
  
  allLangBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      
      // Update ALL nav-lang-btn states (desktop + mobile)
      document.querySelectorAll('.nav-lang-btn').forEach((b) => {
        b.classList.toggle('nav-lang-btn--active', b.dataset.lang === lang);
      });

      // Toggle all lang-en / lang-ja elements
      document.querySelectorAll('.lang-en').forEach((el) => {
        el.hidden = lang !== 'en';
      });
      document.querySelectorAll('.lang-ja').forEach((el) => {
        el.hidden = lang !== 'ja';
      });
    });
  });
}

/* --------------------------------
   Scroll Reveal (IntersectionObserver)
   -------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* --------------------------------
   Cinematic Gallery Reveal
   -------------------------------- */
function initCinematicReveal() {
  const items = document.querySelectorAll('.cinematic-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optional: we can keep observing if we want to reverse animation on scroll up,
          // but unobserving makes it performant like Apple (once it's in, it's in).
        } else {
          // Re-hide when scrolling far away for replayability
          if (entry.boundingClientRect.top > window.innerHeight) {
            entry.target.classList.remove('revealed');
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

/* --------------------------------
   Header scroll state
   -------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll class
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav(sections, navLinks);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function updateActiveNav(sections, links) {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  // Highlight the last section if scrolled to the very bottom
  if ((window.innerHeight + Math.round(window.scrollY)) >= document.documentElement.scrollHeight - 5) {
    if (sections.length > 0) {
      current = sections[sections.length - 1].getAttribute('id');
    }
  }

  links.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------
   Hamburger menu
   -------------------------------- */
function initHamburgerMenu() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  const menuLinks = menu.querySelectorAll('.mobile-menu__link');

  const toggle = (open) => {
    const isOpen = typeof open === 'boolean' ? open : !menu.classList.contains('open');
    btn.classList.toggle('active', isOpen);
    menu.classList.toggle('open', isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  };

  btn.addEventListener('click', () => toggle());

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      toggle(false);
    }
  });
}

/* --------------------------------
   Smoother scroll with offset
   -------------------------------- */
function initSmootherScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height')
      );
      const offset = headerH || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* --------------------------------
   Lightbox
   -------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('.gallery-trigger');
  const galleryContainer = document.getElementById('lightbox-gallery');
  const lightboxTitle = document.getElementById('lightbox-title');

  const openLightbox = (type) => {
    // Generate placeholder items
    galleryContainer.innerHTML = '';
    const title = type === 'ai' ? 'AI KAMBE GALLERY' : 'AO KAMBE GALLERY';
    lightboxTitle.textContent = title;

    // Create 10 gallery image items from actual files
    for (let i = 1; i <= 10; i++) {
        const item = document.createElement('div');
        item.className = 'lightbox__item';
        const img = document.createElement('img');
        img.src = `assets/images/gallery/${type}/gallery_${type}_${i}.webp`;
        img.alt = `${type.toUpperCase()} KAMBE ${i}`;
        img.className = 'lightbox__item-img';
        img.loading = 'lazy';
        item.appendChild(img);
        galleryContainer.appendChild(item);
    }

    lightbox.hidden = false;
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });
    document.body.classList.add('menu-open');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightbox.hidden = true;
    }, 350);
    document.body.classList.remove('menu-open');
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const type = trigger.getAttribute('data-gallery');
        openLightbox(type);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    // Only close if clicking the backdrop, not the header/content
    if (e.target === lightbox || e.target.classList.contains('lightbox__content')) {
        closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}



/* --------------------------------
   Blue sparkle effect (site-wide)
   -------------------------------- */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sparkle-canvas';
  canvas.style.cssText =
    'position:fixed;inset:0;z-index:9999;pointer-events:none;width:100%;height:100%;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  const PARTICLE_COUNT = 60;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };

  const createParticles = () => {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.3 + 0.1),
        baseAlpha: Math.random() * 0.5 + 0.2,
        alpha: 0,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: 210 + Math.random() * 15 - 7, // Theme blue hue (203~218)
      });
    }
  };

  let time = 0;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    time += 1;

    particles.forEach((p) => {
      // Twinkle animation
      p.alpha = p.baseAlpha * (0.4 + 0.6 * Math.abs(Math.sin(time * p.twinkleSpeed + p.twinkleOffset)));

      // Draw glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      gradient.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.alpha * 0.6})`);
      gradient.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw bright center
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${p.alpha})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    });

    requestAnimationFrame(draw);
  };

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}
