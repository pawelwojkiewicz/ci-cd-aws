module.exports = function (config) {
    config.set({
        // ...other configuration settings...
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu']
            }
        },
        // Replace the default browsers array
        browsers: ['ChromeHeadlessNoSandbox'],
        // Optionally, disable watch mode so CI won't get stuck waiting for changes
        singleRun: true
    });
};
