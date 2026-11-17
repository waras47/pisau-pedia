self.addEventListener("push", function (event) {
  if (!event.data) return;

  var data;
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: "Pisau Pedia", body: event.data.text() };
  }

  var options = {
    body: data.body || "",
    icon: data.icon || "/logo-pisaupedia.png",
    badge: "/logo-pisaupedia.png",
    tag: data.tag || "pisaupedia",
    data: { url: data.url || "/pisaupedia/admin" },
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(data.title || "Pisau Pedia", options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url = event.notification.data && event.notification.data.url ? event.notification.data.url : "/pisaupedia/admin";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.indexOf("/pisaupedia/admin") !== -1 && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
