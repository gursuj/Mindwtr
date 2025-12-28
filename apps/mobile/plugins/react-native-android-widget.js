function tryLoadPlugin() {
    const candidates = [
        'react-native-android-widget',
        'react-native-android-widget/app.plugin',
        'react-native-android-widget/app.plugin.js',
    ];

    for (const id of candidates) {
        try {
            const mod = require(id);
            return mod?.default ?? mod;
        } catch (error) {
            // ignore and try next candidate
        }
    }

    return null;
}

module.exports = function withAndroidWidget(config, props = {}) {
    const plugin = tryLoadPlugin();
    if (typeof plugin === 'function') {
        return plugin(config, props);
    }

    return { ...config };
};
