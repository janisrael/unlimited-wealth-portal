const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

module.exports = {
  // ... other config options
  //devtool: "source-map", // Source map generation must be turned on
  plugins: [
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "datageniq",
      project: "uw-portal-app",
      release: process.env.RELEASE,
    }),
  ],
};