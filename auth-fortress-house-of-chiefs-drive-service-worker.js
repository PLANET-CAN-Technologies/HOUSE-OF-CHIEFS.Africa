/**
 * =========================================================================
 * NEXUS CORE ENGINE (ZERO-TRUST) - FORTRESS EDITION
 * FILE: auth-fortress-house-of-chiefs-drive-service-worker.js
 * MASTER BLUEPRINT TEMPLATE: OMNI-INFRASTRUCTURE GENERATOR
 * TARGET REPO: PLANETCAN-house-of-chiefs-GEN11.V6
 * VERSION: GEN 11.3 V01.001.007
 * =========================================================================
 */

const CACHE_NAME = 'TITAN-house-of-chiefs-DRIVE-V01001007';
const DYNAMIC_ASSET_VAULT = 'TITAN-DYNAMIC-house-of-chiefs-ASSETS-V51';
let activeClearanceStage = 3;

const ZERO_TRUST_INFRASTRUCTURE = [
    '/',
    '/index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/otpauth/9.1.2/otpauth.umd.min.js',
    'https://auth.planetcan.international/auth-fortress-global-traffic-routing.js?v=V01.001.007',
    'https://auth.planetcan.international/firebase-cipher-pyro-sync.js?v=V01.001.007',
    'https://auth.planetcan.international/aes256-classified-crucible-forge-cipher-pyro.js?v=V01.001.007',
    'https://auth.planetcan.international/vault-storage.js?v=V01.001.007',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
];

self.addEventListener('install', (event) => {
    console.log(`[house-of-chiefs SW] Installing Titan Cache: ${CACHE_NAME}`);
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[house-of-chiefs SW] Securing Zero-Trust Infrastructure...');
            await cache.addAll(ZERO_TRUST_INFRASTRUCTURE);
            console.log('[house-of-chiefs SW] Connecting to Master Ledger for FOUNDATION alignment...');
            
            try {
                const response = await fetch('/fleet-manifest.json?_cb=' + Date.now());
                const contentType = response.headers.get('content-type');
                
                // V01.001.007 FIX: Explicit JSON validation before unpacking
                if (response.ok && contentType && contentType.includes('application/json')) {
                    const manifest = await response.json();
                    const foundationAssets = manifest
                        .filter(node => node.survivalWeight === "FOUNDATION")
                        .map(node => node.fileNode);
                    console.log(`[house-of-chiefs SW] Blueprint acquired. Caching ${foundationAssets.length} FOUNDATION nodes.`);
                    return Promise.allSettled(
                        foundationAssets.map(url => cache.add(url).catch(err => console.warn(`[house-of-chiefs SW] Missing Foundation Node: ${url}`)))
                    );
                } else {
                    console.warn('[house-of-chiefs SW] Master Ledger unavailable or returned HTML redirect. Bypassing Foundation hydration safely.');
                }
            } catch (err) {
                console.error('[house-of-chiefs SW] Master Ledger connection severed during installation.', err);
            }
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[house-of-chiefs SW] Activated and securing perimeter.');
    event.waitUntil(self.clients.claim());
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_ASSET_VAULT && cacheName.includes('TITAN')) {
                        console.log(`[house-of-chiefs SW] Vapourising legacy ghost cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SET_CLEARANCE_STAGE') {
        activeClearanceStage = event.data.stage;
        console.log(`[house-of-chiefs SW] Intel Received: Sovereign Clearance Updated to STAGE ${activeClearanceStage}.`);
    }
    
    if (event.data && event.data.type === 'PURGE_CACHE') {
        console.log('[house-of-chiefs SW] WASHING MACHINE COMMAND RECEIVED. Vapourising Caches...');
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName.includes('TITAN-house-of-chiefs-DRIVE')) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[house-of-chiefs SW] Local Drive purged. Unifying fleet to Cloud Truth.');
            self.clients.matchAll().then(clients => {
                clients.forEach(client => client.postMessage({ type: 'RELOAD_PAGE' }));
            });
        });
    }
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    
    if (
        url.pathname.includes('halo-comms.json') || 
        url.pathname.includes('fleet-manifest.json') || 
        url.pathname.includes('/.netlify/functions/')
    ) {
        event.respondWith(fetch(event.request));
        return;
    }

    const isFirebaseStorage = url.hostname.includes('firebasestorage.googleapis.com');

    if (!url.protocol.startsWith('http') || 
        (url.hostname.includes('googleapis.com') && !isFirebaseStorage) || 
        url.hostname.includes('google.com') || 
        url.hostname.includes('run.app') || 
        url.search.includes('_cb=')) {
        return; 
    }

    let fetchRequest = event.request;
    const isCoreAsset = url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname === '/';
    const isArchitect = (activeClearanceStage === 1);

    if (isArchitect && isCoreAsset) {
        event.respondWith(
            fetch(fetchRequest).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(fetchRequest, responseToCache));
                return networkResponse;
            }).catch(() => {
                console.warn("[house-of-chiefs SW] Architect Offline. Falling back to shielded Local Drive.");
                return caches.match(fetchRequest, { ignoreSearch: true }).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.destination === 'document') return caches.match('/index.html', { ignoreSearch: true });
                    return new Response('', { status: 503, statusText: 'Offline Asset Missing' });
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(fetchRequest, { ignoreSearch: true }).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                return fetch(fetchRequest).then((networkResponse) => {
                    
                    if (!networkResponse) return networkResponse;
                    
                    // V17.2 UNIFICATION: OPAQUE RESPONSE BYPASS FOR FIREBASE STORAGE
                    const isStandardValid = networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors');
                    const isOpaqueFirebase = isFirebaseStorage && networkResponse.type === 'opaque';

                    if (!isStandardValid && !isOpaqueFirebase) {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    if (isFirebaseStorage) {
                        caches.open(DYNAMIC_ASSET_VAULT).then((cache) => {
                            console.log(`[house-of-chiefs SW] Visa Asset Mirrored to Local Drive: ${url.pathname}`);
                            cache.put(fetchRequest, responseToCache);
                        });
                    } else {
                        caches.open(CACHE_NAME).then((cache) => cache.put(fetchRequest, responseToCache));
                    }
                    return networkResponse;
                }).catch(() => {
                    if (event.request.destination === 'document') {
                        console.warn("[house-of-chiefs SW] Network severed. Routing to offline Walled Garden Shield.");
                        return caches.match('/index.html', { ignoreSearch: true });
                    }
                    return new Response('', { status: 503, statusText: 'Offline Asset Missing' });
                });
            })
        );
    }
});