import { z } from 'zod';
import * as schemas from '../schemas/liveThreads';

export type GetLiveByIds = z.infer<typeof schemas.getLiveByIdsSchema>;
export type CreateLiveThread = z.infer<typeof schemas.createLiveThreadSchema>;
export type GetHappeningNow = z.infer<typeof schemas.getHappeningNowSchema>;
export type DeleteLiveUpdate = z.infer<typeof schemas.deleteLiveUpdateSchema>;
export type EditLiveThread = z.infer<typeof schemas.editLiveThreadSchema>;
export type ManageDiscussion = z.infer<typeof schemas.manageDiscussionSchema>;
export type ManageContributor = z.infer<typeof schemas.manageContributorSchema>;
export type ReportLiveThread = z.infer<typeof schemas.reportLiveThreadSchema>;
export type RemoveContributor = z.infer<typeof schemas.removeContributorSchema>;
export type PostUpdate = z.infer<typeof schemas.postUpdateSchema>;
export type GetLiveUpdatesListing = z.infer<typeof schemas.getLiveUpdatesListingSchema>;
export type GetDiscussionsListing = z.infer<typeof schemas.getDiscussionsListingSchema>; 