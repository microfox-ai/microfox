export type PackageMetaInfo = {
  /**
   * A displayable title of the package.
   */
  title: string,
  /**
   * A description of the package.
   */
  description: string,
  /**
   * type of package
   */
  type: 'internal' | 'external' | 'normal' | 'oauthConnector' | 'webhookConnector',
  /**
   * The type of platform the package is for.
   */
  platformType: 'tool' | 'agent' | 'internal',
  /**
   * status of the package
   */
  status: 'stable' | 'semiStable' | 'unstable' | 'deprecated' | 'experimental',
  /**
   * path to the icon of the package
   */
  iconUrl: string,
  /**
   * documentation of the package
   */
  documentation: string,
  /**
   * tags of the package
   */
  tags: string[],
  /**
   * path to the package in the repository
   */
  path: string,
  /**
   * Information about the constructors in the package.
   */
  constructors: ConstructorMetaInfo[],
};

export type KeyInfo = {
  /**
   * The key used to identify the configuration value.
   */
  key: string,
  /**
   * A user-friendly name for the key.
   */
  displayName: string,
  /**
   * A description of what the key is for.
   */
  description: string,
};

export type BotConfigKeyInfo = {
  /**
   * The key used to identify the configuration value.
   */
  key: string,
  /**
   * A user-friendly name for the key.
   */
  displayName: string,
  /**
   * A description of what the key is for.
   */
  description: string,
  /**
   * UI configuration for this bot setting.
   */
  ui: {
    /**
     * The type of UI element to display.
     */
    type: string,
    /**
     * The label for the UI element.
     */
    label: string,
    /**
     * The placeholder text for the UI element (optional).
     */
    placeholder: string,
  },
};

export type ConstructorMetaInfo = {
  /**
   * The name of the constructor function.
   */
  name: string,
  /**
   * A description of what the constructor does.
   */
  description: string,
  /**
   * The authentication method used by the constructor.
   */
  auth: string,
  /**
   * The type of API key, if auth is 'apikey'.
   */
  apiType: string,
  /**
   * The SDK to use for OAuth, if auth is 'oauth2'.
   */
  authSdk: string,
  /**
   * The authentication endpoint.
   */
  authEndpoint: string,
  /**
   * Keys required from the user.
   */
  requiredKeys: KeyInfo[],
  /**
   * Keys that are used internally and not exposed to the user.
   */
  internalKeys: KeyInfo[],
  /**
   * Configuration for bot-like features.
   */
  botConfig: BotConfigKeyInfo[],
  /**
   * A list of functionalities provided by the SDK instance.
   */
  functionalities: string[],
};
