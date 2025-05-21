import { z } from 'zod';

// Base schemas that are reused across multiple response types
export const ThumbnailSchema = z.object({
  src: z.string(),
  original: z.string().optional(),
});

export const MetaUrlSchema = z.object({
  scheme: z.string(),
  netloc: z.string(),
  hostname: z.string().optional(),
  favicon: z.string(),
  path: z.string(),
});

export const ProfileSchema = z.object({
  name: z.string(),
  long_name: z.string(),
  url: z.string().optional(),
  img: z.string().optional(),
});

export const RatingSchema = z.object({
  ratingValue: z.number(),
  bestRating: z.number(),
  reviewCount: z.number().optional(),
  profile: ProfileSchema.optional(),
  is_tripadvisor: z.boolean(),
});

export const UnitSchema = z.object({
  value: z.number(),
  units: z.string(),
});

export const DataProviderSchema = z.object({
  type: z.literal('external'),
  name: z.string(),
  url: z.string(),
  long_name: z.string().optional(),
  img: z.string().optional(),
});

export const PersonSchema = z.object({
  type: z.literal('person'),
  name: z.string(),
  url: z.string().optional(),
  thumbnail: ThumbnailSchema.optional(),
});

export const ContactPointSchema = z.object({
  type: z.literal('contact_point'),
  name: z.string(),
  url: z.string().optional(),
  thumbnail: ThumbnailSchema.optional(),
  telephone: z.string().optional(),
  email: z.string().optional(),
});

export const OrganizationSchema = z.object({
  type: z.literal('organization'),
  name: z.string(),
  url: z.string().optional(),
  thumbnail: ThumbnailSchema.optional(),
  contact_points: z.array(ContactPointSchema).optional(),
});

export const PostalAddressSchema = z.object({
  type: z.literal('PostalAddress'),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  streetAddress: z.string().optional(),
  addressRegion: z.string().optional(),
  addressLocality: z.string().optional(),
  displayAddress: z.string(),
});

export const DayOpeningHoursSchema = z.object({
  abbr_name: z.string(),
  full_name: z.string(),
  opens: z.string(),
  closes: z.string(),
});

export const OpeningHoursSchema = z.object({
  current_day: z.array(DayOpeningHoursSchema).optional(),
  days: z.array(z.array(DayOpeningHoursSchema)).optional(),
});

export const ContactSchema = z.object({
  email: z.string().optional(),
  telephone: z.string().optional(),
});

export const ActionSchema = z.object({
  type: z.string(),
  url: z.string(),
});

export const LanguageSchema = z.object({
  main: z.string(),
});

export const ImagePropertiesSchema = z.object({
  url: z.string(),
  resized: z.string().optional(),
  placeholder: z.string(),
  height: z.number().optional(),
  width: z.number().optional(),
  format: z.string().optional(),
  content_size: z.string().optional(),
});

export const ImageSchema = z.object({
  thumbnail: ThumbnailSchema,
  url: z.string().optional(),
  properties: ImagePropertiesSchema.optional(),
});

export const VideoDataSchema = z.object({
  duration: z.string().optional(),
  views: z.string().optional(),
  creator: z.string().optional(),
  publisher: z.string().optional(),
  thumbnail: ThumbnailSchema.optional(),
  tags: z.array(z.string()).optional(),
  author: ProfileSchema.optional(),
  requires_subscription: z.boolean().optional(),
});

export const PriceSchema = z.object({
  price: z.string(),
  price_currency: z.string(),
});

export const OfferSchema = z.object({
  url: z.string(),
  priceCurrency: z.string(),
  price: z.string(),
});

export const HowToSchema = z.object({
  text: z.string(),
  name: z.string().optional(),
  url: z.string().optional(),
  image: z.array(z.string()).optional(),
});

export const NewsResultSchema = z.object({
  type: z.literal('news_result'),
  meta_url: MetaUrlSchema.optional(),
  source: z.string().optional(),
  breaking: z.boolean(),
  is_live: z.boolean(),
  thumbnail: ThumbnailSchema.optional(),
  age: z.string().optional(),
  extra_snippets: z.array(z.string()).optional(),
});

export const NewsSchema = z.object({
  type: z.literal('news'),
  results: z.array(NewsResultSchema),
  mutated_by_goggles: z.boolean().optional(),
});

