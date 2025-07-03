const path = require('path');
const fs = require('fs');

/**
 * Registers the routes for the users module with the Express application.
 * @param {import('express').Application} app - The Express application instance.
 */
const register = (app) => {
  const modulePath = __dirname;
  
  // Scan for version directories (v1, v2, etc.) within the module
  fs.readdirSync(modulePath).forEach(versionName => {
    const versionPath = path.join(modulePath, versionName);
    if (fs.statSync(versionPath).isDirectory() && versionName.match(/^v[0-9]+$/)) {
      const routesPath = path.join(versionPath, 'routes');
      if (fs.existsSync(routesPath)) {
        fs.readdirSync(routesPath).forEach(file => {
          if (file.endsWith('.js')) {
            const router = require(path.join(routesPath, file));
            const apiPrefix = `/api/${versionName}/users`; // Hardcoding 'users' for now, will make dynamic later
            app.use(apiPrefix, router);
            console.log(`Loaded routes from users module (${versionName}) at ${apiPrefix}`);
          }
        });
      }
    }
  });
};

module.exports = { register };
