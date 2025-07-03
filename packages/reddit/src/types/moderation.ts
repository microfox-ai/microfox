import { z } from 'zod';
import * as schemas from '../schemas/moderation';

export type GetModLog = z.infer<typeof schemas.getModLogSchema>;
export type GetModListing = z.infer<typeof schemas.getModListingSchema>;
export type Approve = z.infer<typeof schemas.approveSchema>;
export type Distinguish = z.infer<typeof schemas.distinguishSchema>;
export type IgnoreReports = z.infer<typeof schemas.ignoreReportsSchema>;
export type LeaveContributor = z.infer<typeof schemas.leaveContributorSchema>;
export type LeaveModerator = z.infer<typeof schemas.leaveModeratorSchema>;
export type Remove = z.infer<typeof schemas.removeSchema>;
export type ShowComment = z.infer<typeof schemas.showCommentSchema>;
export type SnoozeReports = z.infer<typeof schemas.snoozeReportsSchema>;
export type UpdateCrowdControlLevel = z.infer<typeof schemas.updateCrowdControlLevelSchema>; 