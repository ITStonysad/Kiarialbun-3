(() => {
  if ('IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
  }

  const progress = document.querySelector('.scroll-progress');
  const updateProgress = () => {
    if (!progress) return;
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${total > 0 ? scrollY / total * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  const dialog = document.querySelector('#archive-dialog');
  const content = document.querySelector('#modal-content');
  let opener;
  window.openArchiveDialog = (elements, trigger) => {
    opener = trigger;
    content.replaceChildren(...elements);
    dialog.showModal();
    document.body.classList.add('modal-open');
  };
  dialog?.querySelector('.close-modal')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    content.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
    opener?.focus({ preventScroll:true });
  });

  document.querySelectorAll('.letter-card').forEach(card => card.addEventListener('click', () => {
    const code = document.createElement('span'); code.className='micro'; code.textContent='MI NIÑA K <3';
    const title = document.createElement('h3'); title.id='modal-title'; title.textContent=card.dataset.title;
    const message = document.createElement('p'); message.textContent=card.dataset.message;
    const end = document.createElement('span'); end.className='signature'; end.textContent='Para que la abras cuando la necesites. ✦';
    window.openArchiveDialog([code,title,message,end], card);
  }));

  const finalEnvelope = document.querySelector('#final-envelope');
  const finalButton = document.querySelector('#open-final-letter');
  const finalEnd = document.querySelector('#final-end-message');
  const skipButton = document.querySelector('#skip-typing');

  function speedFor(line, text) {
    // párrafos largos se escriben más rápido para no hacer la espera eterna
    const len = (text || '').length;
    if (line.tagName === 'H3') return 26;
    if (line.tagName === 'BLOCKQUOTE') return 22;
    if (line.classList.contains('signature')) return 30;
    if (len > 600) return 4;
    if (len > 300) return 6;
    return 9;
  }

  function startTypewriter() {
    const lines = Array.from(finalEnvelope?.querySelectorAll('.envelope-letter .line') || []);
    const queue = lines.map(line => {
      if (line.classList.contains('letter-divider')) return { line, text: '', typed: null };
      const text = line.textContent;
      line.textContent = '';
      line.classList.add('auto-line');
      const typed = document.createElement('span');
      typed.className = 'typed';
      const caret = document.createElement('span');
      caret.className = 'auto-caret';
      line.append(typed, caret);
      return { line, text, typed };
    });

    let i = 0, skipped = false, timer = null;

    function onDone() {
      skipButton.disabled = true;
      skipButton.textContent = 'CARTA ESCRITA ✦';
      setTimeout(() => {
        finalEnd.hidden = false;
        finalEnd.querySelectorAll('.reveal').forEach((item, index) => {
          setTimeout(() => item.classList.add('visible'), 120 * index);
        });
        finalEnd.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 700);
    }

    function typeNext() {
      if (skipped) return;
      if (i >= queue.length) { onDone(); return; }
      const { line, text, typed } = queue[i];
      line.classList.add('show');
      if (!typed) { line.classList.add('is-done'); i++; timer = setTimeout(typeNext, 160); return; }
      // mantén visible la línea que se está escribiendo
      const box = finalEnvelope?.querySelector('.envelope-letter');
      if (box) {
        const target = line.offsetTop - box.clientHeight * .45;
        if (line.offsetTop + line.offsetHeight > box.scrollTop + box.clientHeight - 60) {
          box.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
        }
      }
      const speed = speedFor(line, text);
      let c = 0;
      (function typeChar() {
        if (skipped) return;
        c++;
        typed.textContent = text.slice(0, c);
        if (c < text.length) timer = setTimeout(typeChar, speed);
        else { line.classList.add('is-done'); i++; timer = setTimeout(typeNext, 260); }
      })();
    }

    function finishInstantly() {
      skipped = true;
      clearTimeout(timer);
      queue.forEach(({ line, text, typed }) => {
        if (typed) typed.textContent = text;
        line.classList.add('show', 'is-done');
      });
      onDone();
    }

    skipButton.disabled = false;
    skipButton.textContent = 'SALTAR LA ESCRITURA ✦';
    skipButton.onclick = finishInstantly;
    typeNext();
  }

  finalButton?.addEventListener('click', () => {
    if (finalEnvelope?.classList.contains('is-open')) return;
    finalEnvelope?.classList.add('is-open');
    finalButton.disabled = true;
    finalButton.textContent = 'CARTA ABIERTA ✦';

    setTimeout(() => {
      finalEnvelope?.querySelector('.envelope-letter')?.scrollTo({ top: 0, behavior: 'smooth' });
      startTypewriter();
    }, 900);
  });
})();

