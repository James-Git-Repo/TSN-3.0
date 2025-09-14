/*! Access / View Mode — viewer by default, editor if logged-in.
   - In VIEWER: hides editing/customize/upload controls across pages
   - In EDITOR: everything interactive
   - You can override via ?mode=viewer|editor for quick checks
*/
(function(){
  const html = document.documentElement;
  const qs = new URLSearchParams(location.search);
  function setMode(m){ html.setAttribute('data-mode', m); }
  function modeFromQS(){ const m = qs.get('mode'); return (m==='editor'||m==='viewer')?m:null; }
  function waitForSB(cb){
    const iv = setInterval(()=>{ if (window.sb) { clearInterval(iv); cb(window.sb); } }, 25);
    setTimeout(()=> clearInterval(iv), 6000);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setMode(modeFromQS() || 'viewer');

    waitForSB((sb)=>{
      // if explicitly forced via ?mode, keep it
      if (!modeFromQS()) {
        sb.auth.getUser().then(({data})=> setMode(data?.user ? 'editor' : 'viewer'));
        sb.auth.onAuthStateChange((_evt, session)=> setMode(session?.user ? 'editor' : 'viewer'));
      }
    });
  });
})();