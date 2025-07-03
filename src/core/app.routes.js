const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const modulesPath = path.join(__dirname, '../modules');

fs.readdirSync(modulesPath).forEach(moduleName => {
  const modulePath = path.join(modulesPath, moduleName);
  if (fs.statSync(modulePath).isDirectory()) {
    
    const versionPath = path.join(modulePath);
    if (fs.statSync(versionPath).isDirectory()) {
      
      fs.readdirSync(versionPath).forEach(versionName => {
        const routesPath = path.join(versionPath, versionName);
        if (fs.statSync(routesPath).isDirectory()) {
          fs.readdirSync(routesPath).forEach(file => {
            if (file.endsWith('.routes.js')) {
              const route = require(path.join(routesPath, file));
              const apiPrefix = `/api/${versionName}/${moduleName}`;
              router.use(apiPrefix, route);
              console.log(`Loaded routes from ${moduleName} (${versionName}) at ${apiPrefix}`);
            }
          })
        }
      })
    }
  }
});

module.exports = router;