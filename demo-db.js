/* Lyra demo – zamjenska baza: podaci žive samo u ovom pregledniku (localStorage), kreću iz izmišljene demo obitelji */
(function(){
  var KEY='lyra-demo-db', VER=1;
  var pad=function(n){ return String(n).padStart(2,'0'); };
  var dstr=function(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); };
  var ago=function(n){ var d=new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()-n); return d; };
  var D=function(n){ return dstr(ago(n)); };
  var TS=function(n,h){ var d=ago(n); d.setHours(h||17, (n*7)%60, 0, 0); return d.toISOString(); };
  var BOJE=['y','o','g','b','r','p'], LICA=['smile','grin','wink','happy','cool','heart','starry','blush','tongue'];
  function seed(){
    var Z={}, n=0, P_DAYS=8, pTs=TS(P_DAYS,20);
    function add(kid, d, o){ n++; var big=o.v, kat=o.kat||(big?'skola':'ostalo'), plo=o.ploca!==false, ts=TS(d, 15+(n%5));
      var id=kid+'-'+D(d)+'-'+(kat==='kupnja'?'kupnja':kat==='kazna'?'kazna':big?'petica':'mala')+'-d'+n;
      var z={xpTs:ts, dijete:kid, kategorija:kat, datum:D(d), skGod:'2026./27.', predmet:o.p||'', opis:'', ocjena:big&&kat==='skola'?5:null,
        zvjezdica:kat==='kupnja'?'K':(big?'V':'M'), broj:1, dano:o.dano||'DA', datumDavanja:o.dano==='NE'?'':D(d),
        eDnevnik:kat==='skola'?(o.ed||'DA'):'–', datumProvjere:kat==='skola'&&(o.ed||'DA')==='DA'?D(Math.max(0,d-1)):'',
        boja:kat==='kazna'?'k':kat==='kupnja'?'':BOJE[n%BOJE.length], lice:LICA[n%LICA.length],
        naPloci:plo?'DA':'NE', datumPloca:plo?D(d):'', plocaTs:plo?ts:'', napomena:o.nap||'', kreirano:ts, izmijenjeno:ts, izvor:'aplikacija'};
      if(kat==='kupnja'){ z.cijena=o.cij||''; z.kV=o.kV||0; z.kM=o.kM||0; z.iznos=(o.kV||0)*3+(o.kM||0); z.broj=(o.kV||0)+(o.kM||0); z.napomena='Kupnja zvjezdicama'; }
      if(kat==='kazna'){ z.napomena='Kazna – oduzeta zvjezdica'; }
      Z[id]=z; return z; }
    /* Toni (2. razred) – kocke */
    [[24,'Matematika'],[22,'Hrvatski jezik'],[19,'Priroda i društvo'],[17,'Matematika'],[14,'Engleski jezik'],[11,'Tjelesna i zdravstvena kultura']].forEach(function(x){ add('toni',x[0],{v:1,p:x[1]}); });
    [[23,'Nogomet – 2 treninga'],[20,'Pomoć u kući'],[16,'Nogomet – 2 treninga'],[12,'Pospremio sobu']].forEach(function(x){ add('toni',x[0],{v:0,p:x[1]}); });
    add('toni',13,{kat:'kupnja',p:'Laptop – 1 h',kM:1,cij:'1 mala'});
    add('toni',6,{v:1,p:'Matematika'}); add('toni',4,{v:1,p:'Hrvatski jezik'}); add('toni',3,{v:0,p:'Nogomet – 2 treninga'});
    add('toni',2,{kat:'kazna',v:0,ploca:false});
    add('toni',1,{v:1,p:'Matematika',ed:'NE',ploca:false,nap:'Dano kroz aplikaciju – čeka e-Dnevnik'});
    add('toni',0,{v:0,p:'Pomoć u kući',ploca:false});
    /* Ema (4. razred) – srca i jednorog */
    [[25,'Hrvatski jezik'],[24,'Matematika'],[21,'Engleski jezik'],[20,'Likovna kultura'],[18,'Priroda i društvo'],[15,'Glazbena kultura'],[13,'Matematika'],[12,'Hrvatski jezik'],[10,'Engleski jezik']].forEach(function(x){ add('ema',x[0],{v:1,p:x[1]}); });
    [[22,'Ples – 2 treninga'],[17,'Čitanje lektire'],[11,'Ples – 2 treninga']].forEach(function(x){ add('ema',x[0],{v:0,p:x[1]}); });
    add('ema',16,{kat:'kupnja',p:'Knjiga',kV:2,cij:'2 velike'});
    add('ema',5,{v:1,p:'Engleski jezik'}); add('ema',3,{kat:'kupnja',p:'Laptop – 1 h',kM:1,cij:'1 mala'}); add('ema',2,{v:1,p:'Priroda i društvo'});
    add('ema',1,{v:1,p:'Hrvatski jezik',ploca:false});
    add('ema',2,{v:1,p:'Likovna kultura',dano:'NE',ploca:false,nap:'Petica u e-Dnevniku – zvjezdica još nije dana'});
    /* Mališa (vrtić) – autići */
    [[23,'Pospremio igračke'],[21,'Lijepo crtao'],[19,'Pomogao postaviti stol'],[15,'Pospremio igračke'],[13,'Obukao se sam'],[10,'Lijepo crtao']].forEach(function(x){ add('malisa',x[0],{v:0,p:x[1]}); });
    add('malisa',9,{v:1,kat:'ostalo',p:'Hrabar kod doktora'});
    add('malisa',5,{v:0,p:'Pomogao baki'}); add('malisa',4,{v:0,p:'Pospremio igračke'}); add('malisa',2,{kat:'kupnja',p:'Sladoled',kM:2,cij:'2 male'});
    add('malisa',1,{v:0,p:'Lijepo crtao',ploca:false});
    /* stanje ploče prebrojano prije 8 dana = sve što je bilo na ploči do tada */
    var st={};
    ['toni','ema','malisa'].forEach(function(k){ var V=0,M=0; Object.keys(Z).forEach(function(id){ var z=Z[id]; if(z.dijete!==k||z.dano!=='DA'||z.naPloci!=='DA'||!(z.plocaTs<pTs)) return;
      if(z.kategorija==='kupnja'){ V-=z.kV; M-=z.kM; } else { var s=z.kategorija==='kazna'?-1:1; if(z.zvjezdica==='V') V+=s; else M+=s; } }); st[k]={V:Math.max(0,V),M:Math.max(0,M)}; });
    var ploca={}; ploca['ploca-'+D(P_DAYS)]={datum:D(P_DAYS), kreirano:pTs, stanje:st, izvor:'aplikacija'};
    return { _v:VER, zvjezdice:Z, ploca:ploca, provjere:{}, koraci:{}, prijedlozi:{}, kreda:{},
      postavke:{ glavno:{vrijednostV:3, vrijednostM:1},
        djeca:{toni:'demo/toni.webp', ema:'demo/ema.webp', malisa:'demo/malisa.webp'},
        roditelj:{salt:'6c797261646d6f31a1b2c3d4e5f60718', hash:'2fb705a538a03476bed016d57c66e419fa3c266f43b8c519e85e45e58d8d6a77', it:120000, ts:TS(30)} } };
  }
  var DB=null; try{ DB=JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){}
  if(!DB || DB._v!==VER){ DB=seed(); }
  var save=function(){ try{ localStorage.setItem(KEY, JSON.stringify(DB)); }catch(e){} }; save();
  var subs={}, cl=function(o){ return o==null?o:JSON.parse(JSON.stringify(o)); }, col=function(c){ return DB[c]=DB[c]||{}; };
  var snap=function(c){ var docs=Object.keys(col(c)).sort().map(function(id){ var d=col(c)[id]; return {id:id, exists:true, data:function(){ return cl(d); }}; }); return {docs:docs, size:docs.length, empty:!docs.length, metadata:{fromCache:false, hasPendingWrites:false}}; };
  var emit=function(c){ var q=snap(c); (subs[c]||[]).slice().forEach(function(cb){ try{ cb(q); }catch(e){ console.warn('[lyra-demo]', c, e); } }); };
  var later=function(c){ setTimeout(function(){ emit(c); }, 0); };
  var db={ collection:function(c){ return {
    onSnapshot:function(cb){ (subs[c]=subs[c]||[]).push(cb); later(c); return function(){ subs[c]=(subs[c]||[]).filter(function(x){ return x!==cb; }); }; },
    get:function(){ return Promise.resolve(snap(c)); },
    doc:function(id){ return {
      set:function(d){ col(c)[id]=cl(d); save(); later(c); return Promise.resolve(); },
      update:function(u){ var b=col(c)[id]; if(!b) return Promise.reject({code:'not-found', message:'Nema zapisa'}); col(c)[id]=Object.assign({}, b, cl(u)); save(); later(c); return Promise.resolve(); },
      delete:function(){ delete col(c)[id]; save(); later(c); return Promise.resolve(); },
      get:function(){ var d=col(c)[id]; return Promise.resolve({id:id, exists:d!==undefined, data:function(){ return cl(d); }}); } }; } }; } };
  window.claude={ use:function(n){ return Promise.resolve(n==='db'?db:null); } };
  window.LYRA_DEMO={ reset:function(){ try{ Object.keys(localStorage).forEach(function(k){ if(k===KEY || k.indexOf('zv-')===0) localStorage.removeItem(k); }); }catch(e){} location.reload(); } };
})();
