import { z } from 'zod';
import {
  connectGitHubRepositoryParamsSchema,
  disconnectGitHubRepositoryParamsSchema,
  getConnectedRepositoriesParamsSchema,
  integrationDetailsSchema,
} from '../types';

export const connectGitHubRepositorySchema = connectGitHubRepositoryParamsSchema;

export const disconnectGitHubRepositorySchema = disconnectGitHubRepositoryParamsSchema;

export const getConnectedRepositoriesSchema = getConnectedRepositoriesParamsSchema;

export const integrationDetailsResponseSchema = integrationDetailsSchema;
