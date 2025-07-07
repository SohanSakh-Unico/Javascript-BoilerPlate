const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const AppController = require('./app.controller');
const asyncController = require('./lib/middlewares/asyncController');

const createRouter = async () => {
  const router = express.Router();

  // Global request filtering
  router.use(AppController.filterRequest);

  // Health check
  router.get('/', AppController.getRoot);

  const modulesPath = path.join(__dirname, '..', 'modules');

  try {
    const moduleNames = await fs.readdir(modulesPath);

    await Promise.all(moduleNames.map(async moduleName => {
      const modulePath = path.join(modulesPath, moduleName);
      const moduleStat = await fs.stat(modulePath).catch(() => null);
      if (!moduleStat?.isDirectory()) return;

      const versionNames = await fs.readdir(modulePath);
      await Promise.all(versionNames.map(async versionName => {
        const versionPath = path.join(modulePath, versionName);
        const versionStat = await fs.stat(versionPath).catch(() => null);
        if (!versionStat?.isDirectory() || !/^v[0-9]+$/.test(versionName)) return;

        const routesDirPath = path.join(versionPath, 'routes');
        let files;

        try {
          files = await fs.readdir(routesDirPath);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.error(`Error reading routes directory: ${routesDirPath}`, error);
          }
          return;
        }

        await Promise.all(files.map(async file => {
          if (!file.endsWith('.js')) return;

          const routeFilePath = path.join(routesDirPath, file);
          let moduleRouter;

          try {
            moduleRouter = require(routeFilePath);
          } catch (err) {
            console.error(`Failed to load router from ${routeFilePath}:`, err);
            return;
          }

          if (
            typeof moduleRouter !== 'function' ||
            typeof moduleRouter.use !== 'function' ||
            !Array.isArray(moduleRouter.stack)
          ) {
            console.warn(`Invalid Express Router export in: ${routeFilePath}`);
            return;
          }

          // Wrap handlers with asyncController
          moduleRouter.stack.forEach(layer => {
            if (layer.route) {
              layer.route.stack.forEach(routeLayer => {
                routeLayer.handle = asyncController(routeLayer.handle);
              });
            }
          });

          const apiPrefix = `/api/${versionName}/${moduleName}`;
          router.use(apiPrefix, moduleRouter);

          if (process.env.NODE_ENV !== 'production') {
            console.log(`✅ Loaded ${file} → ${apiPrefix}`);
          }
        }));
      }));
    }));
  } catch (err) {
    console.error(' Critical: Failed to load dynamic routes:', err);
  }

  // Final response middleware
  router.use(AppController.formatResponse);

  return router;
};

module.exports = createRouter;