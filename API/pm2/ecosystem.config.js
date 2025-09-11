
module.exports = {
  apps: [{
    name: "sf1-api",
    script: "./server.js",
    watch: true,
    env: {
      NODE_ENV: "production"
    }
  }]
};
