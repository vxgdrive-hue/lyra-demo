/* Lyra demo – traka: oznaka DEMO, cijeli zaslon, instalacija, povratak na početak */
(function(){
  var css='#lyrabar{position:fixed;left:max(10px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom));z-index:99990;display:flex;align-items:center;gap:6px;padding:5px 6px 5px 12px;border-radius:999px;background:rgba(14,22,52,.82);border:1px solid rgba(190,210,255,.28);box-shadow:0 6px 20px rgba(0,0,0,.35);font:600 12px/1 system-ui,-apple-system,Segoe UI,sans-serif;color:#e8eeff;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:opacity .3s}'
   +'#lyrabar b{font-weight:800;letter-spacing:.06em;color:#ffd75a;margin-right:4px}'
   +'#lyrabar button{all:unset;cursor:pointer;min-width:30px;height:30px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:5px;background:rgba(255,255,255,.08);color:#fff;font:600 12px/1 system-ui,sans-serif}'
   +'#lyrabar button:hover,#lyrabar button:focus-visible{background:rgba(255,255,255,.2)}'
   +'#lyrabar .ask{display:none}#lyrabar.asking .ask{display:inline-flex}#lyrabar.asking .norm{display:none}'
   +'#lyrabar.min{opacity:.55;padding:4px 10px;gap:0}#lyrabar.min b{margin:0;font-size:10px}#lyrabar.min .norm,#lyrabar.min .ask{display:none!important}#lyrabar.min:hover{opacity:1}'
   +'@media (max-width:560px){#lyrabar .lbl{display:none}}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  var deferred=null;
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferred=e; var b=document.getElementById('lyrainst'); if(b) b.hidden=false; });
  function fsOn(){ return document.fullscreenElement||document.webkitFullscreenElement; }
  function fsToggle(){ var d=document.documentElement; try{ if(fsOn()){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); } else { (d.requestFullscreen||d.webkitRequestFullscreen).call(d); } }catch(e){} }
  function mount(){ if(document.getElementById('lyrabar')) return;
    var bar=document.createElement('div'); bar.id='lyrabar'; bar.setAttribute('role','toolbar'); bar.setAttribute('aria-label','Lyra demo');
    bar.innerHTML='<b title="Izmišljena obitelj – ništa se ne šalje na internet · verzija '+(window.LYRA_VER||'?')+'">DEMO</b>'
      +'<button class="norm" id="lyrafs" title="Cijeli zaslon" aria-label="Cijeli zaslon">⛶</button>'
      +'<button class="norm" id="lyrainst" hidden title="Instaliraj kao aplikaciju">⬇<span class="lbl">Instaliraj</span></button>'
      +'<button class="norm" id="lyrareset" title="Vrati demo na početak">↺<span class="lbl">Na početak</span></button>'
      +'<span class="ask">Vratiti sve na početak?</span><button class="ask" id="lyrayes">Da</button><button class="ask" id="lyrano">Ne</button>';
    document.body.appendChild(bar);
    bar.addEventListener('click', function(e){ var t=e.target.closest('button'); if(!t){ e.stopPropagation(); return; } e.stopPropagation();
      if(t.id==='lyrafs') fsToggle();
      else if(t.id==='lyrareset') bar.classList.add('asking');
      else if(t.id==='lyrano') bar.classList.remove('asking');
      else if(t.id==='lyrayes') window.LYRA_DEMO.reset();
      else if(t.id==='lyrainst' && deferred){ deferred.prompt(); deferred.userChoice.finally(function(){ deferred=null; t.hidden=true; }); } }, true);
    var idle; var wake=function(){ bar.classList.remove('min'); clearTimeout(idle); idle=setTimeout(function(){ if(!bar.classList.contains('asking')) bar.classList.add('min'); }, 6000); };
    ['pointerenter','pointerdown','focusin'].forEach(function(ev){ bar.addEventListener(ev, wake, {passive:true}); }); wake();   // traka se smanji u malu oznaku DEMO; otvori se dodirom na nju
    if(window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) document.getElementById('lyrainst').hidden=true;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  if('serviceWorker' in navigator && location.protocol==='https:'){
    var had=!!navigator.serviceWorker.controller, done=false;
    navigator.serviceWorker.addEventListener('controllerchange', function(){ if(had && !done){ done=true; location.reload(); } });   // nova verzija preuzela → jednom osvježi
    window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js', {updateViaCache:'none'}).then(function(r){ try{ r.update(); }catch(e){} }).catch(function(){}); }); }
})();
