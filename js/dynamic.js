/* dynamic.js — inclinación 3D, halo del cursor y reproducción de videos */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- 1. Tilt 3D suave en las tarjetas ---------- */
  if (!reduceMotion && finePointer) {
    const cards = document.querySelectorAll('.tilt');

    cards.forEach(card => {
      let raf = null;

      const move = e => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);

        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const rx = (0.5 - py) * 7;
          const ry = (px - 0.5) * 7;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.012)`;
        });
      };

      const leave = () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = '';
      };

      card.addEventListener('pointermove', move, { passive: true });
      card.addEventListener('pointerleave', leave);
      card.addEventListener('blur', leave);
    });
  }

  /* ---------- 2. Videos: preview al pasar y modal al hacer clic ---------- */
  const videoCards = document.querySelectorAll('[data-video]');

  videoCards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    // póster del primer frame
    video.addEventListener('loadeddata', () => {
      try { video.currentTime = 0.1; } catch (_) {}
    }, { once: true });

    if (!reduceMotion && finePointer) {
      card.addEventListener('pointerenter', () => {
        video.muted = true;
        const play = video.play();
        if (play?.catch) play.catch(() => {});
        card.classList.add('is-playing');
      });
      card.addEventListener('pointerleave', () => {
        video.pause();
        card.classList.remove('is-playing');
      });
    }

    card.addEventListener('click', () => {
      const source = video.getAttribute('src');
      const title = card.querySelector('h3')?.textContent || '';
      const text = card.querySelector('.caption p')?.textContent || '';
      const code = card.querySelector('.photo-top, .video-top');

      const wrapper = document.createElement('div');
      wrapper.className = 'video-modal-body';

      const player = document.createElement('video');
      player.src = source;
      player.controls = true;
      player.autoplay = true;
      player.playsInline = true;
      player.muted = false;
      player.setAttribute('aria-label', title);
      wrapper.append(player);

      const tag = document.createElement('span');
      tag.className = 'micro';
      tag.textContent = (code?.firstElementChild?.textContent || 'VID') + ' / CLIP GUARDADO';
      const heading = document.createElement('h3');
      heading.id = 'modal-title';
      heading.textContent = title;
      const phrase = document.createElement('p');
      phrase.textContent = text;

      window.openArchiveDialog?.([wrapper, tag, heading, phrase], card);
    });
  });
})();
