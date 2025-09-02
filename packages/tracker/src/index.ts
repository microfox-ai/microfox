import { Project, SourceFile } from 'ts-morph';

/**
 * The context object passed to every tracker's logic function.
 */
export interface TrackerContext {
  /** All source files targeted by the tracker's config. */
  sourceFiles: SourceFile[];
  /** The instance of the ts-morph Project. */
  project: Project;
  /** A simple logger for providing feedback. */
  log: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}

/**
 * The configuration for a tracker.
 */
export interface TrackerConfig {
  /** An array of glob patterns, relative to the package root, to find target files. */
  targets: string[];
  /** Optional configuration for generating GitHub Actions. */
  github?: {
    /** The name of the GitHub Actions workflow job. */
    name: string;
    /** Standard GitHub Actions `on` trigger configuration. */
    on: {
      push?: { branches?: string[]; paths?: string[] };
      pull_request?: { branches?: string[]; paths?: string[] };
      schedule?: { cron: string }[];
    };
    /** Optional environment variables for the GitHub Actions job. */
    env?: Record<string, string>;
    /** Optional configuration for committing changes made by the tracker. */
    commit?: {
      /** Set to true to enable committing changes. */
      enabled: boolean;
      /** The message for the commit. */
      message?: string;
      /** The name of the environment variable holding a PAT for pushing. If not provided, it will default to using the workflow's GITHUB_TOKEN, which requires setting contents permissions. */
      patEnvName?: string;
    };
  };
}

/**
 * The logic function for a tracker.
 */
export type TrackerLogic = (context: TrackerContext) => Promise<void> | void;


/**
 * Defines a tracker. This is the main entry point for creating a tracker script.
 * @param config The configuration for the tracker.
 * @param logic The function containing the tracker's modification logic.
 * @returns A structured tracker object for the runner.
 */
export function defineTracker(config: TrackerConfig, logic: TrackerLogic) {
  return {
    config,
    logic,
  };
} 