import { Config } from "@remotion/cli/config";
import {enableTailwind} from '@remotion/tailwind-v4';

// This file tells the Remotion CLI where to find your compositions.
Config.setEntryPoint("src/remotion/index.ts");

// You can add other global configuration options here.
// See the Remotion documentation for more: https://www.remotion.dev/docs/config 
 
Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
