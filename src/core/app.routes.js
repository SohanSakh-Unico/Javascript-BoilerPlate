const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const AppController = require('./app.controller');

// Global request filtering/middleware at the app level
router.use(AppController.filterRequest);

// Root path/health check
router.get('/', AppController.getRoot);

/**
 * Dynamically loads all module routes from the file system.
 */
const loadModuleRoutes = () => {
  const modulesPath = path.join(__dirname, '..', 'modules');

  fs.readdirSync(modulesPath).forEach(moduleName => {
    const modulePath = path.join(modulesPath, moduleName);
    if (fs.statSync(modulePath).isDirectory()) {
      // Scan for version directories (v1, v2, etc.) within the module
      fs.readdirSync(modulePath).forEach(versionName => {
        const versionPath = path.join(modulePath, versionName);
        if (fs.statSync(versionPath).isDirectory() && versionName.match(/^v[0-9]+$/)) {
          const routesDirPath = path.join(versionPath, 'routes');
          if (fs.existsSync(routesDirPath)) {
            fs.readdirSync(routesDirPath).forEach(file => {
              if (file.endsWith('.js')) {
                const moduleRouter = require(path.join(routesDirPath, file));
                const apiPrefix = `/api/${versionName}/${moduleName}`;
                router.use(apiPrefix, moduleRouter);
                console.log(`Loaded routes from ${moduleName} (${versionName}) file: ${file} at ${apiPrefix}`);
              }
            });
          }
        }
      });
    }
  });
};

// Load all module routes dynamically
loadModuleRoutes();

// This middleware must come after all routes to intercept responses
router.use(AppController.formatResponse);

module.exports = router;