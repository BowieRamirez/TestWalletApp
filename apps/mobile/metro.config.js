const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch folders for monorepo
config.watchFolders = [
  workspaceRoot,
  path.resolve(workspaceRoot, 'packages/ui'),
  path.resolve(workspaceRoot, 'packages/api'),
  path.resolve(workspaceRoot, 'packages/security'),
  path.resolve(workspaceRoot, 'packages/config'),
];

// Resolve node_modules from both roots
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Handle pnpm symlinks
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
