import YAML from 'yaml';
import { fetchGithubJson } from './github';

export type FunctionFile = {
  fileName: string;
  filePath: string;
  imports?: string[];
  exports?: string[];
};

export type Mutator = (
  yamlContent: string,
  functionFiles: FunctionFile[],
) => string | Promise<string>;

export const mutateServerlessYML = async (
  yamlContent: string,
  functionFiles: FunctionFile[],
  mutator?: Mutator,
) => {
  return batchMutateServerlessYML(
    yamlContent,
    functionFiles,
    mutator ? [mutator, packageMutator] : [packageMutator],
  );
};

export const batchMutateServerlessYML = async (
  yamlContent: string,
  functionFiles: FunctionFile[],
  mutators: Mutator[],
) => {
  let acc = yamlContent;
  for (const mutator of mutators) {
    acc = await mutator(acc, functionFiles);
  }
  return acc;
};

export type MicrofoxPackageMutator = (
  config: any,
  packageName: string,
) => Promise<any>;

export const microfoxPackageMutator: MicrofoxPackageMutator = async (
  config: any,
  packageName: string,
) => {
  let newConfig = { ...config };

  const packageServerlessPath = `/refs/heads/main/packages/${packageName.replace(
    '@microfox/',
    '',
  )}/config.serverless.json`;

  try {
    const jsonConfig = await fetchGithubJson(
      'microfox-ai',
      'microfox',
      packageServerlessPath,
    );

    if (jsonConfig) {
      // Merge provider config
      if (jsonConfig.provider) {
        newConfig.provider = { ...newConfig.provider, ...jsonConfig.provider };
      }

      // Merge package config
      if (jsonConfig.package) {
        if (!newConfig.package) {
          newConfig.package = {};
        }
        const existingInclude = newConfig.package.include || [];
        const jsonInclude = jsonConfig.package.include || [];
        const existingExclude = newConfig.package.exclude || [];
        const jsonExclude = jsonConfig.package.exclude || [];

        newConfig.package = {
          ...newConfig.package,
          ...jsonConfig.package,
          include: [...new Set([...existingInclude, ...jsonInclude])],
          exclude: [...new Set([...existingExclude, ...jsonExclude])],
        };
      }

      // Merge functions config
      if (jsonConfig.functions && newConfig.functions) {
        const functionSettingsToApply = { ...jsonConfig.functions };
        const layersToApply = functionSettingsToApply.layers;
        delete functionSettingsToApply.layers; // We'll handle layers separately due to merging arrays.

        newConfig.functions = Object.entries(newConfig.functions).reduce(
          (acc, [functionName, functionConfig]) => {
            const currentConfig = functionConfig as any;
            const updatedConfig = {
              ...currentConfig,
              ...functionSettingsToApply,
            };

            if (layersToApply) {
              const existingLayers = currentConfig.layers || [];
              updatedConfig.layers = [
                ...new Set([...existingLayers, ...layersToApply]),
              ];
            }

            return {
              ...acc,
              [functionName]: updatedConfig,
            };
          },
          {},
        );
      }
    }
  } catch (error) {
    console.error('No config found for package', packageName);
  }

  // set default
  // if (!newConfig.package) {
  //   newConfig.package = {};
  // }
  // newConfig.package.individually = true;

  return newConfig;
};

export const packageMutator: Mutator = async (
  yamlContent: string,
  functionFiles: FunctionFile[],
) => {
  const config = YAML.parse(yamlContent);
  let newConfig = { ...config };

  const allMicrofoxPackages = new Set<string>();

  functionFiles.forEach(func => {
    func.imports?.forEach(importPath => {
      if (importPath.includes('@microfox/')) {
        allMicrofoxPackages.add(importPath);
      }
    });
  });

  for (const pkg of Array.from(allMicrofoxPackages)) {
    newConfig = await microfoxPackageMutator(newConfig, pkg);
  }

  return YAML.stringify(newConfig);
};
