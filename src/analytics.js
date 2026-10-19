// Basic consent mode: no Google requests before affirmative consent.
(() => {
  const id = 'G-NCXV9VCE15';
  const key = 'ffl-analytics-consent-v1';
  const production = location.hostname === 'ffllubrificantes.com.br';
  let consent = false, started = false;
  try { consent = localStorage.getItem(key) === 'granted'; } catch {}
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  const safeUrl = value => { try { const u = new URL(value); return u.origin + u.pathname; } catch { return ''; } };
  function start(){
    if (!production || !consent || started) return;
    started = true;
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    gtag('config',id,{page_location:safeUrl(location.href),page_referrer:safeUrl(document.referrer),allow_google_signals:false,allow_ad_personalization_signals:false});
    const script = document.createElement('script');
    script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  function choose(value){
    consent = value === 'granted';
    try { localStorage.setItem(key,value); } catch {}
    banner.hidden = true;
    if (!consent && started) {
      window['ga-disable-' + id] = true;
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of ['',location.hostname,'.'+location.hostname]) {
          document.cookie = name+'=; Max-Age=0; path=/' + (domain?'; domain='+domain:'') + '; SameSite=Lax; Secure';
        }
      }
      location.reload();
    } else { start(); }
  }
  const banner = document.createElement('section');
  banner.className = 'analytics-consent';
  banner.setAttribute('aria-label','Preferências de cookies');
  banner.innerHTML = '<p>Podemos usar o Google Analytics para medir visitas e pedidos de orçamento? Os dados preenchidos no formulário não são enviados ao Analytics. <a href="/privacidade/">Saiba mais</a>.</p><div><button type="button" data-consent="granted">Aceitar estatísticas</button><button type="button" data-consent="denied">Recusar estatísticas</button></div>';
  try { banner.hidden = ['granted','denied'].includes(localStorage.getItem(key)); } catch {}
  banner.querySelectorAll('button').forEach(button => button.addEventListener('click',()=>choose(button.dataset.consent)));
  document.body.append(banner);
  const settings = document.createElement('button');
  settings.type = 'button'; settings.className = 'analytics-preferences'; settings.textContent = 'Preferências de cookies';
  settings.addEventListener('click',()=>{banner.hidden=false;banner.querySelector('button').focus();});
  (document.querySelector('footer') || document.body).append(settings);
  window.addEventListener('ffl:analytics',e=>{
    if (!production || !consent || !started) return;
    const events = {quote_accepted:'generate_lead',whatsapp_click:'whatsapp_click',phone_click:'phone_click',email_click:'email_click'};
    const event = events[e.detail?.event];
    if (!event) return;
    gtag('event',event,{contact_method:event==='generate_lead'?'form':event==='whatsapp_click'?'whatsapp':event==='phone_click'?'phone':'email',page_location:safeUrl(location.href)});
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('ffl:analytics',{detail:{event:'phone_click'}}))));
  document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('ffl:analytics',{detail:{event:'email_click'}}))));
  start();
})();
