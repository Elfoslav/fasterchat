Router.map(function() {
  this.route('manifest.webapp', {
    where: 'server',
    path: '/manifest.webapp',
    action: function() {
      var manifest = {
        "version": "0.0.1",
        "name": "FasterChat",
        "description": "Chat with your friends faster. \nSee what your friend is typing right now, every single letter.",
        "launch_path": "/",
        "icons": {
          "16": "/icon_16.png",
          "48": "/icon_48.png",
          "128": "/icon_128.png"
        },
        "developer": {
          "name": "Tomáš Elfoslav Hromník",
          "url": "http://hromnik.com"
        }
      };
      var headers = {
        'Content-type': 'application/x-web-app-manifest+json; charset=utf-8'
      };
      this.response.writeHead(200, headers);
      this.response.end(JSON.stringify(manifest));
    }
  });
});