// Project page motion: hero image carousel
(() => {
  const container = document.querySelector('.project-media');
  const img = document.getElementById('projectHeroImage');
  if (!img) return;

  const page = document.body?.dataset?.project;

  const sourcesByProject = {
    xr: [
      'images/xr1.png',
      'images/xr2.png',
      'images/xr3.png',
      'images/xr4.png'
    ],
    boba: [
      'images/bobaf2.png'
    ]
  };

  const sources = sourcesByProject[page] || sourcesByProject.xr;
  let index = Math.max(0, sources.indexOf(img.getAttribute('src')));

  // Preload images
  sources.forEach((src) => {
    const pre = new Image();
    pre.src = src;
  });

  // Smooth fade
  img.style.transition = 'opacity 500ms ease';
  img.style.opacity = '1';

  const goNext = () => {
    if (sources.length <= 1) return;

    index = (index + 1) % sources.length;
    img.style.opacity = '0';

    window.setTimeout(() => {
      img.src = sources[index];
      img.style.opacity = '1';
    }, 260);
  };

  // Auto-advance every 4 seconds (only if multiple images)
  let timer = null;
  if (sources.length > 1) {
    timer = window.setInterval(goNext, 4000);
  }

  const openFullscreenImage = () => {
    const src = img.currentSrc || img.src;
    if (!src) return;

    // Always use overlay lightbox (best UX: consistent close ✕, ESC, click outside)
    let overlay = document.querySelector('.image-lightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'image-lightbox';
      overlay.innerHTML = `
        <button class="image-lightbox-close" type="button" aria-label="Lukk">✕</button>
        <img class="image-lightbox-img" alt="" />
      `;
      document.body.appendChild(overlay);

      const close = () => {
        overlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      };

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });

      overlay.querySelector('.image-lightbox-close')?.addEventListener('click', close);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
      });
    }

    const overlayImg = overlay.querySelector('.image-lightbox-img');
    if (overlayImg) {
      overlayImg.src = src;
      overlayImg.alt = img.alt || 'Bilde';
    }

    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  };

  // Click (and keyboard) behavior
  if (container) {
    const restart = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = window.setInterval(goNext, 4000);
    };

    const onActivate = () => {
      if (page === 'boba') {
        openFullscreenImage();
        return;
      }

      goNext();
      restart();
    };

    container.addEventListener('click', onActivate);

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    });
  }
})();

// Scroll reveal (fade/slide in on view)
(() => {
  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodes = Array.from(
    document.querySelectorAll(
      [
        /* removed: '.project-embed' */
        '.project-process-figure',
        '.project-process-text',
        '.project-persona',
        '.site-footer'
      ].join(',')
    )
  );

  if (!nodes.length) return;

  // Add baseline class
  nodes.forEach((el) => el.classList.add('reveal'));

  // Stagger within the process section
  nodes.forEach((el, i) => {
    const isProcessChild = el.closest && el.closest('.project-process');
    const delay = isProcessChild ? Math.min(i, 8) * 90 : 0;
    el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.setAttribute('data-reveal-delay', '');
  });

  if (prefersReduced) {
    nodes.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
  );

  nodes.forEach((el) => io.observe(el));
})();
