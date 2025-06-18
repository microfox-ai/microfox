import { z } from 'zod';
import { postSchema } from './index';

export const collectionSchema = z.object({
    collection_id: z.string().uuid().describe('The UUID of the collection.'),
    title: z.string().max(300).describe('The title of the collection.'),
    description: z.string().max(500).describe('The description of the collection.'),
    author_name: z.string().describe("The author's username."),
    author_id: z.string().describe("The author's fullname."),
    created_at_utc: z.number().describe('The UTC timestamp of when the collection was created.'),
    display_layout: z.enum(['TIMELINE', 'GALLERY']).describe('The display layout of the collection.'),
    last_update_utc: z.number().describe('The UTC timestamp of the last update.'),
    link_ids: z.array(z.string()).describe('A list of post fullnames in the collection.'),
    permalink: z.string().url().describe('The permalink of the collection.'),
    subreddit_id: z.string().describe('The fullname of the subreddit.'),
    post_count: z.number().int().describe('The number of posts in the collection.'),
}).catchall(z.any());

export const collectionWithLinksSchema = collectionSchema.extend({
    links: z.array(postSchema).describe('The full post objects within the collection.'),
});

export const addOrRemovePostFromCollectionSchema = z.object({
    collection_id: z.string().uuid().describe('The UUID of the collection.'),
    link_fullname: z.string().describe('The fullname of the link/post.'),
});

export const createCollectionSchema = z.object({
    title: z.string().max(300).describe('The title for the new collection.'),
    description: z.string().max(500).optional().describe('The description for the new collection.'),
    display_layout: z.enum(['TIMELINE', 'GALLERY']).optional().describe('The display layout.'),
    sr_fullname: z.string().describe('The fullname of the subreddit to create the collection in.'),
});

export const deleteCollectionSchema = z.object({
    collection_id: z.string().uuid().describe('The UUID of the collection to delete.'),
});

export const reorderCollectionSchema = z.object({
    collection_id: z.string().uuid().describe('The UUID of the collection.'),
    link_ids: z.string().describe('A comma-separated list of post fullnames in the desired order.'),
});

export const getSubredditCollectionsSchema = z.object({
    sr_fullname: z.string().describe('The fullname of the subreddit.'),
});

export const updateCollectionDescriptionSchema = z.object({
    collection_id: z.string().uuid().describe('The UUID of the collection.'),
    description: z.string().max(500).describe('The new description for the collection.'),
});

export const updateCollectionDisplayLayoutSchema = z.object({
    collection_id: z.string().uuid().describe('The UUID of the collection.'),
    display_layout: z.enum(['TIMELINE', 'GALLERY']).describe('The new display layout.'),
});

export const updateCollectionTitleSchema = z.object({
    collection_id: z.string().uuid().describe('The UUID of the collection.'),
    title: z.string().max(300).describe('The new title for the collection.'),
});

export const getCollectionSchema = z.object({
    collection_id: z.string().uuid().describe('The UUID of the collection.'),
    include_links: z.boolean().optional().describe('Whether to include the full post objects.'),
}); 