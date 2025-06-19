import { z } from 'zod';
import * as schemas from '../schemas/account';
import { userSchema } from '../schemas';

export type GetPrefsFields = z.infer<typeof schemas.getPrefsFieldsSchema>;
export type KarmaBreakdown = z.infer<typeof schemas.karmaBreakdownSchema>;
export type Trophy = z.infer<typeof schemas.trophySchema>;
export type TrophyList = z.infer<typeof schemas.trophyListSchema>;
export type UpdatePrefs = z.infer<typeof schemas.updatePrefsSchema>;
export type User = z.infer<typeof userSchema>;
export type Relationship = z.infer<typeof schemas.relationshipSchema>;
export type RelationshipListing = z.infer<typeof schemas.relationshipListingSchema>;
export type UserThing = z.infer<typeof schemas.userThingSchema>;
export type UserListing = z.infer<typeof schemas.userListingSchema>; 