document.querySelectorAll('.evidence').forEach(card => {
  card.addEventListener('click', () => {
    const image = card.querySelector('img').cloneNode(); image.loading = 'eager';
    const detail = card.querySelector('.detail');
    const code = document.createElement('span');
    code.className = 'micro';
    code.textContent = detail?.textContent?.trim() || 'UN RECUERDO PARA TI';
    const title = document.createElement('h3');
    title.id = 'modal-title';
    title.textContent = card.querySelector('h3').textContent;
    const phrase = document.createElement('p');
    phrase.textContent = card.querySelector('.caption p').textContent;
    window.openArchiveDialog([image, code, title, phrase], card);
  });
});
