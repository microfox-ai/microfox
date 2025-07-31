import { FontuseSdkConfig, FontuseSdkConfigSchema } from './schemas';
import { CrudHash } from '@microfox/db-upstash';
import { RagUpstashSdk } from '@microfox/rag-upstash';
import { Redis } from '@upstash/redis';
import {
  Font,
  Usecase,
  UseCaseMetadata,
  UseCaseWithFont,
} from './schemas/types';

/**
 * FontuseSdk - A TypeScript SDK template
 */
export class FontUse {
  private config: FontuseSdkConfig;
  private redis: Redis;
  private crudHash: CrudHash<Font>;
  private rag: RagUpstashSdk<UseCaseMetadata>;

  /**
   * Create a new FontuseSdk instance
   *
   * @param config - Configuration for the SDK
   */
  constructor(config: FontuseSdkConfig) {
    // Validate configuration using Zod schema
    this.config = FontuseSdkConfigSchema.parse(config);

    this.redis = new Redis({
      url: this.config.redisUrl ?? process.env.FONTUSE_REDIS_REST_URL,
      token: this.config.redisToken ?? process.env.FONTUSE_REDIS_REST_TOKEN,
    });

    this.crudHash = new CrudHash(this.redis, 'fontuse');

    this.rag = new RagUpstashSdk({
      upstashUrl: this.config.ragUrl ?? process.env.FONTUSE_VECTOR_REST_URL,
      upstashToken:
        this.config.ragToken ?? process.env.FONTUSE_VECTOR_REST_TOKEN,
    });
  }

  /**
   * Get current configuration
   *
   * @returns Copy of the current config
   */
  getConfig(): FontuseSdkConfig {
    return { ...this.config };
  }

  async getFont(id: string): Promise<Font | null> {
    return this.crudHash.get(id);
  }

  async getFontUsecase(id: string): Promise<UseCaseMetadata[] | null> {
    // TODO: Add pagination
    const docs = await this.rag.getDocFromRAG(id + '-*', 'fontuse');
    if (!docs) return null;
    return docs.map((doc) => doc?.metadata as UseCaseMetadata).filter(Boolean);
  }

  async queryFonts(
    query: string,
    options: {
      topk: number;
      filter?: string;
    }
  ): Promise<UseCaseWithFont[]> {
    const results = await this.rag.queryDocsFromRAG(
      {
        data: query,
        topK: options.topk,
        filter: options.filter,
        includeData: true,
        includeMetadata: true,
      },
      'fontuse'
    );
    const usecases = results
      .map((result) => result?.metadata as UseCaseMetadata)
      .filter(Boolean);
    const fontNames = usecases
      .map((usecase) => usecase.id.split('-')[0])
      .filter(Boolean);
    const uniqueFontNames = [...new Set(fontNames)];
    const fonts = await Promise.all(
      uniqueFontNames.map((fontName) => this.getFont(fontName))
    );
    return usecases.map((usecase) => {
      const font = fonts.find(
        (font) => font?.name === usecase.id.split('-')[0]
      );
      return {
        ...usecase,
        font,
      };
    });
  }
}
