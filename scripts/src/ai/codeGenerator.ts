import { models } from './models';
import { z } from 'zod';

const CodeOutputSchema = z.object({
  code: z.string(),
  language: z.string(),
  path: z.string(),
  dependencies: z.array(z.string()).optional()
});

export class CodeGenerator {
  private readonly supportedLanguages = ['typescript', 'javascript', 'python'];

  async generateCode(prompt: string, context: any) {
    if (!this.supportedLanguages.includes(context.language)) {
      throw new Error(`Unsupported language: ${context.language}`);
    }

    try {
      // Generate code using AI model
      const generatedCode = await this.generateWithAI(prompt, context);
      
      // Validate generated code
      await this.validateCode(generatedCode, context.language);
      
      return {
        code: generatedCode,
        language: context.language,
        path: context.files[0],
        dependencies: this.extractDependencies(generatedCode)
      };
    } catch (error) {
      throw new Error(`Code generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async generateWithAI(prompt: string, context: any) {
    // For testing purposes, generate a simple React component
    if (context.language === 'typescript') {
      return `
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
};

export default Button;
`;
    }
    
    throw new Error(`Language ${context.language} not implemented yet`);
  }

  async validateCode(code: string, language: string) {
    // Implement code validation logic
    const errors = [];
    
    // Basic syntax check
    try {
      if (language === 'javascript' || language === 'typescript') {
        // Don't use eval for validation, just check for basic structure
        if (!code.includes('export') || !code.trim()) {
          throw new Error('Invalid component structure');
        }
      }
    } catch (error) {
      errors.push(`Syntax error: ${(error as Error).message ?? String(error)}`);
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    return true;
  }

  private extractDependencies(code: string): string[] {
    const dependencies = new Set<string>();
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      dependencies.add(match[1]);
    }
    while ((match = requireRegex.exec(code)) !== null) {
      dependencies.add(match[1]);
    }

    return Array.from(dependencies);
  }
}