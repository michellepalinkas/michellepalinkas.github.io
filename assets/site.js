(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

/* ---- entrance + glitch ---- */
let entered=false;
const go=()=>{if(entered)return;entered=true;requestAnimationFrame(()=>document.documentElement.classList.add('loaded'));
  if(!reduce){const gl=$$('.glitch');setTimeout(()=>gl.forEach(g=>{g.classList.remove('run');void g.offsetWidth;g.classList.add('run')}),1300);
  $('#heroName').addEventListener('pointerenter',()=>gl.forEach(g=>{g.classList.remove('run');void g.offsetWidth;g.classList.add('run')}))}};
if(document.readyState==='complete') go(); else addEventListener('load',go);
setTimeout(go,1600);

/* ---- nav ---- */
const nav=$('#nav');
const mb=$('#menuBtn'),menu=$('#menu');
mb.addEventListener('click',()=>{const o=mb.getAttribute('aria-expanded')!=='true';mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu');menu.classList.toggle('open',o);document.body.style.overflow=o?'hidden':''});
$$('#menu a').forEach(a=>a.addEventListener('click',()=>{if(mb.getAttribute('aria-expanded')==='true')mb.click()}));

/* ---- maroon smoke (replaces the light strands) ---- */
function smoke(c){
  const ctx=c.getContext('2d');let w,h,t=Math.random()*1000,vis=true;
  const blobs=[...Array(7)].map((_,i)=>({px:Math.random()*6.28,py:Math.random()*6.28,sx:.05+Math.random()*.08,sy:.04+Math.random()*.07,ax:.32+Math.random()*.18,ay:.28+Math.random()*.2,cx:.45+Math.random()*.4,cy:.3+Math.random()*.5,r:.28+Math.random()*.26,c:i%3===0?'242,36,61':(i%3===1?'122,10,24':'60,6,14'),a:i%3===0?.2:.5}));
  function size(){w=c.clientWidth;h=c.clientHeight;c.width=Math.max(1,w/2);c.height=Math.max(1,h/2);ctx.setTransform(.5,0,0,.5,0,0)}
  function frame(){
    ctx.clearRect(0,0,w,h);
    for(const b of blobs){const x=w*(b.cx+Math.sin(t*b.sx+b.px)*b.ax*.5),y=h*(b.cy+Math.cos(t*b.sy+b.py)*b.ay*.5),r=Math.max(w,h)*b.r;
      const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${b.c},${b.a})`);g.addColorStop(1,`rgba(${b.c},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
    t+=.016;if(!reduce&&vis)requestAnimationFrame(frame)}
  size();addEventListener('resize',()=>{size();frame()});
  new IntersectionObserver(([e])=>{const was=vis;vis=e.isIntersecting;if(vis&&!was&&!reduce)requestAnimationFrame(frame)}).observe(c);
  frame();
}
smoke($('#smoke'));

/* ---- magnetic buttons ---- */
if(!reduce&&matchMedia('(hover:hover)').matches){
  $$('.magnetic').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.16}px,${(e.clientY-r.top-r.height/2)*.26}px)`});
    b.addEventListener('pointerleave',()=>{b.style.transform=''});
  });
}
$$('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}));

/* ---- reveal on enter ---- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -8% 0px'});
$$('[data-fade],.clip').forEach(el=>io.observe(el));
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target._rv.classList.add('in');rio.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px -10% 0px'});
$$('[data-reveal]').forEach(el=>{const p=el.parentElement;p._rv=el;rio.observe(p)});

/* ---- word highlight ---- */
const wf=$('#wordfx');let ws=[];
if(wf){
  const parts=wf.textContent.split(/(\*[^*]+\*)/);wf.innerHTML='';
  parts.forEach(p=>{const hot=p.startsWith('*');(hot?p.slice(1,-1):p).split(/(\s+)/).forEach(tok=>{if(!tok||/^\s+$/.test(tok)){wf.append(tok);return}const s=document.createElement('span');s.className='w'+(hot?' hot':'');s.textContent=tok;wf.append(s)})});
  ws=$$('.w',wf); if(reduce) ws.forEach(w=>w.classList.add('on'));
}

/* ---- odometer counters ---- */
$$('[data-roll]').forEach(el=>{
  const val=el.dataset.roll;el.setAttribute('role','img');el.setAttribute('aria-label',val);el.classList.add('roll');const cols=[];
  [...val].forEach((ch,i)=>{
    if(!/\d/.test(ch)){const s=document.createElement('span');s.textContent=ch;el.append(s);return}
    const col=document.createElement('span');col.className='col';const d=+ch,loops=2+(val.length-i);let html='';
    for(let k=0;k<=loops*10+d;k++)html+=`<span>${k%10}</span>`;col.innerHTML=html;col.dataset.end=loops*10+d;
    col.style.transform=`translateY(-${(loops*10+d)*.9}em)`;el.append(col);cols.push(col);
  });
  if(reduce)return;
  cols.forEach(c=>c.style.transform=`translateY(-${(c.dataset.end%10)*.9}em)`);
  new IntersectionObserver(([e],o)=>{if(!e.isIntersecting)return;o.disconnect();
    cols.forEach((c,i)=>requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.transition=`transform ${1.6+i*.25}s cubic-bezier(.2,.7,.1,1)`;c.style.transform=`translateY(-${c.dataset.end*.9}em)`})));
  },{threshold:.6}).observe(el);
});

/* ---- horizontal pinned featured work ---- */
const hs=$('#work'),track=$('#track'),bar=$('#hsBar');
const wide=matchMedia('(min-width:1025px)');
function fitsPin(){hs.classList.add('pinned');const pin=hs.querySelector('.pin');const ok=pin.scrollHeight<=innerHeight+2;return ok}
function setupHS(){
  if(wide.matches&&!reduce&&fitsPin()){hs.classList.add('pinned');const dist=Math.max(0,track.scrollWidth-innerWidth);hs.style.height=(innerHeight+dist)+'px';hs.dataset.dist=dist}
  else{hs.classList.remove('pinned');hs.style.height='';track.style.transform=''}
}
setupHS();addEventListener('resize',setupHS);wide.addEventListener('change',setupHS);
addEventListener('load',setupHS);

/* ---- marquee driven by time + scroll velocity ---- */
const mq=$('#marq');mq.innerHTML+=mq.innerHTML;$$('span',mq).slice(8).forEach(s=>s.setAttribute('aria-hidden','true'));
let mx=0,lastY=scrollY,vel=0;

/* ---- scroll engine ---- */
const awWords=$$('.aw-word'),awSec=$('#awards');
const portrait=$('#portrait'),heroCopy=$('#heroCopy'),roles=$('#roles'),wire=$('#wire'),roleEls=$$('.role'),ctLines=$$('#ct-h .l');
function tick(){
  const y=scrollY,vh=innerHeight;
  nav.classList.toggle('scrolled',y>30);
  vel+=((y-lastY)-vel)*.12;lastY=y;
  if(!reduce){
    // hero parallax out
    const hp=clamp(y/vh);
    heroCopy.style.transform=`translateY(${hp*-70}px)`;heroCopy.style.opacity=1-hp*1.1;
    // marquee
    mx-=.6+Math.abs(vel)*.35;const half=mq.scrollWidth/2;if(-mx>half)mx+=half;
    mq.style.transform=`translateX(${mx}px) skewX(${clamp(-vel*.25,-12,12)}deg)`;
    // word highlight
    if(ws.length){const r=wf.getBoundingClientRect();const p=clamp((vh*.85-r.top)/(r.height+vh*.3));const n=Math.round(p*ws.length);for(let i=0;i<ws.length;i++)ws[i].classList.toggle('on',i<n)}
    // pinned horizontal
    if(hs.classList.contains('pinned')){const r=hs.getBoundingClientRect();const dist=+hs.dataset.dist;const p=clamp(-r.top/Math.max(1,dist));track.style.transform=`translateX(${-p*dist}px)`;bar.style.setProperty('--p',p)}
    // experience wire
    const rr=roles.getBoundingClientRect();const wp=clamp((vh*.6-rr.top)/rr.height);wire.style.setProperty('--p',wp);
    roleEls.forEach(el=>{el.classList.toggle('lit',el.getBoundingClientRect().top<vh*.6)});
    const ar=awSec.getBoundingClientRect();const ap=clamp((vh-ar.top)/(vh+ar.height));awWords.forEach(l=>{l.style.transform=`translateX(${(ap-.5)*l.dataset.x*-30}vw)`});
    // contact lines slide in from opposite sides
    const cr=$('#contact').getBoundingClientRect();const cp=clamp(1-(cr.top/vh));ctLines.forEach(l=>{l.style.transform=`translateX(${(1-cp)*l.dataset.x*18}vw)`});
  }
  requestAnimationFrame(tick);
}
if(reduce){addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});roleEls.forEach(r=>r.classList.add('lit'));wire.style.setProperty('--p',1)}
else requestAnimationFrame(tick);

/* ---- smooth anchor scroll ---- */
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2||a.id==='watchBtn')return;const t=$(id);if(!t)return;e.preventDefault();t.scrollIntoView({behavior:reduce?'auto':'smooth'});history.replaceState(null,'',id)}));

/* ---- film: click to load the YouTube player ---- */
const film=$('#film');
{const im=new Image();im.onload=()=>{if(im.naturalWidth<200)film.classList.add('noposter')};im.onerror=()=>film.classList.add('noposter');im.src='https://i.ytimg.com/vi/'+film.dataset.yt+'/maxresdefault.jpg'}
function playFilm(){if(film.querySelector('iframe'))return;film.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${film.dataset.yt}?autoplay=1&rel=0" title="The Optical Frontier" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`}
film.addEventListener('click',playFilm);


/* ---- inline YouTube players on work cards ---- */
document.addEventListener('click',e=>{const v=e.target.closest('[data-yt-inline]');if(!v||v.querySelector('iframe'))return;v.insertAdjacentHTML('beforeend',`<iframe src="https://www.youtube-nocookie.com/embed/${v.dataset.ytInline}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`)});

/* ---- official award art: shown when the file exists ---- */
$$('.aw-art img').forEach(im=>{const ok=()=>im.parentElement.classList.add('has-img');if(im.complete){if(im.naturalWidth)ok();else im.remove()}else{im.addEventListener('load',ok);im.addEventListener('error',()=>im.remove())}});

/* ---- scroll scenes: kinetic hero type, film frames, 12 days rows, parallax ---- */
const kRows=$$('.k-row'),frSec=$('#frames'),frImgs=$$('.frame-stack img'),frCount=$('#frCount'),frBar=$('#frBar'),dSec=$('#days'),dA=$('#dRowA'),dB=$('#dRowB'),pars=$$('[data-par]');let frI=0;
function scenes(){
  const vh=innerHeight;
  if(!reduce){
    kRows.forEach((r,i)=>{r.style.translate=`${(i%2?1:-1)*scrollY*.35}px 0`});
    const fr=frSec.getBoundingClientRect(),fp=clamp(-fr.top/Math.max(1,fr.height-vh)),idx=Math.min(frImgs.length-1,Math.floor(fp*frImgs.length));
    if(idx!==frI){frImgs[frI].classList.remove('on');frImgs[idx].classList.add('on');frI=idx;frCount.textContent=String(idx+1).padStart(2,'0')}
    frBar.style.setProperty('--p',fp);
    const dr=dSec.getBoundingClientRect(),dp=clamp((vh-dr.top)/(vh+dr.height));const ra=Math.max(0,dA.scrollWidth-innerWidth),rb=Math.max(0,dB.scrollWidth-innerWidth);
    dA.style.transform=`translateX(${-dp*ra}px)`;dB.style.transform=`translateX(${-(1-dp)*rb}px)`;
    pars.forEach(p=>{const r=p.getBoundingClientRect();const off=(r.top+r.height/2-vh/2);p.style.transform=`translateY(${off*-(+p.dataset.par)}px)`});
  }
  requestAnimationFrame(scenes);
}
requestAnimationFrame(scenes);

/* ---- gallery ---- */
const tiles=$$('.tile'),labels={'3d':'3D character','tv':'Games and TV','viz':'Visualization','art':'Illustration','brand':'Logos and print'};
tiles.forEach((t,i)=>{t.innerHTML=`<img src="assets/work/${t.dataset.src}-sm.jpg" alt="${t.dataset.t}" loading="lazy" decoding="async"><span class="meta"><small>${labels[t.dataset.c]}</small><b>${t.dataset.t}</b></span>`;t.setAttribute('aria-label','Open '+t.dataset.t);if(i>=15)t.classList.add('more')});
const tio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');tio.unobserve(e.target)}}),{threshold:.1});
tiles.forEach(t=>tio.observe(t));
const g=$('#gallery'),mbtn=$('#moreBtn');
mbtn.addEventListener('click',()=>{const o=!g.classList.contains('all');g.classList.toggle('all',o);mbtn.setAttribute('aria-expanded',o);mbtn.textContent=o?'Show less':'Show all work';if(!o)$('#portfolio').scrollIntoView()});
$$('.filters button').forEach(b=>b.addEventListener('click',()=>{
  $$('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const f=b.dataset.f;tiles.forEach(t=>t.classList.toggle('hide',f!=='all'&&t.dataset.c!==f));
  if(f!=='all'){g.classList.add('all');mbtn.parentElement.hidden=true}else{g.classList.remove('all');mbtn.parentElement.hidden=false;mbtn.setAttribute('aria-expanded',false);mbtn.textContent='Show all work'}
}));
const lb=$('#lb'),li=$('#lbImg');let cur=0,last=null;
const shown=()=>tiles.filter(t=>t.offsetParent!==null);
function show(i){const v=shown();cur=(i+v.length)%v.length;const t=v[cur];li.removeAttribute('width');li.removeAttribute('height');li.src=`assets/work/${t.dataset.src}.jpg`;li.alt=t.dataset.t;$('#lbT').textContent=t.dataset.t;$('#lbS').textContent=t.dataset.s}
function open(t){last=t;show(shown().indexOf(t));lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#lbX').focus()}
function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';last&&last.focus()}
tiles.forEach(t=>t.addEventListener('click',()=>open(t)));
$('#lbX').onclick=close;$('#lbP').onclick=()=>show(cur-1);$('#lbN').onclick=()=>show(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='FIGURE')close()});
addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1);
  if(e.key==='Tab'){const f=$$('button',lb);const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
})();