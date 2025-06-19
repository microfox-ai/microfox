import { z } from 'zod';
import * as schemas from '../schemas/collections';

export type Collection = z.infer<typeof schemas.collectionSchema>;
export type CollectionWithLinks = z.infer<typeof schemas.collectionWithLinksSchema>;
export type AddOrRemovePostFromCollection = z.infer<typeof schemas.addOrRemovePostFromCollectionSchema>;
export type CreateCollection = z.infer<typeof schemas.createCollectionSchema>;
export type DeleteCollection = z.infer<typeof schemas.deleteCollectionSchema>;
export type ReorderCollection = z.infer<typeof schemas.reorderCollectionSchema>;
export type GetSubredditCollections = z.infer<typeof schemas.getSubredditCollectionsSchema>;
export type UpdateCollectionDescription = z.infer<typeof schemas.updateCollectionDescriptionSchema>;
export type UpdateCollectionDisplayLayout = z.infer<typeof schemas.updateCollectionDisplayLayoutSchema>;
export type UpdateCollectionTitle = z.infer<typeof schemas.updateCollectionTitleSchema>;
export type GetCollection = z.infer<typeof schemas.getCollectionSchema>; 