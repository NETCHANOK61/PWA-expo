const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withPhoneQuery(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest.queries) {
      manifest.queries = [{}];
    }

    const queries = manifest.queries[0];
    if (!queries.intent) {
      queries.intent = [];
    }

    queries.intent.push({
      action: [{ $: { "android:name": "android.intent.action.DIAL" } }],
      data: [{ $: { "android:scheme": "tel" } }],
    });

    return config;
  });
};