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