export const VideoResultSchema = z.object({
  type: z.literal('video_result'),
  video: VideoDataSchema,
  meta_url: MetaUrlSchema.optional(),
  thumbnail: ThumbnailSchema.optional(),
  age: z.string().optional(),
});

export const VideosSchema = z.object({
  type: z.literal('videos'),
  results: z.array(VideoResultSchema),
  mutated_by_goggles: z.boolean().optional(),
});

export const MovieDataSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  thumbnail: ThumbnailSchema.optional(),
  release: z.string().optional(),
  directors: z.array(PersonSchema).optional(),
  actors: z.array(PersonSchema).optional(),
  rating: RatingSchema.optional(),
  duration: z.string().optional(),
  genre: z.array(z.string()).optional(),
  query: z.string().optional(),
});

export const BookSchema = z.object({
  title: z.string(),
  author: z.array(PersonSchema),
  date: z.string().optional(),
  price: PriceSchema.optional(),
  pages: z.number().optional(),
  publisher: PersonSchema.optional(),
  rating: RatingSchema.optional(),
});

export const ArticleSchema = z.object({
  author: z.array(PersonSchema).optional(),
  date: z.string().optional(),
  publisher: z.any().optional(),
  thumbnail: ThumbnailSchema.optional(),
  isAccessibleForFree: z.boolean().optional(),
});

export const ProductSchema = z.object({
  type: z.literal('Product'),
  name: z.string(),
  category: z.string().optional(),
  price: z.string(),
  thumbnail: ThumbnailSchema,
  description: z.string().optional(),
  offers: z.array(OfferSchema).optional(),
  rating: RatingSchema.optional(),
});

export const ReviewSchema = z.object({
  type: z.literal('review'),
  name: z.string(),
  thumbnail: ThumbnailSchema,
  description: z.string(),
  rating: RatingSchema,
});

export const TripAdvisorReviewSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  rating: RatingSchema,
  author: PersonSchema,
  review_url: z.string(),
  language: z.string(),
});

export const ReviewsSchema = z.object({
  results: z.array(TripAdvisorReviewSchema),
  viewMoreUrl: z.string(),
  reviews_in_foreign_language: z.boolean(),
});

export const CreativeWorkSchema = z.object({
  name: z.string(),
  thumbnail: ThumbnailSchema,
  rating: RatingSchema.optional(),
});

export const MusicRecordingSchema = z.object({
  name: z.string(),
  thumbnail: ThumbnailSchema.optional(),
  rating: RatingSchema.optional(),
});

export const SoftwareSchema = z.object({
  name: z.string().optional(),
  author: z.string().optional(),
  version: z.string().optional(),
  codeRepository: z.string().optional(),
  homepage: z.string().optional(),
  datePublisher: z.string().optional(),
  is_npm: z.boolean().optional(),
  is_pypi: z.boolean().optional(),
  stars: z.number().optional(),
  forks: z.number().optional(),
  ProgrammingLanguage: z.string().optional(),
});

export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  thumbnail: ThumbnailSchema,
  url: z.string(),
  domain: z.string(),
  favicon: z.string(),
  time: z.string().optional(),
  prep_time: z.string().optional(),
  cook_time: z.string().optional(),
  ingredients: z.string().optional(),
  instructions: z.array(HowToSchema).optional(),
  servings: z.number().optional(),
  calories: z.number().optional(),
  rating: RatingSchema.optional(),
  recipeCategory: z.string().optional(),
  recipeCuisine: z.string().optional(),
  video: VideoDataSchema.optional(),
});

export const SummarizerSchema = z.object({
  type: z.literal('summarizer'),
  key: z.string(),
});

export const RichCallbackHintSchema = z.object({
  vertical: z.string(),
  callback_key: z.string(),
});

export const RichCallbackInfoSchema = z.object({
  type: z.literal('rich'),
  hint: RichCallbackHintSchema.optional(),
});

export const LocationWebResultSchema = z.object({
  meta_url: MetaUrlSchema,
});

export const PictureResultsSchema = z.object({
  viewMoreUrl: z.string().optional(),
  results: z.array(ThumbnailSchema),
});

export const ForumDataSchema = z.object({
  forum_name: z.string(),
  num_answers: z.number().optional(),
  score: z.string().optional(),
  title: z.string().optional(),
  question: z.string().optional(),
  top_comment: z.string().optional(),
});

