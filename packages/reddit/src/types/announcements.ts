import { z } from 'zod';
import * as schemas from '../schemas/announcements';

export type Announcement = z.infer<typeof schemas.announcementSchema>;
export type AnnouncementListing = z.infer<typeof schemas.announcementListingSchema>;
export type GetAnnouncementsParams = z.infer<typeof schemas.getAnnouncementsParamsSchema>;
export type AnnouncementIds = z.infer<typeof schemas.announcementIdsSchema>; 