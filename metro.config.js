const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  // Lấy cấu hình mặc định
  const defaultConfig = await getDefaultConfig(__dirname);
  const {
    resolver: { sourceExts, assetExts },
  } = defaultConfig;

  // Cấu hình bổ sung cho việc xử lý file svg
  const customConfig = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };

  // Hợp nhất cấu hình mặc định và cấu hình tùy chỉnh
  return mergeConfig(defaultConfig, customConfig);
})();
