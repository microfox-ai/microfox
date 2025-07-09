import { RagUpstashSdkConfigSchema, RagUpstashSdkConfig } from './schemas';
import {
  FusionAlgorithm,
  Index,
  QueryMode,
  SparseVector,
  WeightingStrategy,
} from '@upstash/vector';

/**
 * RagUpstashSdk - A TypeScript SDK template
 *
 */
export class RagUpstashSdk<TMetadata extends Record<string, any>> {
  private config: RagUpstashSdkConfig;
  private index: Index<TMetadata>;

  /**
   * Create a new RagUpstashSdk instance
   *
   * @param config - Configuration for the SDK
   */
  constructor(config: RagUpstashSdkConfig) {
    // Validate configuration using Zod schema
    this.config = RagUpstashSdkConfigSchema.parse(config);
    this.index = new Index<TMetadata>({
      url: this.config.upstashUrl ?? process.env.UPSTASH_VECTOR_REST_URL,
      token: this.config.upstashToken ?? process.env.UPSTASH_VECTOR_REST_TOKEN,
    });
  }

  /**
   * Get current configuration
   *
   * @returns Copy of the current config
   */
  getConfig(): RagUpstashSdkConfig {
    return { ...this.config };
  }

  async feedDocsToRAG<TIMetadata extends Record<string, any> = TMetadata>(
    docs: {
      id?: string;
      metadata: TIMetadata;
      doc: string;
    }[],
    namespace?: string
  ) {
    if (namespace) {
      const ns_index = this.index.namespace(namespace);
      const vectors = await ns_index.upsert<Record<string, any>>(
        docs.map((doc) => ({
          id: doc.id ?? crypto.randomUUID(),
          data: doc.doc,
          metadata: doc.metadata,
        }))
      );
      return vectors;
    }
    const vectors = await this.index.upsert<Record<string, any>>(
      docs.map((doc) => ({
        id: doc.id ?? crypto.randomUUID(),
        data: doc.doc,
        metadata: doc.metadata,
      }))
    );
    return vectors;
  }

  async queryDocsFromRAG<
    TQueryMetadata extends Record<string, any> = TMetadata,
  >(
    query: {
      data: string;
      topK: number;
      filter?: string;
      includeData?: boolean;
      includeMetadata?: boolean;
    },
    namespace?: string
  ) {
    if (namespace) {
      const vectors = await this.index.query<TQueryMetadata>(query, {
        namespace,
      });
      return vectors;
    }
    const vectors = await this.index.query<TQueryMetadata>(query);
    return vectors;
  }

  async getDocFromRAG<TQueryMetadata extends Record<string, any> = TMetadata>(
    id: string,
    namespace?: string
  ) {
    if (namespace) {
      return this.index.fetch<TQueryMetadata>(
        {
          ids: [id],
        },
        { namespace }
      );
    }
    return this.index.fetch<TQueryMetadata>({ ids: [id] });
  }

  async deleteDocFromRAG(id: string, namespace?: string) {
    if (namespace) {
      return this.index.delete({ ids: [id] }, { namespace });
    }
    return this.index.delete({ ids: [id] });
  }

  // Direct mapping of all Index methods

  /**
   * Delete items from the index
   */
  delete(args: any, options?: { namespace?: string }) {
    return this.index.delete(args, options);
  }

  /**
   * Query the index
   */
  query<TQueryMetadata extends Record<string, any> = TMetadata>(
    args: any,
    options?: { namespace?: string }
  ) {
    return this.index.query<TQueryMetadata>(args, options);
  }

  /**
   * Query multiple vectors at once
   */
  queryMany<TQueryMetadata extends Record<string, any> = TMetadata>(
    args: any,
    options?: { namespace?: string }
  ) {
    return this.index.queryMany<TQueryMetadata>(args, options);
  }

  /**
   * Initialize a resumable query operation
   */
  resumableQuery<TQueryMetadata extends Record<string, any> = TMetadata>(
    args: any,
    options?: { namespace?: string }
  ) {
    return this.index.resumableQuery<TQueryMetadata>(args, options);
  }

  /**
   * Upsert items into the index
   */
  upsert<TUpsertMetadata extends Record<string, any> = TMetadata>(
    args: any,
    options?: { namespace?: string }
  ) {
    return this.index.upsert<TUpsertMetadata>(args, options);
  }

  /**
   * Update items in the index
   */
  update<TUpdateMetadata extends Record<string, any> = TMetadata>(
    args: any,
    options?: { namespace?: string }
  ) {
    return this.index.update<TUpdateMetadata>(args, options);
  }

  /**
   * Fetch items from the index
   */
  fetch<TFetchMetadata extends Record<string, any> = TMetadata>(
    payload: any,
    opts?: any
  ) {
    return this.index.fetch<TFetchMetadata>(payload, opts);
  }

  /**
   * Reset the index
   */
  reset(options?: any) {
    return this.index.reset(options);
  }

  /**
   * Get a range of items from the index
   */
  range<TRangeMetadata extends Record<string, any> = TMetadata>(
    args: any,
    options?: { namespace?: string }
  ) {
    return this.index.range<TRangeMetadata>(args, options);
  }

  /**
   * Get info about the index
   */
  info() {
    return this.index.info();
  }

  /**
   * List all namespaces
   */
  listNamespaces() {
    return this.index.listNamespaces();
  }

  /**
   * Delete a namespace
   */
  deleteNamespace(namespace: string) {
    return this.index.deleteNamespace(namespace);
  }
}
