// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adicionar suporte para mapas
  'glb',
  'gltf',
  'png',
  'jpg'
);

module.exports = config;