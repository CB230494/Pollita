'use strict';
const yesBtn=document.getElementById('yesBtn');
const noBtn=document.getElementById('noBtn');
const actionArea=document.getElementById('actionArea');
const hint=document.getElementById('hint');
const overlay=document.getElementById('overlay');
const letter=document.getElementById('letter');
const hearts=document.getElementById('hearts');
let attempts=0,lastFocus=null,lastMove=0;
const funHints=['Escoge con el corazón 🤍','¡Uy! Ese botón es muy tímido 😅','Parece que el destino tiene otros planes 💕','Mejor sigue a tu corazón ♥','¡El amor siempre encuentra el camino!'];
function dodge(){
  const now=performance.now();if(now-lastMove<80)return;lastMove=now;
  const area=actionArea.getBoundingClientRect(),bw=yesBtn.offsetWidth,bh=yesBtn.offsetHeight,pad=6;
  let x,y;
  const no=noBtn.getBoundingClientRect();
  for(let i=0;i<40;i++){
    x=pad+Math.random()*Math.max(0,area.width-bw-2*pad);
    y=pad+Math.random()*Math.max(0,area.height-bh-2*pad);
    const r={left:area.left+x,top:area.top+y,right:area.left+x+bw,bottom:area.top+y+bh};
    if(r.right<no.left-12||r.left>no.right+12||r.bottom<no.top-12||r.top>no.bottom+12)break;
  }
  yesBtn.style.left=`${x}px`;yesBtn.style.top=`${y}px`;
  attempts++;hint.textContent=funHints[Math.min(attempts,funHints.length-1)];
}
yesBtn.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen')dodge()});
yesBtn.addEventListener('pointerdown',e=>{e.preventDefault();dodge()});
yesBtn.addEventListener('click',e=>{e.preventDefault();dodge()});
yesBtn.addEventListener('focus',dodge);
// Nearby mouse approach gives the playful escape an early start.
actionArea.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=yesBtn.getBoundingClientRect();const dx=Math.max(r.left-e.clientX,0,e.clientX-r.right),dy=Math.max(r.top-e.clientY,0,e.clientY-r.bottom);if(Math.hypot(dx,dy)<60)dodge()});
function openLetter(){lastFocus=document.activeElement;overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';letter.focus();burst();}
function closeLetter(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
noBtn.addEventListener('click',openLetter);
document.getElementById('closeBtn').addEventListener('click',closeLetter);
document.getElementById('againBtn').addEventListener('click',closeLetter);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeLetter()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeLetter()});
function spawnHeart(){if(document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=document.createElement('span');el.className='float-heart';el.textContent=['♥','♡','✦'][Math.floor(Math.random()*3)];el.style.left=`${Math.random()*100}%`;el.style.fontSize=`${12+Math.random()*20}px`;el.style.animationDuration=`${7+Math.random()*7}s`;hearts.appendChild(el);el.addEventListener('animationend',()=>el.remove(),{once:true});}
function burst(){for(let i=0;i<20;i++)setTimeout(spawnHeart,i*65)}
for(let i=0;i<9;i++)setTimeout(spawnHeart,i*240);setInterval(spawnHeart,750);
