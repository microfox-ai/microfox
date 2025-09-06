import { deploySite, AwsRegion, GetRenderProgressInput, RenderMediaOnLambdaInput } from "@remotion/lambda";
import {
  getRenderProgress,
  renderMediaOnLambda,
  speculateFunctionName,
  presignUrl as presignUrlClient,
} from "@remotion/lambda/client";
import { DEFAULT_COMPOSITION_ID, DEFAULT_OUTPUT_NAME, DEFAULT_REGION, LambdaConfig } from "./constants";

/**
 * Note: The `deploy` function is now commented out because this package is designed
 * to be deployed as a standalone Remotion site using the Remotion CLI.
 *
 * To deploy this package, run `npx remotion deploy` from the package root.
 */
// export const deploy = async (options: {
//   siteName: string;
//   region: AwsRegion;
//   entryPoint: string;
//   bucketName: string;
// }) => {
//   const { siteName, region, entryPoint, bucketName } = options;
//   const { serveUrl } = await deploySite({
//     siteName,
//     region,
//     entryPoint,
//     bucketName,
//   });
//   return serveUrl;
// };

export const presignUrl = async (options: {
  region: AwsRegion;
  bucketName: string;
  objectKey: string;
  expiresInSeconds: number;
  checkIfObjectExists: boolean;
}) => {
  const { region, bucketName, objectKey, expiresInSeconds, checkIfObjectExists } = options;
  return await presignUrlClient({
    region,
    bucketName,
    objectKey,
    expiresInSeconds,
    checkIfObjectExists,
  });
};

export const render = async (options: {
  functionName?: string;
  diskSizeInMb?: number;
  memorySizeInMb?: number;
  timeoutInSeconds?: number;
  outputName?: string;
  region?: AwsRegion;
  codec?: RenderMediaOnLambdaInput["codec"];
  composition?: string;
} & Omit<RenderMediaOnLambdaInput, "functionName" | "downloadBehavior" | "codec" | "region" | "composition">) => {
  const {
    functionName,
    diskSizeInMb,
    memorySizeInMb,
    timeoutInSeconds,
    outputName,
    composition,
    codec,
    region,
    ...args
  } = options;

  const remotionFunctionName = functionName || speculateFunctionName({
    diskSizeInMb: diskSizeInMb || LambdaConfig.diskSizeInMb,
    memorySizeInMb: memorySizeInMb || LambdaConfig.memorySizeInMb,
    timeoutInSeconds: timeoutInSeconds || LambdaConfig.timeoutInSeconds,
  });

  return await renderMediaOnLambda({
    composition: composition || DEFAULT_COMPOSITION_ID,
    functionName: remotionFunctionName,
    downloadBehavior: {
      type: "download",
      fileName: outputName || DEFAULT_OUTPUT_NAME,
    },
    codec: codec || "h264",
    region: region || DEFAULT_REGION,
    // framesPerLambda: 100,
    ...args
  });
};

export const getProgress = async (options: {
  diskSizeInMb?: number;
  memorySizeInMb?: number;
  timeoutInSeconds?: number;
  functionName?: string;
  region?: AwsRegion;
} & Omit<GetRenderProgressInput, "functionName" | "region">) => {
  const {
    diskSizeInMb,
    memorySizeInMb,
    timeoutInSeconds,
    functionName,
    region,
    ...args
  } = options;

  const remotionFunctionName = functionName || speculateFunctionName({
    diskSizeInMb: diskSizeInMb || LambdaConfig.diskSizeInMb,
    memorySizeInMb: memorySizeInMb || LambdaConfig.memorySizeInMb,
    timeoutInSeconds: timeoutInSeconds || LambdaConfig.timeoutInSeconds,
  });

  return await getRenderProgress({
    functionName: remotionFunctionName,
    region: region || DEFAULT_REGION,
    ...args
  });
}; 