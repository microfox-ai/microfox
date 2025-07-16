export type OutputUiSupport =
  | {
      type: 'sticky';
      uiType: 'header' | 'footer';
      stickyUntilStep: number;
      /**
       * The exact csubfield in the namespace to map to render the component
       */
      mapInNameSpace: string;
      /**
       * The mapper function stringified ( takes in the data )
       */
      mapperFunction?: string;
    }
  | {
      type: 'main';
      /**
       * The exact subfield in the namespace to map to the component
       */
      mapInNameSpace: string;
      /**
       * The mapper function stringified
       */
      mapperFunction?: string;
    }
  | {
      type: 'expansion';
      uiType: 'right-column' | 'fullscreen';
      openOn: 'click' | 'hover';
      defaultOpen?: boolean;
      /**
       * The exact subfield in the namespace to map to the component
       */
      mapInNameSpace: string;
      /**
       * The mapper function stringified
       */
      mapperFunction?: string;
    };

export type OutputUi = {
  version: '1.0.0';
  namespace: 'common' | string;
  supports: OutputUiSupport[];
};

export type AgentUi = {
  outputUi?: OutputUi;
};
