/**
 * Custom AssetRegistry to replace the problematic React Native one
 */

const AssetRegistry = require('@react-native/assets-registry/registry');

export default {
  registerAsset: (asset) => AssetRegistry.registerAsset(asset),
  getAssetByID: (assetId) => AssetRegistry.getAssetByID(assetId),
};