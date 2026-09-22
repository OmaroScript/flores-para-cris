const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const messages = [
  ['Mi amor', 'Si volviera a empezar mi historia, te buscaría a ti otra vez.'],
  ['Mi vida', 'Contigo, hasta un día cualquiera se convierte en algo bonito.'],
  ['Hermosa', 'Tu sonrisa tiene esa manera tan tuya de alegrarme el mundo.'],
  ['Preciosa', 'Entre tantas cosas lindas en la vida, tú sigues siendo mi favorita.'],
  ['Mi cielo', 'Gracias por compartir conmigo tus días, tus sueños y tu corazón.'],
  ['Mi todo', 'Este pequeño jardín se acaba, pero mis ganas de amarte, nunca.'],
];
let collected = new Set();
let soundEnabled = false;
let audioContext;
let rainTimer;
let rainStop;
function flower(stem = true, variant = 0) {
  const petals = Array.from({length:12}, (_, i) => `<ellipse cx="60" cy="29" rx="10" ry="24" fill="${i % 2 ? '#f5cb48' : '#eebd32'}" stroke="#dba62d" stroke-width=".5" transform="rotate(${i * 30} 60 60)"/>`).join('');
  return `<svg class="flower-art" viewBox="0 0 120 ${stem ? 280 : 120}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${stem ? `<path d="M60 67 Q${variant % 2 ? 40 : 79} 164 60 280" fill="none" stroke="#71825b" stroke-width="3"/><path d="M62 187 Q15 177 17 137 Q58 142 62 187" fill="#94a174"/><path d="M63 218 Q105 207 103 166 Q70 174 63 218" fill="#7d9163"/>` : ''}<g>${petals}<circle cx="60" cy="60" r="16" fill="#ae7d29"/><circle cx="60" cy="60" r="12" fill="#c49635"/><g fill="#987025"><circle cx="55" cy="55" r="1.5"/><circle cx="64" cy="53" r="1.5"/><circle cx="59" cy="62" r="1.5"/><circle cx="67" cy="63" r="1.5"/><circle cx="54" cy="66" r="1.5"/></g></g></svg>`;
}
[-30,-15,0,16,31].forEach((angle,i) => {
  const element = document.createElement('div');
  element.className = 'stem-flower';
  element.style.cssText = `left:calc(50% - ${window.innerWidth <= 700 ? 57.5 : 80}px);transform:rotate(${angle}deg);height:${[70,84,93,80,66][i]}%;animation-delay:-${i}s`;
  element.innerHTML = flower(true,i);
  $('bouquet').append(element);
});
for(let i=0;i<3;i++){
  const element=document.createElement('div'); element.className='mini-flower';element.innerHTML=flower(false);$('photo-flowers').append(element);
}
function show(id) {
  ['welcome','game','finale'].forEach(name => $(name).hidden = name !== id);
  window.scrollTo({top:0,behavior:'instant'});
}
function chime(index = 0) {
  if (!soundEnabled || !audioContext) return;
  const now = audioContext.currentTime;
  [0,4,7].forEach((offset,i) => {
    const oscillator=audioContext.createOscillator(), gain=audioContext.createGain();
    oscillator.type='sine'; oscillator.frequency.value=261.63 * Math.pow(2,(index+offset)/12);
    gain.gain.setValueAtTime(0,now+i*.09);gain.gain.linearRampToValueAtTime(.055,now+i*.09+.025);gain.gain.exponentialRampToValueAtTime(.001,now+i*.09+1.1);
    oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(now+i*.09);oscillator.stop(now+i*.09+1.2);
  });
}
function resetGarden() {
  collected = new Set(); $('garden').replaceChildren(); $('dots').replaceChildren(); $('counter').textContent='0 de 6 flores';
  $('message-name').textContent='Mi amor…';$('message-text').textContent='Cada flor tiene algo que decirte.';$('reveal').hidden=true;
  messages.forEach(([name,message],index) => {
    const dot=document.createElement('span');dot.className='dot';$('dots').append(dot);
    const button=document.createElement('button');button.className='pick';button.setAttribute('aria-label',`Recoger flor ${index+1}`);button.innerHTML=flower(true,index);
    button.addEventListener('click',() => {
      if(collected.has(index)) return;
      collected.add(index);button.classList.add('collected');button.setAttribute('aria-disabled','true');button.setAttribute('aria-label',`Flor ${index+1} recogida`);
      dot.classList.add('filled');$('counter').textContent=`${collected.size} de 6 flores`;$('message-name').textContent=`${name}…`;$('message-text').textContent=message;chime(index*2);
      if(collected.size === messages.length) $('reveal').hidden=false;
    });
    $('garden').append(button);
  });
}
function dropFlower() {
  const element=document.createElement('span');element.className='falling';const size=25+Math.random()*35;
  element.style.cssText=`left:${Math.random()*100}%;width:${size}px;height:${size}px;animation-duration:${6+Math.random()*5}s;--drift:${Math.random()*180-90}px;--spin:${Math.random()*540-270}deg;--rest:${Math.random()*100}%`;
  element.innerHTML=flower(false);$('confetti').append(element);element.addEventListener('animationend',()=>element.remove(),{once:true});
}
function stopRain(){clearInterval(rainTimer);clearTimeout(rainStop);$('confetti').replaceChildren();}
$('start').addEventListener('click',()=>{resetGarden();show('game');$('garden').querySelector('button').focus({preventScroll:true});});
$('reveal').addEventListener('click',()=>{
  show('finale');$('final-title').focus({preventScroll:true});chime(7);stopRain();
  if(reducedMotion.matches){for(let i=0;i<16;i++)dropFlower();return;}
  for(let i=0;i<14;i++)dropFlower();rainTimer=setInterval(dropFlower,230);rainStop=setTimeout(()=>clearInterval(rainTimer),24000);
});
$('restart').addEventListener('click',()=>{stopRain();resetGarden();show('game');$('garden').querySelector('button').focus({preventScroll:true});});
$('sound').addEventListener('click',async()=>{
  try{if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();await audioContext.resume();soundEnabled=!soundEnabled;$('sound').textContent=`Sonido: ${soundEnabled?'encendido':'apagado'}`;$('sound').setAttribute('aria-pressed',String(soundEnabled));$('sound').setAttribute('aria-label',soundEnabled?'Desactivar sonido':'Activar sonido');if(soundEnabled)chime();}
  catch{$('sound').textContent='Sonido no disponible';$('sound').disabled=true;}
});
