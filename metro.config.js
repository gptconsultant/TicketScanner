// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add any necessary extensions here
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;