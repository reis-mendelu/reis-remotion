/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';
import path from "path";

Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((currentConfiguration) => {
  const configWithTailwind = enableTailwind(currentConfiguration);
  
  return {
    ...configWithTailwind,
    resolve: {
      ...configWithTailwind.resolve,
      alias: {
        ...(configWithTailwind.resolve?.alias || {}),
        "@": path.resolve(__dirname, "../reis/src"),
      },
    },
  };
});
