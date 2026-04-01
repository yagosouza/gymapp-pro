// Este arquivo regista o Service Worker para cache offline (Workbox via CRA).
// O SW só está ativo em produção (npm run build).

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) return;

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                checkValidServiceWorker(swUrl, config);
                navigator.serviceWorker.ready.then(() => {
                    console.log('App a ser servida por Service Worker em localhost.');
                });
            } else {
                registerValidSW(swUrl, config);
            }
        });
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (!installingWorker) return;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Erro ao registar o Service Worker:', error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (response.status === 404 || (contentType && !contentType.includes('javascript'))) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => window.location.reload());
                });
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log('Sem conexão à internet. App a correr em modo offline.');
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => registration.unregister())
            .catch(error => console.error(error.message));
    }
}