export const DiscussionResultSchema = z.object({
  type: z.literal('discussion'),
  data: ForumDataSchema.optional(),
});

export const DiscussionsSchema = z.object({
  type: z.literal('search'),
  results: z.array(DiscussionResultSchema),
  mutated_by_goggles: z.boolean(),
});

export const QASchema = z.object({
  question: z.string(),
  answer: z.string(),
  title: z.string(),
  url: z.string(),
  meta_url: MetaUrlSchema.optional(),
});

export const FAQSchema = z.object({
  type: z.literal('faq'),
  results: z.array(QASchema),
});

export const AnswerSchema = z.object({
  text: z.string(),
  author: z.string().optional(),
  upvoteCount: z.number().optional(),
  downvoteCount: z.number().optional(),
});

export const QAPageSchema = z.object({
  question: z.string(),
  answer: AnswerSchema,
});

export const ResultReferenceSchema = z.object({
  type: z.string(),
  index: z.number().optional(),
  all: z.boolean(),
});

export const MixedResponseSchema = z.object({
  type: z.literal('mixed'),
  main: z.array(ResultReferenceSchema).optional(),
  top: z.array(ResultReferenceSchema).optional(),
  side: z.array(ResultReferenceSchema).optional(),
});

export const ButtonResultSchema = z.object({
  type: z.literal('button_result'),
  title: z.string(),
  url: z.string(),
});

export const ResultSchema = z.object({
  title: z.string(),
  url: z.string(),
  is_source_local: z.boolean(),
  is_source_both: z.boolean(),
  description: z.string().optional(),
  page_age: z.string().optional(),
  page_fetched: z.string().optional(),
  profile: ProfileSchema.optional(),
  language: z.string().optional(),
  family_friendly: z.boolean(),
});

export const LocationResultSchema = z.object({
  type: z.literal('location_result'),
  id: z.string().optional(),
  provider_url: z.string(),
  coordinates: z.array(z.number()).optional(),
  zoom_level: z.number(),
  thumbnail: ThumbnailSchema.optional(),
  postal_address: PostalAddressSchema.optional(),
  opening_hours: OpeningHoursSchema.optional(),
  contact: ContactSchema.optional(),
  price_range: z.string().optional(),
  rating: RatingSchema.optional(),
  distance: UnitSchema.optional(),
  profiles: z.array(DataProviderSchema).optional(),
  reviews: ReviewsSchema.optional(),
  pictures: PictureResultsSchema.optional(),
  action: ActionSchema.optional(),
  serves_cuisine: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  icon_category: z.string().optional(),
  results: LocationWebResultSchema.optional(),
  timezone: z.string().optional(),
  timezone_offset: z.string().optional(),
});

export const LocationsSchema = z.object({
  type: z.literal('locations'),
  results: z.array(LocationResultSchema),
});

export const DeepResultSchema = z.object({
  news: z.array(NewsResultSchema).optional(),
  buttons: z.array(ButtonResultSchema).optional(),
  videos: z.array(VideoResultSchema).optional(),
  images: z.array(ImageSchema).optional(),
});

export const LocationDescriptionSchema = z.object({
  type: z.literal('local_description'),
  id: z.string(),
  description: z.string().optional(),
});

export const AbstractGraphInfoboxSchema = z.object({
  type: z.literal('infobox'),
  position: z.number(),
  label: z.string().optional(),
  category: z.string().optional(),
  long_desc: z.string().optional(),
  thumbnail: ThumbnailSchema.optional(),
  attributes: z.array(z.array(z.string())).optional(),
  profiles: z.array(z.union([ProfileSchema, DataProviderSchema])).optional(),
  website_url: z.string().optional(),
  ratings: z.array(RatingSchema).optional(),
  providers: z.array(DataProviderSchema).optional(),
  distance: UnitSchema.optional(),
  images: z.array(ThumbnailSchema).optional(),
  movie: MovieDataSchema.optional(),
});

export const GenericInfoboxSchema = AbstractGraphInfoboxSchema.extend({
  subtype: z.literal('generic'),
  found_in_urls: z.array(z.string()).optional(),
});

export const EntityInfoboxSchema = AbstractGraphInfoboxSchema.extend({
  subtype: z.literal('entity'),
});

export const QAInfoboxSchema = AbstractGraphInfoboxSchema.extend({
  subtype: z.literal('code'),
  data: QAPageSchema,
  meta_url: z.any().optional(),
});

