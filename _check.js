const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');
['div', 'section', 'button', 'main', 'video', 'p', 'h3', 'span', 'a'].forEach(t => {
  const o = (src.match(new RegExp('<' + t + '(?=[ >])', 'g')) || []).length;
  const c = (src.match(new RegExp('</' + t + '>', 'g')) || []).length;
  console.log(t.padEnd(8), String(o).padStart(4), String(c).padStart(4), o === c ? 'OK' : 'MISMATCH');
});
const imgs = [...src.matchAll(/src="images\/([^"]+)"/g)].map(m => m[1]);
const missing = [...new Set(imgs)].filter(f => !fs.existsSync('images/' + f));
console.log('\nmedia referenciados:', new Set(imgs).size, '| faltantes:', missing.length ? missing : 'ninguno');
