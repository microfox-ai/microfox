interface GenerationMetrics {
  success: boolean;
  executionTime: number;
  tokenCount: number;
  errorRate: number;
}

interface PerformanceLog {
  timestamp: string;
  prompt: string;
  result: GenerationMetrics;
}