export const InfoboxWithLocationSchema = AbstractGraphInfoboxSchema.extend({
  subtype: z.literal('location'),
  is_location: z.boolean(),
  coordinates: z.array(z.number()).optional(),
  zoom_level: z.number(),
  location: LocationResultSchema.optional(),
});

export const InfoboxPlaceSchema = AbstractGraphInfoboxSchema.extend({
  subtype: z.literal('place'),
  location: LocationResultSchema,
});

export const GraphInfoboxSchema = z.object({
  type: z.literal('graph'),
  results: z.union([
    GenericInfoboxSchema,
    QAInfoboxSchema,
    InfoboxPlaceSchema,
    InfoboxWithLocationSchema,
    EntityInfoboxSchema,
  ]),
});

// Type definitions
export type Thumbnail = z.infer<typeof ThumbnailSchema>;
export type MetaUrl = z.infer<typeof MetaUrlSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Rating = z.infer<typeof RatingSchema>;
export type Unit = z.infer<typeof UnitSchema>;
export type DataProvider = z.infer<typeof DataProviderSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type ContactPoint = z.infer<typeof ContactPointSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type PostalAddress = z.infer<typeof PostalAddressSchema>;
export type DayOpeningHours = z.infer<typeof DayOpeningHoursSchema>;
export type OpeningHours = z.infer<typeof OpeningHoursSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Action = z.infer<typeof ActionSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type ImageProperties = z.infer<typeof ImagePropertiesSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type VideoData = z.infer<typeof VideoDataSchema>;
export type Price = z.infer<typeof PriceSchema>;
export type Offer = z.infer<typeof OfferSchema>;
export type HowTo = z.infer<typeof HowToSchema>;
export type NewsResult = z.infer<typeof NewsResultSchema>;
export type News = z.infer<typeof NewsSchema>;
export type VideoResult = z.infer<typeof VideoResultSchema>;
export type Videos = z.infer<typeof VideosSchema>;
export type MovieData = z.infer<typeof MovieDataSchema>;
export type Book = z.infer<typeof BookSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type TripAdvisorReview = z.infer<typeof TripAdvisorReviewSchema>;
export type Reviews = z.infer<typeof ReviewsSchema>;
export type CreativeWork = z.infer<typeof CreativeWorkSchema>;
export type MusicRecording = z.infer<typeof MusicRecordingSchema>;
export type Software = z.infer<typeof SoftwareSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type Summarizer = z.infer<typeof SummarizerSchema>;
export type RichCallbackHint = z.infer<typeof RichCallbackHintSchema>;
export type RichCallbackInfo = z.infer<typeof RichCallbackInfoSchema>;
export type LocationWebResult = z.infer<typeof LocationWebResultSchema>;
export type PictureResults = z.infer<typeof PictureResultsSchema>;
export type ForumData = z.infer<typeof ForumDataSchema>;
export type DiscussionResult = z.infer<typeof DiscussionResultSchema>;
export type Discussions = z.infer<typeof DiscussionsSchema>;
export type QA = z.infer<typeof QASchema>;
export type FAQ = z.infer<typeof FAQSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type QAPage = z.infer<typeof QAPageSchema>;
export type ResultReference = z.infer<typeof ResultReferenceSchema>;
export type MixedResponse = z.infer<typeof MixedResponseSchema>;
export type ButtonResult = z.infer<typeof ButtonResultSchema>;
export type Result = z.infer<typeof ResultSchema>;
export type LocationResult = z.infer<typeof LocationResultSchema>;
export type Locations = z.infer<typeof LocationsSchema>;
export type DeepResult = z.infer<typeof DeepResultSchema>;
export type LocationDescription = z.infer<typeof LocationDescriptionSchema>;
export type AbstractGraphInfobox = z.infer<typeof AbstractGraphInfoboxSchema>;
export type GenericInfobox = z.infer<typeof GenericInfoboxSchema>;
export type EntityInfobox = z.infer<typeof EntityInfoboxSchema>;
export type QAInfobox = z.infer<typeof QAInfoboxSchema>;
export type InfoboxWithLocation = z.infer<typeof InfoboxWithLocationSchema>;
export type InfoboxPlace = z.infer<typeof InfoboxPlaceSchema>;
export type GraphInfobox = z.infer<typeof GraphInfoboxSchema>;
