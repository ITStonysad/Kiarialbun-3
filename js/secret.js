const ACCESS_CODE = 'k<3>';
document.querySelector('#secret-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#access-code');
  const result = document.querySelector('#access-result');
  const letter = document.querySelector('#secret-letter');
  const granted = input.value.trim().toLowerCase() === ACCESS_CODE;
  result.textContent = granted ? 'ACCESO CONCEDIDO ✦' : 'CÓDIGO INCORRECTO';
  result.className = 'micro ' + (granted ? 'granted' : 'denied');
  input.setAttribute('aria-invalid', String(!granted));
  letter.hidden = !granted;
  if (granted) { input.value=''; setTimeout(()=>letter.scrollIntoView({behavior:'smooth',block:'center'}),120); }
});
