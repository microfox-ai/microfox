/** Represents a single message exchanged between user and agent. */
export interface Message {
  /** Message sender's role */
  role: 'user' | 'agent';
  /** Message content */
  parts: Part[];
  /** Extension metadata. */
  metadata?: {
    [key: string]: any;
  };
  /** The URIs of extensions that are present or contributed to this Message. */
  extensions?: string[];
  /** List of tasks referenced as context by this message.*/
  referenceTaskIds?: string[];
  /** Identifier created by the message creator*/
  messageId: string;
  /** Identifier of task the message is related to */
  taskId?: string;
  /** The context the message is associated with */
  contextId?: string;
  /** Event type */
  kind: 'message';
}

export type Part = TextPart | FilePart | DataPart;

/** Represents a text segment within parts.*/
export interface TextPart extends PartBase {
  /** Part type - text for TextParts*/
  kind: 'text';
  /** Text content */
  text: string;
}
/** Represents a File segment within parts.*/
export interface FilePart extends PartBase {
  /** Part type - file for FileParts */
  kind: 'file';
  /** File content either as url or bytes */
  file: FileWithBytes | FileWithUri;
}

/** Represents a structured data segment within a message part. */
export interface DataPart extends PartBase {
  /** Part type - data for DataParts */
  kind: 'data';
  /** Structured data content
   */
  data: {
    [key: string]: any;
  };
}

/** Define the variant where 'bytes' is present and 'uri' is absent */
export interface FileWithBytes extends FileBase {
  /** base64 encoded content of the file*/
  bytes: string;
  uri?: never;
}

/** Define the variant where 'uri' is present and 'bytes' is absent  */
export interface FileWithUri extends FileBase {
  /** URL for the File content */
  uri: string;
  bytes?: never;
}

/** Represents an artifact generated for a task. */
export interface Artifact {
  /** Unique identifier for the artifact. */
  artifactId: string;
  /** Optional name for the artifact. */
  name?: string;
  /** Optional description for the artifact. */
  description?: string;
  /** Artifact parts. */
  parts: Part[];
  /** Extension metadata. */
  metadata?: {
    [key: string]: any;
  };
  /** The URIs of extensions that are present or contributed to this Artifact. */
  extensions?: string[];
}
