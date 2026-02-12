module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "react-native-iconify/babel",
        {
          icons: [
            // Tab bar
            "mdi:home",
            "mdi:credit-card",
            "mdi:chart-pie",
            "mdi:cog",
            // Auth screens
            "mdi:email-outline",
            "mdi:lock-outline",
            "mdi:account-outline",
            "mdi:google",
            "mdi:apple",
            // Home
            "mdi:bell-outline",
            "mdi:arrow-top-right",
            "mdi:arrow-bottom-left",
            "mdi:shopping-outline",
            "mdi:coffee-outline",
            "mdi:flash",
            "mdi:wifi",
            // Cards
            "mdi:snowflake",
            "mdi:file-document-outline",
            "mdi:refresh",
            "mdi:cog-outline",
            "mdi:plus",
            "mdi:credit-card-outline",
            "mdi:nfc",
            "mdi:contactless-payment",
            // Analytics
            "mdi:car",
            "mdi:filmstrip",
            "mdi:chevron-down",
            // Settings
            "mdi:earth",
            "mdi:weather-night",
            "mdi:shield-outline",
            "mdi:help-circle-outline",
            "mdi:chevron-right",
            "mdi:logout",
            // Biometric
            "mdi:fingerprint",
            // Forgot password
            "mdi:arrow-left",
            "mdi:lock-reset",
            // Check mark
            "mdi:check-circle",
          ],
        },
      ],
    ],
  };
};
