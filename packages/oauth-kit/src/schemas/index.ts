import { z } from 'zod';

/**
 * Holds information about a user.
 */
export const userInfoSchema = z.object({
  id: z.string().describe("The user's unique identifier."),
  name: z.string().optional().describe("The user's name."),
  email: z.string().optional().describe("The user's email address."),
  avatarUrl: z.string().optional().describe("URL for the user's avatar image."),
});

/**
 * Holds information about a team.
 */
export const teamInfoSchema = z.object({
  id: z.string().describe("The team's unique identifier."),
  name: z.string().optional().describe('The name of the team.'),
  icon: z.string().optional().describe('URL for the team image.'),
  description: z.string().optional().describe('The description of the team.'),
  coverImageUrl: z
    .string()
    .optional()
    .describe('URL for the team cover image.'),
});

/**
 * Holds information about an organisation.
 */
export const organisationInfoSchema = z.object({
  id: z.string().describe("The organisation's unique identifier."),
  name: z.string().optional().describe('The name of the organisation.'),
  icon: z.string().optional().describe('URL for the organisation image.'),
  description: z
    .string()
    .optional()
    .describe('The description of the organisation.'),
  coverImageUrl: z
    .string()
    .optional()
    .describe('URL for the organisation cover image.'),
});

/**
 * Holds information about the authentication provider.
 */
export const providerInfoSchema = z.object({
  provider: z
    .string()
    .describe('The name of the OAuth provider (e.g., "google", "github").'),
  providerUserId: z
    .string()
    .describe("The user's unique ID as given by the provider."),
  providerIcon: z.string().optional().describe('URL for the provider image.'),
});

/**
 * A comprehensive identity schema that can hold various pieces of information
 * about a user's identity, including from different sources.
 */
export const identitySchema = z.object({
  userInfo: userInfoSchema.optional(),
  teamInfo: teamInfoSchema.optional(),
  organisationInfo: organisationInfoSchema.optional(),
  providerInfo: providerInfoSchema.optional(),
});

export type Identity = z.infer<typeof identitySchema>;
export type UserInfo = z.infer<typeof userInfoSchema>;
export type TeamInfo = z.infer<typeof teamInfoSchema>;
export type OrganisationInfo = z.infer<typeof organisationInfoSchema>;
export type ProviderInfo = z.infer<typeof providerInfoSchema>;
