Router.map(function() {
  this.route('manifest.webapp', {
    where: 'server',
    path: '/manifest.webapp',
    action: function() {
      var manifest = {
        "version": "0.1",
        "name": "FasterChat",
        "description": "Chat with your friends faster",
        "launch_path": "/",
        "appcache_path": "/offline.appcache",
        "icons": {
          "16": "/typewriter-icon.png",
          "48": "/typewriter-icon.png",
          "128": "/typewriter-icon.png"
        },
        "developer": {
          "name": "Tomáš Elfoslav Hromník",
          "url": "http://hromnik.com"
        }
      };
      var headers = {
        'Content-type': 'application/json; charset=utf-8'
      };
      this.response.writeHead(200, headers);
      this.response.end(JSON.stringify(manifest));
    }
  });
});