window.siteReady=true;
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

/* ---- entrance + glitch ---- */
let entered=false;
const go=()=>{if(entered)return;entered=true;requestAnimationFrame(()=>document.documentElement.classList.add('loaded'))};
if(document.readyState==='complete') go(); else addEventListener('load',go);
setTimeout(go,1600);

/* ---- nav ---- */
const nav=$('#nav');
const mb=$('#menuBtn'),menu=$('#menu');
mb.addEventListener('click',()=>{const o=mb.getAttribute('aria-expanded')!=='true';mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu');menu.classList.toggle('open',o);document.body.style.overflow=o?'hidden':''});
$$('#menu a').forEach(a=>a.addEventListener('click',()=>{if(mb.getAttribute('aria-expanded')==='true')mb.click()}));
mb.addEventListener('click',()=>{if(mb.getAttribute('aria-expanded')==='true')setTimeout(()=>$('#menu a').focus(),50)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&mb.getAttribute('aria-expanded')==='true'){mb.click();mb.focus()}
  if(e.key==='Tab'&&mb.getAttribute('aria-expanded')==='true'){const f=[mb,...$$('#menu a')];const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
matchMedia('(min-width:821px)').addEventListener('change',e=>{if(e.matches&&mb.getAttribute('aria-expanded')==='true')mb.click()});

/* ---- maroon smoke (replaces the light strands) ---- */
function smoke(c){
  const ctx=c.getContext('2d');let w,h,t=Math.random()*1000,vis=true;
  const blobs=[...Array(7)].map((_,i)=>({px:Math.random()*6.28,py:Math.random()*6.28,sx:.05+Math.random()*.08,sy:.04+Math.random()*.07,ax:.32+Math.random()*.18,ay:.28+Math.random()*.2,cx:.45+Math.random()*.4,cy:.3+Math.random()*.5,r:.28+Math.random()*.26,c:i%3===0?'242,36,61':(i%3===1?'122,10,24':'60,6,14'),a:i%3===0?.2:.5}));
  function size(){w=c.clientWidth;h=c.clientHeight;c.width=Math.max(1,w/2);c.height=Math.max(1,h/2);ctx.setTransform(.5,0,0,.5,0,0)}
  function frame(){
    ctx.clearRect(0,0,w,h);
    for(const b of blobs){const x=w*(b.cx+Math.sin(t*b.sx+b.px)*b.ax*.5),y=h*(b.cy+Math.cos(t*b.sy+b.py)*b.ay*.5),r=Math.max(w,h)*b.r;
      const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${b.c},${b.a})`);g.addColorStop(1,`rgba(${b.c},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
    t+=.008;if(!reduce&&vis&&!window.motionPaused)requestAnimationFrame(frame)}
  size();addEventListener('resize',()=>{size();frame()});
  new IntersectionObserver(([e])=>{const was=vis;vis=e.isIntersecting;if(vis&&!was&&!reduce&&!window.motionPaused)requestAnimationFrame(frame)}).observe(c);
  c.resume=()=>{if(!reduce&&vis)requestAnimationFrame(frame)};
  frame();
}
/* pause or resume continuous motion; remembered per visitor */
{const mt=$('#motionToggle');let saved=null;try{saved=localStorage.getItem('motion')}catch(e){}
 window.motionPaused=reduce||saved==='off';
 const sync=()=>{mt.setAttribute('aria-pressed',window.motionPaused);mt.textContent=window.motionPaused?'Play motion':'Pause motion';document.documentElement.classList.toggle('still',window.motionPaused)};
 sync();mt.addEventListener('click',()=>{window.motionPaused=!window.motionPaused;try{localStorage.setItem('motion',window.motionPaused?'off':'on')}catch(e){};sync();if(!window.motionPaused)$('#smoke').resume&&$('#smoke').resume()});}
smoke($('#smoke'));

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
  const val=el.dataset.roll;el.textContent='';const sr=document.createElement('span');sr.className='sr-only';sr.textContent=val;el.before(sr);el.setAttribute('aria-hidden','true');el.classList.add('roll');const cols=[];
  [...val].forEach((ch,i)=>{
    if(!/\d/.test(ch)){const s=document.createElement('span');s.className='sep';s.dataset.ch=ch;el.append(s);return}
    const col=document.createElement('span');col.className='col';const d=+ch,loops=2+(val.length-i);let html='';
    for(let k=0;k<=loops*10+d;k++)html+=(k?'\n':'')+(k%10);col.dataset.seq=html;col.dataset.end=loops*10+d;
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
/* mouse steers the pinned ribbon: move right to slide right, the wheel still works */
let hsTarget=null,lastWheel=0;
const steer=sec=>e=>{
  if(!sec.classList.contains('pinned'))return;
  if(performance.now()-lastWheel<350)return;
  const r=sec.getBoundingClientRect();if(r.top>2||r.bottom<innerHeight-2)return;
  const dist=+sec.dataset.dist;const m=innerWidth*.12;const p=clamp((e.clientX-m)/(innerWidth-2*m));
  hsTarget=scrollY+r.top+p*dist;
};
hs.addEventListener('mousemove',steer(hs));
/* 12 Days rows: same pinned scroll and mouse steering as the work ribbon */
const ds=$('#days'),dRowEls=[$('#dRowA'),$('#dRowB')],dBar=$('#dBar');
function setupDays(){
  ds.classList.remove('pinned');ds.style.height='';dRowEls.forEach(r=>r.style.transform='');
  if(!(wide.matches&&!reduce))return;
  ds.classList.add('pinned');
  if(ds.querySelector('.pin').scrollHeight>innerHeight+2){ds.classList.remove('pinned');return}
  const d=dRowEls.map(r=>Math.max(0,r.scrollWidth-innerWidth));const dist=Math.max(...d);
  const span=Math.round(dist*.6);ds.dataset.dist=span;dRowEls.forEach((r,i)=>r.dataset.dist=d[i]);ds.style.height=(innerHeight+span)+'px';
}
ds.addEventListener('mousemove',steer(ds));
setupDays();addEventListener('resize',setupDays);addEventListener('load',setupDays);wide.addEventListener('change',setupDays);
addEventListener('wheel',()=>{lastWheel=performance.now();hsTarget=null},{passive:true});
addEventListener('keydown',()=>{hsTarget=null});
setupHS();addEventListener('resize',setupHS);wide.addEventListener('change',setupHS);
addEventListener('load',setupHS);

/* ---- marquee driven by time + scroll velocity ---- */
let lastY=scrollY,vel=0;
const mq=$('#marq');const mqN=$$('span',mq).length;mq.innerHTML+=mq.innerHTML;$$('span',mq).slice(mqN).forEach(x=>x.setAttribute('aria-hidden','true'));
let mx=0,mqHover=false;mq.addEventListener('pointerenter',()=>mqHover=true);mq.addEventListener('pointerleave',()=>mqHover=false);

/* ---- scroll engine ---- */
const portrait=$('#portrait'),heroCopy=$('#heroCopy'),roles=$('#roles'),wire=$('#wire'),roleEls=$$('.role'),ctLines=$$('#ct-h .l');
function tick(){
  const y=scrollY,vh=innerHeight;
  nav.classList.toggle('scrolled',y>30);
  vel+=((y-lastY)-vel)*.12;lastY=y;
  if(!reduce){
    // hero parallax out
    const hp=clamp(y/vh);
    if(!window.motionPaused&&!mqHover){mx-=.45;const half=mq.scrollWidth/2;if(-mx>half)mx+=half;mq.style.transform=`translateX(${mx}px)`}
    heroCopy.style.transform=`translateY(${hp*-70}px)`;heroCopy.style.opacity=1-hp*1.1;
    // word highlight
    if(ws.length){const r=wf.getBoundingClientRect();const p=clamp((vh*.85-r.top)/(r.height+vh*.3));const n=Math.round(p*ws.length);for(let i=0;i<ws.length;i++)ws[i].classList.toggle('on',i<n)}
    // pinned horizontal
    if(hsTarget!==null){const d=hsTarget-scrollY;if(Math.abs(d)<1)hsTarget=null;else scrollTo(0,scrollY+d*.1)}
    if(ds.classList.contains('pinned')){const r=ds.getBoundingClientRect();const p=clamp(-r.top/Math.max(1,+ds.dataset.dist));dRowEls.forEach(x=>x.style.transform=`translateX(${-p*(+x.dataset.dist)}px)`);dBar.style.setProperty('--p',p)}
    if(hs.classList.contains('pinned')){const r=hs.getBoundingClientRect();const dist=+hs.dataset.dist;const p=clamp(-r.top/Math.max(1,dist));track.style.transform=`translateX(${-p*dist}px)`;bar.style.setProperty('--p',p)}
    // experience wire
    const rr=roles.getBoundingClientRect();const wp=clamp((vh*.6-rr.top)/rr.height);wire.style.setProperty('--p',wp);
    roleEls.forEach(el=>{el.classList.toggle('lit',el.getBoundingClientRect().top<vh*.6)});
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
const filmHTML=film.innerHTML;function resetFilm(){film.innerHTML=filmHTML}
function playFilm(){if(film.querySelector('iframe'))return;if(typeof stopYT==='function')stopYT();film.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${film.dataset.yt}?autoplay=1&rel=0" title="The Optical Frontier" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;film.querySelector('iframe').focus()}
film.addEventListener('click',e=>{if(e.target.closest('.film-btn'))playFilm()});


/* ---- inline YouTube players on work cards ---- */
let activeYT=null;
function stopYT(){if(activeYT){activeYT.querySelector('iframe')?.remove();activeYT=null}}
document.addEventListener('click',e=>{const v=e.target.closest('[data-yt-inline]');if(!v||v.querySelector('iframe'))return;stopYT();if(film.querySelector('iframe'))resetFilm();const t=(v.querySelector('button')?.getAttribute('aria-label')||'Video').replace(/^Play /,'');v.insertAdjacentHTML('beforeend',`<iframe src="https://www.youtube-nocookie.com/embed/${v.dataset.ytInline}?autoplay=1&rel=0" title="${t} video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`);activeYT=v;v.querySelector('iframe').focus()});

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
    pars.forEach(p=>{const r=p.getBoundingClientRect();const off=(r.top+r.height/2-vh/2);p.style.transform=`translateY(${off*-(+p.dataset.par)}px)`});
  }
  requestAnimationFrame(scenes);
}
requestAnimationFrame(scenes);
$$('.d-ctrl button').forEach(b=>b.addEventListener('click',()=>{const r=document.getElementById(b.dataset.row);const c=r.querySelector('.dcard');r.scrollBy({left:(+b.dataset.dir)*(c.offsetWidth+16)*2,behavior:reduce?'auto':'smooth'})}));

/* ---- gallery ---- */
const tiles=$$('.tile');
/* masonry that keeps reading order, so each collection stays together */
const gal=$('#gallery');
function masonry(){if(!gal)return;const cs=getComputedStyle(gal);const row=parseFloat(cs.gridAutoRows)||2,gap=14;
  tiles.forEach(t=>{if(t.offsetParent===null)return;const im=t.querySelector('img');const r=(+im.getAttribute('height')||3)/(+im.getAttribute('width')||4);const h=Math.min(t.clientWidth*r,560);t.style.gridRowEnd='span '+Math.ceil((h+gap)/row)})}
gal&&gal.classList.add('masonry');masonry();addEventListener('resize',masonry);
const tio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');tio.unobserve(e.target)}}),{threshold:.1});
tiles.forEach(t=>tio.observe(t));
const g=$('#gallery'),mbtn=$('#moreBtn');
mbtn.addEventListener('click',()=>{const o=!g.classList.contains('all');g.classList.toggle('all',o);mbtn.setAttribute('aria-expanded',o);mbtn.textContent=o?'Show less':'Show all work';masonry();if(!o)$('#portfolio').scrollIntoView()});
$$('.filters button').forEach(b=>b.addEventListener('click',()=>{
  $$('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const f=b.dataset.f;tiles.forEach(t=>t.classList.toggle('hide',f!=='all'&&t.dataset.c!==f));
  if(f!=='all'){g.classList.add('all');mbtn.parentElement.hidden=true}else{g.classList.remove('all');mbtn.parentElement.hidden=false;mbtn.setAttribute('aria-expanded',false);mbtn.textContent='Show all work'}
  masonry();
}));
const lb=$('#lb'),li=$('#lbImg');let cur=0,last=null,items=[];
const full=src=>src.replace(/-sm\.jpg(\?.*)?$/,'.jpg');
function show(i){cur=(i+items.length)%items.length;const t=items[cur];li.removeAttribute('width');li.removeAttribute('height');li.src=t.src;li.alt=t.t;$('#lbT').textContent=t.t;$('#lbS').textContent=t.s||'';const multi=items.length>1;$('#lbP').hidden=!multi;$('#lbN').hidden=!multi}
function openList(list,i,from){items=list;last=from;show(i);lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#lbX').focus()}
function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';last&&last.focus&&last.focus()}
/* portfolio tiles */
tiles.forEach(t=>t.addEventListener('click',()=>{const v=tiles.filter(x=>x.offsetParent!==null);openList(v.map(x=>({src:`assets/work/${x.dataset.src}.jpg`,t:x.dataset.t,s:x.dataset.s})),v.indexOf(t),t)}));
/* every other campaign image: click to enlarge, arrows step through its group */
const zoomGroups=[
  ['#track .card .shot img',null],
  ['#dRowA .dcard img','12 Days of Data Center, 2025'],
  ['#dRowB .dcard img','12 Days of Data Center, 2024'],
  ['#concepts .cn:not(.alt) figure img','Neural Network'],
  ['#concepts .bbh-grid figure img','Bring Broadband Home'],
];
zoomGroups.forEach(([sel,title])=>{const imgs=$$(sel);imgs.forEach((im,i)=>{
  im.classList.add('zoomable');im.tabIndex=0;im.setAttribute('role','button');
  const go=()=>openList(imgs.map(x=>({src:full(x.currentSrc||x.src),t:title||x.closest('.card')?.querySelector('h3')?.textContent||x.alt,s:x.alt})),i,im);
  im.addEventListener('click',go);im.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
})});
/* film frames: click the scene to open the frame on screen */
const frPin=$('#frames .pin');
const frOpenList=k=>{const fr=$$('.frame-stack img');openList(fr.map((x,j)=>({src:x.currentSrc||x.src,t:'The Optical Frontier',s:`Frame ${String(j+1).padStart(2,'0')} of ${fr.length}`})),k,$('#frOpen'))};
$('#frOpen').addEventListener('click',e=>{e.stopPropagation();frOpenList(0)});
if(frPin){frPin.classList.add('zoomable');frPin.addEventListener('click',e=>{if(e.target.closest('a,button'))return;const fr=$$('.frame-stack img');const hit=fr.indexOf(e.target);const on=hit>=0&&reduce?hit:Math.max(0,fr.findIndex(x=>x.classList.contains('on')));openList(fr.map((x,k)=>({src:x.currentSrc||x.src,t:'The Optical Frontier',s:`Frame ${String(k+1).padStart(2,'0')} of ${fr.length}`})),on,frPin)})}
$('#lbX').onclick=close;$('#lbP').onclick=()=>show(cur-1);$('#lbN').onclick=()=>show(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='FIGURE')close()});
addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1);
  if(e.key==='Tab'){const f=$$('button',lb);const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
})();