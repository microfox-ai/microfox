export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

// Type for form values
type FormValues = Record<string, string>;

// Remove external package imports and define our own types
type JsonSchema = {
    type?: string;
    format?: string;
    description?: string;
    properties?: Record<string, JsonSchema>;
    items?: JsonSchema;
    required?: string[];
    enum?: any[];
    default?: any;
    additionalProperties?: boolean | JsonSchema;
    oneOf?: JsonSchema[];
    anyOf?: JsonSchema[];
    allOf?: JsonSchema[];
    $ref?: string;
    $defs?: Record<string, JsonSchema>;
    [key: string]: any;
};

type OpenAPISchema = {
    type?: string;
    format?: string;
    description?: string;
    properties?: Record<string, OpenAPISchema>;
    items?: OpenAPISchema;
    required?: string[];
    example?: any;
    enum?: any[];
    default?: any;
    additionalProperties?: boolean | OpenAPISchema;
    oneOf?: OpenAPISchema[];
    anyOf?: OpenAPISchema[];
    allOf?: OpenAPISchema[];
    $ref?: string;
};

type OpenAPIParameter = {
    name: string;
    in: "query" | "path" | "header" | "cookie" | "body";
    required?: boolean;
    schema: OpenAPISchema;
    description?: string;
    example?: any;
}

type OpenAPIContent = {
    schema: OpenAPISchema;
}

type OpenAPIResponse = {
    description: string;
    content?: {
        [key: string]: OpenAPIContent;
    };
};

type OpenAPIRequestBody = {
    required?: boolean;
    content: {
        [key: string]: OpenAPIContent;
    };
};

type OpenAPIOperation = {
    summary?: string;
    description?: string;
    operationId?: string;
    tags?: string[];
    parameters?: OpenAPIParameter[];
    requestBody?: OpenAPIRequestBody;
    responses: {
        [key: string]: OpenAPIResponse;
    };
    instructions?: string;
    method?: string;
    path?: string;
};

type OpenAPIPath = {
    [method: string]: OpenAPIOperation;
};

type OpenAPIDoc = {
    openapi: string;
    servers: {
        url: string;
        description: string;
    }[];
    info: {
        title: string;
        version: string;
        description?: string;
    };
    paths: {
        [path: string]: OpenAPIPath;
    };
    components?: {
        schemas?: Record<string, OpenAPISchema>;
    };
};

export type { HttpMethod, FormValues, JsonSchema, OpenAPISchema, OpenAPIParameter, OpenAPIContent, OpenAPIResponse, OpenAPIRequestBody, OpenAPIOperation, OpenAPIPath, OpenAPIDoc };
