module.exports = {
    apps: [{
      name: "vue-app",
      script: "node_modules/http-server/bin/http-server",
      args: "dist -p 443"
    }]
  }