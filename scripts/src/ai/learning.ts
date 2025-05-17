interface LearningMetrics {
  successfulPatterns: Map<string, number>;
  failurePatterns: Map<string, number>;
  improvements: string[];
}