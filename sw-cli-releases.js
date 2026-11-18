/* Только браузерные уведомления о выпусках CLI. Страницы и файлы не кэширует. */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

function releaseUrl (value) {
  const fallback = new URL('/klepa-cli/#update', self.location.origin)
  try {
    const url = new URL(value || fallback.href, self.location.origin)
    return url.origin === fallback.origin && url.pathname === fallback.pathname ? url.href : fallback.href
  } catch {
    return fallback.href
  }
}

self.addEventListener('push', (event) => {
  let payload = {}
  try {
    const data = event.data?.json()
    if (data && typeof data === 'object') { payload = data }
  } catch {
    // Malformed payload still produces a useful, safe notification.
  }
  const title = typeof payload.title === 'string' ? payload.title.slice(0, 120) : 'Новая версия Клёпы'
  event.waitUntil(self.registration.showNotification(title, {
    body: typeof payload.body === 'string' ? payload.body.slice(0, 500) : 'Откройте инструкцию по обновлению CLI.',
    icon: '/images/klepa-mark.png',
    badge: '/images/klepa-mark.png',
    tag: 'klepa-cli-release',
    renotify: false,
    data: { url: releaseUrl(payload.url) }
  }))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = releaseUrl(event.notification.data?.url)
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of windows) {
      const url = new URL(client.url)
      if (url.origin === self.location.origin && url.pathname === '/klepa-cli/') {
        try {
          if (client.navigate) { await client.navigate(target) }
          return await client.focus()
        } catch {
          // The tab may have closed between matchAll and the click handler.
        }
      }
    }
    return self.clients.openWindow(target)
  })())
})
