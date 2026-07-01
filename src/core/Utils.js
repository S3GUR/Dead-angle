import { StateCoordinator } from './StateCoordinator.js';

export function formatMoney(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function fetchWithProxy(url) {
  const primaryProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  
  return fetch(primaryProxy)
    .then(res => {
      if (!res.ok) throw new Error("Primary CORS proxy returned status " + res.status);
      return res.json().then(data => {
        if (data && data.contents !== null && data.contents !== undefined) {
          return data.contents;
        }
        throw new Error("Empty contents from primary proxy");
      });
    })
    .catch(err => {
      console.warn("Primary CORS proxy failed, trying fallback...", err);
      const safeUrl = url.includes('key=') ? url.split('key=')[0] + 'key=HIDDEN_API_KEY_FOR_SECURITY' : url;
      StateCoordinator.logSystemError('proxy-warning', `Échec du proxy principal (AllOrigins) pour l'URL : ${safeUrl}`, err.message);
      
      const fallbackProxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      return fetch(fallbackProxy)
        .then(res => {
          if (!res.ok) throw new Error("Fallback CORS proxy returned status " + res.status);
          return res.text();
        })
        .catch(fallbackErr => {
          StateCoordinator.logSystemError('proxy-error', `Échec total des proxies (AllOrigins & CORSProxy.io) pour l'URL : ${safeUrl}`, fallbackErr.message);
          throw fallbackErr;
        });
    });
}

export function debugLog(message, data = null) {
  let debugConsole = document.getElementById('wink-debug-console');
  if (!debugConsole) {
    debugConsole = document.createElement('div');
    debugConsole.id = 'wink-debug-console';
    debugConsole.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 180px;
      background: rgba(13, 11, 26, 0.95);
      color: #00ff66;
      font-family: monospace;
      font-size: 11px;
      overflow-y: auto;
      padding: 10px;
      z-index: 100000;
      border-top: 2px solid var(--primary, #9d4edd);
      box-shadow: 0 -8px 32px rgba(0,0,0,0.5);
    `;
    
    // Add close button to debug console
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close Debug Console';
    closeBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.1); border: 1px solid #fff; color: #fff; cursor: pointer; padding: 4px 8px; font-size: 10px; border-radius: 4px;';
    closeBtn.onclick = () => debugConsole.remove();
    debugConsole.appendChild(closeBtn);
    
    document.body.appendChild(debugConsole);
  }
  const logLine = document.createElement('div');
  logLine.style.marginBottom = '4px';
  logLine.innerText = `[${new Date().toLocaleTimeString()}] ${message} ${data ? JSON.stringify(data) : ''}`;
  debugConsole.appendChild(logLine);
  debugConsole.scrollTop = debugConsole.scrollHeight;
}
