module.exports = {
  apps: [
    {
      name: 'murialdo-content-studio',
      script: 'src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
