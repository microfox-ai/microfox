import { z } from 'zod';
import * as accountSchemas from './schemas/account';
import { userSchema } from './schemas';
import * as announcementSchemas from './schemas/announcements';
import * as collectionSchemas from './schemas/collections';
import * as emojiSchemas from './schemas/emoji';
import * as flairSchemas from './schemas/flair';
import * as linksAndCommentsSchemas from './schemas/linksAndComments';
import * as liveThreadsSchemas from './schemas/liveThreads';
import * as privateMessagesSchemas from './schemas/privateMessages';
import * as miscSchemas from './schemas/misc';
import * as moderationSchemas from './schemas/moderation';
import * as newModmailSchemas from './schemas/newModmail';
import * as subredditsSchemas from './schemas/subreddits';
import * as usersSchemas from './schemas/users';
import * as listingsSchemas from './schemas/listings';
import * as widgetSchemas from './schemas/widgets';
import * as wikiSchemas from './schemas/wiki';
import { listingParamsSchema } from './schemas';
import { s3LeaseResponseSchema } from './schemas/emoji';
import { thingListingSchema } from './schemas/things';

export const Endpoints = {
  account: {
    getMe: {
      method: 'GET',
      url: '/api/v1/me',
      responseSchema: userSchema,
    },
    getMyBlocked: {
      method: 'GET',
      url: '/api/v1/me/blocked',
      responseSchema: accountSchemas.relationshipListingSchema,
    },
    getMyFriends: {
      method: 'GET',
      url: '/api/v1/me/friends',
      responseSchema: accountSchemas.relationshipListingSchema,
    },
    removeFriend: {
      method: 'DELETE',
      url: '/api/v1/me/friends/{username}',
    },
    addFriend: {
      method: 'PUT',
      url: '/api/v1/me/friends/{username}',
      bodySchema: accountSchemas.addFriendSchema,
      responseSchema: userSchema,
    },
    getMyKarma: {
      method: 'GET',
      url: '/api/v1/me/karma',
      responseSchema: z.object({ data: z.array(accountSchemas.karmaBreakdownSchema) }).transform(res => res.data),
    },
    getMyPrefs: {
      method: 'GET',
      url: '/api/v1/me/prefs',
      // responseSchema is intentionally omitted as it's 'any'
      bodySchema: accountSchemas.getPrefsFieldsSchema,
    },
    updateMyPrefs: {
      method: 'PATCH',
      url: '/api/v1/me/prefs',
      // responseSchema is intentionally omitted as it's 'any'
      bodySchema: accountSchemas.updatePrefsSchema,
    },
    getMyTrophies: {
      method: 'GET',
      url: '/api/v1/me/trophies',
      responseSchema: accountSchemas.trophyListSchema,
    },
    getPrefsBlocked: {
      method: 'GET',
      url: '/prefs/blocked',
      responseSchema: accountSchemas.userListingSchema,
    },
    getPrefsFriends: {
        method: 'GET',
        url: '/prefs/friends',
        responseSchema: accountSchemas.userListingSchema,
    },
    getPrefsMessaging: {
        method: 'GET',
        url: '/prefs/messaging',
        responseSchema: accountSchemas.userListingSchema,
    },
    getPrefsTrusted: {
        method: 'GET',
        url: '/prefs/trusted',
        responseSchema: accountSchemas.userListingSchema,
    },
    getPrefsWhere: {
        method: 'GET',
        url: '/prefs/where',
        responseSchema: accountSchemas.userListingSchema,
    },
  },
  announcements: {
    getAnnouncements: {
      method: 'GET',
      url: '/api/announcements/v1',
      responseSchema: announcementSchemas.announcementListingSchema,
      bodySchema: announcementSchemas.getAnnouncementsParamsSchema,
    },
    hideAnnouncement: {
      method: 'POST',
      url: '/api/announcements/v1/hide',
      bodySchema: announcementSchemas.announcementIdsSchema,
    },
    readAnnouncement: {
      method: 'POST',
      url: '/api/announcements/v1/read',
      bodySchema: announcementSchemas.announcementIdsSchema,
    },
    readAllAnnouncements: {
      method: 'POST',
      url: '/api/announcements/v1/read_all',
    },
    unreadAnnouncement: {
      method: 'POST',
      url: '/api/announcements/v1/unread',
      bodySchema: announcementSchemas.announcementIdsSchema,
    },
  },
  captcha: {
    needsCaptcha: {
      method: 'GET',
      url: '/api/needs_captcha',
    },
  },
  collections: {
    addPostToCollection: {
      method: 'POST',
      url: '/api/v1/collections/add_post_to_collection',
      bodySchema: collectionSchemas.addOrRemovePostFromCollectionSchema,
    },
    getCollection: {
      method: 'GET',
      url: '/api/v1/collections/collection',
      responseSchema: collectionSchemas.collectionWithLinksSchema,
      bodySchema: collectionSchemas.getCollectionSchema,
    },
    createCollection: {
      method: 'POST',
      url: '/api/v1/collections/create_collection',
      responseSchema: collectionSchemas.collectionSchema,
      bodySchema: collectionSchemas.createCollectionSchema,
    },
    deleteCollection: {
      method: 'POST',
      url: '/api/v1/collections/delete_collection',
      bodySchema: collectionSchemas.deleteCollectionSchema,
    },
    removePostFromCollection: {
      method: 'POST',
      url: '/api/v1/collections/remove_post_in_collection',
      bodySchema: collectionSchemas.addOrRemovePostFromCollectionSchema,
    },
    reorderCollection: {
      method: 'POST',
      url: '/api/v1/collections/reorder_collection',
      bodySchema: collectionSchemas.reorderCollectionSchema,
    },
    getSubredditCollections: {
      method: 'GET',
      url: '/api/v1/collections/subreddit_collections',
      responseSchema: z.array(collectionSchemas.collectionSchema),
      bodySchema: collectionSchemas.getSubredditCollectionsSchema,
    },
    updateCollectionDescription: {
      method: 'POST',
      url: '/api/v1/collections/update_collection_description',
      bodySchema: collectionSchemas.updateCollectionDescriptionSchema,
    },
    updateCollectionDisplayLayout: {
      method: 'POST',
      url: '/api/v1/collections/update_collection_display_layout',
      bodySchema: collectionSchemas.updateCollectionDisplayLayoutSchema,
    },
    updateCollectionTitle: {
      method: 'POST',
      url: '/api/v1/collections/update_collection_title',
      bodySchema: collectionSchemas.updateCollectionTitleSchema,
    },
  },
  emoji: {
    addOrUpdateEmoji: {
      method: 'POST',
      url: '/r/{subreddit}/api/v1/emoji.json',
      bodySchema: emojiSchemas.addEmojiSchema,
    },
    deleteEmoji: {
      method: 'DELETE',
      url: '/r/{subreddit}/api/v1/emoji/{emoji_name}',
    },
    getEmojiUploadLease: {
      method: 'POST',
      url: '/r/{subreddit}/api/v1/emoji_asset_upload_s3.json',
      responseSchema: emojiSchemas.s3LeaseResponseSchema,
      bodySchema: emojiSchemas.s3LeaseRequestSchema,
    },
    setCustomEmojiSize: {
      method: 'POST',
      url: '/r/{subreddit}/api/v1/emoji_custom_size',
      bodySchema: emojiSchemas.setCustomEmojiSizeSchema,
    },
    getAllEmojis: {
      method: 'GET',
      url: '/r/{subreddit}/api/v1/emojis/all',
      responseSchema: emojiSchemas.allEmojisResponseSchema,
    },
  },
  flair: {
    clearFlairTemplates: {
      method: 'POST',
      url: '/r/{subreddit}/api/clearflairtemplates',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.clearFlairTemplatesSchema,
    },
    deleteFlair: {
      method: 'POST',
      url: '/r/{subreddit}/api/deleteflair',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.deleteFlairSchema,
    },
    deleteFlairTemplate: {
      method: 'POST',
      url: '/r/{subreddit}/api/deleteflairtemplate',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.deleteFlairTemplateSchema,
    },
    setFlair: {
      method: 'POST',
      url: '/r/{subreddit}/api/flair',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.setFlairSchema,
    },
    updateFlairTemplateOrder: {
      method: 'PATCH',
      url: '/r/{subreddit}/api/flair_template_order',
      bodySchema: flairSchemas.flairTemplateOrderSchema,
    },
    configureFlair: {
      method: 'POST',
      url: '/r/{subreddit}/api/flairconfig',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.flairConfigSchema,
    },
    setFlairCsv: {
      method: 'POST',
      url: '/r/{subreddit}/api/flaircsv',
      bodySchema: flairSchemas.flairCsvSchema,
    },
    getFlairList: {
      method: 'GET',
      url: '/r/{subreddit}/api/flairlist',
      bodySchema: flairSchemas.flairListParamsSchema,
    },
    getFlairSelector: {
      method: 'POST',
      url: '/r/{subreddit}/api/flairselector',
      bodySchema: flairSchemas.flairSelectorParamsSchema,
    },
    setFlairTemplate: {
      method: 'POST',
      url: '/r/{subreddit}/api/flairtemplate',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.flairTemplateSchema,
    },
    setFlairTemplateV2: {
      method: 'POST',
      url: '/r/{subreddit}/api/flairtemplate_v2',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.flairTemplateV2Schema,
    },
    getLinkFlair: {
      method: 'GET',
      url: '/r/{subreddit}/api/link_flair',
    },
    getLinkFlairV2: {
      method: 'GET',
      url: '/r/{subreddit}/api/link_flair_v2',
    },
    selectFlair: {
      method: 'POST',
      url: '/r/{subreddit}/api/selectflair',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.selectFlairSchema,
    },
    setFlairEnabled: {
      method: 'POST',
      url: '/r/{subreddit}/api/setflairenabled',
      params: { api_type: 'json' },
      bodySchema: flairSchemas.setFlairEnabledSchema,
    },
    getUserFlair: {
      method: 'GET',
      url: '/r/{subreddit}/api/user_flair',
    },
    getUserFlairV2: {
      method: 'GET',
      url: '/r/{subreddit}/api/user_flair_v2',
    },
  },
  linksAndComments: {
    submitComment: {
      method: 'POST',
      url: '/api/comment',
      bodySchema: linksAndCommentsSchemas.submitCommentSchema,
    },
    deleteThing: {
      method: 'POST',
      url: '/api/del',
      bodySchema: linksAndCommentsSchemas.deleteSchema,
    },
    editUserText: {
      method: 'POST',
      url: '/api/editusertext',
      bodySchema: linksAndCommentsSchemas.editUserTextSchema,
    },
    followPost: {
      method: 'POST',
      url: '/api/follow_post',
      bodySchema: linksAndCommentsSchemas.followPostSchema,
    },
    hide: {
      method: 'POST',
      url: '/api/hide',
      bodySchema: linksAndCommentsSchemas.hideSchema,
    },
    getInfo: {
      method: 'GET',
      url: '/api/info',
      bodySchema: linksAndCommentsSchemas.infoParamsSchema,
    },
    lock: {
      method: 'POST',
      url: '/api/lock',
      bodySchema: linksAndCommentsSchemas.lockSchema,
    },
    markNsfw: {
      method: 'POST',
      url: '/api/marknsfw',
      bodySchema: linksAndCommentsSchemas.markNsfwSchema,
    },
    getMoreChildren: {
      method: 'GET',
      url: '/api/morechildren',
      bodySchema: linksAndCommentsSchemas.moreChildrenSchema,
    },
    report: {
      method: 'POST',
      url: '/api/report',
      bodySchema: linksAndCommentsSchemas.reportSchema,
    },
    save: {
      method: 'POST',
      url: '/api/save',
      bodySchema: linksAndCommentsSchemas.saveSchema,
    },
    getSavedCategories: {
      method: 'GET',
      url: '/api/saved_categories',
    },
    sendReplies: {
      method: 'POST',
      url: '/api/sendreplies',
      bodySchema: linksAndCommentsSchemas.sendRepliesSchema,
    },
    setContestMode: {
      method: 'POST',
      url: '/api/set_contest_mode',
      bodySchema: linksAndCommentsSchemas.setContestModeSchema,
    },
    setSubredditSticky: {
      method: 'POST',
      url: '/api/set_subreddit_sticky',
      bodySchema: linksAndCommentsSchemas.setSubredditStickySchema,
    },
    setSuggestedSort: {
      method: 'POST',
      url: '/api/set_suggested_sort',
      bodySchema: linksAndCommentsSchemas.setSuggestedSortSchema,
    },
    spoiler: {
      method: 'POST',
      url: '/api/spoiler',
      bodySchema: linksAndCommentsSchemas.spoilerSchema,
    },
    storeVisits: {
      method: 'POST',
      url: '/api/store_visits',
      bodySchema: linksAndCommentsSchemas.storeVisitsSchema,
    },
    submit: {
      method: 'POST',
      url: '/api/submit',
      bodySchema: linksAndCommentsSchemas.submitLinkSchema,
    },
    unhide: {
      method: 'POST',
      url: '/api/unhide',
      bodySchema: linksAndCommentsSchemas.unhideSchema,
    },
    unlock: {
      method: 'POST',
      url: '/api/unlock',
      bodySchema: linksAndCommentsSchemas.unlockSchema,
    },
    unmarkNsfw: {
      method: 'POST',
      url: '/api/unmarknsfw',
      bodySchema: linksAndCommentsSchemas.unmarkNsfwSchema,
    },
    unsave: {
      method: 'POST',
      url: '/api/unsave',
      bodySchema: linksAndCommentsSchemas.unsaveSchema,
    },
    unspoiler: {
      method: 'POST',
      url: '/api/unspoiler',
      bodySchema: linksAndCommentsSchemas.unspoilerschema,
    },
    vote: {
      method: 'POST',
      url: '/api/vote',
      bodySchema: linksAndCommentsSchemas.voteSchema,
    },
  },
  listings: {
    getAllBest: {
      method: 'GET',
      url: '/best',
      bodySchema: listingsSchemas.getBestSchema,
    },
    getById: {
      method: 'GET',
      url: '/by_id/{names}',
      bodySchema: listingsSchemas.getByIdSchema,
    },
    getComments: {
      method: 'GET',
      url: '/r/{subreddit}/comments/{articleId}',
      bodySchema: listingsSchemas.getCommentsSchema,
    },
    getDuplicates: {
      method: 'GET',
      url: '/duplicates/{articleId}',
      bodySchema: listingsSchemas.getDuplicatesSchema,
    },
    getAllHot: {
      method: 'GET',
      url: '/hot',
      bodySchema: listingsSchemas.getHotSchema,
    },
    getHotFromSubreddit: {
      method: 'GET',
      url: '/r/{subreddit}/hot',
      bodySchema: listingsSchemas.getHotSchema,
    },
    getAllNew: {
      method: 'GET',
      url: '/new',
      bodySchema: listingsSchemas.getNewSchema,
    },
    getNewFromSubreddit: {
      method: 'GET',
      url: '/r/{subreddit}/new',
      bodySchema: listingsSchemas.getNewSchema,
    },
    getAllRising: {
      method: 'GET',
      url: '/rising',
      bodySchema: listingsSchemas.getRisingSchema,
    },
    getRisingFromSubreddit: {
      method: 'GET',
      url: '/r/{subreddit}/rising',
      bodySchema: listingsSchemas.getRisingSchema,
    },
    getAllSorted: {
      method: 'GET',
      url: '/{sort}',
      bodySchema: listingsSchemas.getSortedSchema,
    },
    getSortedFromSubreddit: {
      method: 'GET',
      url: '/r/{subreddit}/{sort}',
      bodySchema: listingsSchemas.getSortedSchema,
    },
    search: {
      method: 'GET',
      url: '/search',
      bodySchema: listingsSchemas.searchSchema,
    },
    searchInSubreddit: {
      method: 'GET',
      url: '/r/{subreddit}/search',
      bodySchema: listingsSchemas.searchSchema,
      params: { restrict_sr: true },
    },
  },
  liveThreads: {
    getLiveByIds: {
      method: 'GET',
      url: '/api/live/by_id/{names}',
      bodySchema: liveThreadsSchemas.getLiveByIdsSchema,
    },
    createLiveThread: {
      method: 'POST',
      url: '/api/live/create',
      bodySchema: liveThreadsSchemas.createLiveThreadSchema,
    },
    getHappeningNow: {
      method: 'GET',
      url: '/api/live/happening_now',
      bodySchema: liveThreadsSchemas.getHappeningNowSchema,
    },
    acceptLiveContributorInvite: {
      method: 'POST',
      url: '/api/live/{threadId}/accept_contributor_invite',
      params: { api_type: 'json' },
    },
    closeLiveThread: {
      method: 'POST',
      url: '/api/live/{threadId}/close_thread',
      params: { api_type: 'json' },
    },
    deleteLiveUpdate: {
      method: 'POST',
      url: '/api/live/{threadId}/delete_update',
      bodySchema: liveThreadsSchemas.deleteLiveUpdateSchema,
    },
    editLiveThread: {
      method: 'POST',
      url: '/api/live/{threadId}/edit',
      bodySchema: liveThreadsSchemas.editLiveThreadSchema,
    },
    hideDiscussion: {
      method: 'POST',
      url: '/api/live/{threadId}/hide_discussion',
      bodySchema: liveThreadsSchemas.manageDiscussionSchema,
    },
    inviteContributor: {
      method: 'POST',
      url: '/api/live/{threadId}/invite_contributor',
      bodySchema: liveThreadsSchemas.manageContributorSchema,
    },
    leaveLiveContributor: {
      method: 'POST',
      url: '/api/live/{threadId}/leave_contributor',
      params: { api_type: 'json' },
    },
    reportLiveThread: {
      method: 'POST',
      url: '/api/live/{threadId}/report',
      bodySchema: liveThreadsSchemas.reportLiveThreadSchema,
    },
    removeLiveContributor: {
      method: 'POST',
      url: '/api/live/{threadId}/rm_contributor',
      bodySchema: liveThreadsSchemas.removeContributorSchema,
    },
    removeLiveContributorInvite: {
      method: 'POST',
      url: '/api/live/{threadId}/rm_contributor_invite',
      bodySchema: liveThreadsSchemas.manageContributorSchema,
    },
    setLiveContributorPermissions: {
      method: 'POST',
      url: '/api/live/{threadId}/set_contributor_permissions',
      bodySchema: liveThreadsSchemas.manageContributorSchema,
    },
    strikeLiveUpdate: {
      method: 'POST',
      url: '/api/live/{threadId}/strike_update',
      bodySchema: liveThreadsSchemas.deleteLiveUpdateSchema,
    },
    unhideDiscussion: {
      method: 'POST',
      url: '/api/live/{threadId}/unhide_discussion',
      bodySchema: liveThreadsSchemas.manageDiscussionSchema,
    },
    postLiveUpdate: {
      method: 'POST',
      url: '/api/live/{threadId}/update',
      bodySchema: liveThreadsSchemas.postUpdateSchema,
    },
    getLiveUpdates: {
      method: 'GET',
      url: '/live/{threadId}',
      bodySchema: liveThreadsSchemas.getLiveUpdatesListingSchema,
    },
    getLiveAbout: {
      method: 'GET',
      url: '/live/{threadId}/about',
    },
    getLiveContributors: {
      method: 'GET',
      url: '/live/{threadId}/contributors',
    },
    getLiveDiscussions: {
      method: 'GET',
      url: '/live/{threadId}/discussions',
      bodySchema: liveThreadsSchemas.getDiscussionsListingSchema,
    },
    getLiveUpdate: {
      method: 'GET',
      url: '/live/{threadId}/updates/{updateId}',
    },
  },
  privateMessages: {
    block: {
      method: 'POST',
      url: '/api/block',
      bodySchema: privateMessagesSchemas.blockPrivateMessageSchema,
    },
    collapseMessage: {
      method: 'POST',
      url: '/api/collapse_message',
      bodySchema: privateMessagesSchemas.messageIdListSchema,
      contentType: 'application/x-www-form-urlencoded',
    },
    composeMessage: {
      method: 'POST',
      url: '/api/compose',
      bodySchema: privateMessagesSchemas.composeMessageSchema,
      contentType: 'application/x-www-form-urlencoded',
    },
    deleteMessage: {
      method: 'POST',
      url: '/api/del_msg',
      bodySchema: privateMessagesSchemas.messageIdListSchema,
      contentType: 'application/x-www-form-urlencoded',
    },
    readAllMessages: {
      method: 'POST',
      url: '/api/read_all_messages',
      bodySchema: privateMessagesSchemas.readAllMessagesSchema,
    },
    readMessage: {
      method: 'POST',
      url: '/api/read_message',
      bodySchema: privateMessagesSchemas.messageIdListSchema,
      contentType: 'application/x-www-form-urlencoded',
    },
    unblockSubreddit: {
      method: 'POST',
      url: '/api/unblock_subreddit',
      bodySchema: privateMessagesSchemas.unblockSubredditSchema,
    },
    uncollapseMessage: {
      method: 'POST',
      url: '/api/uncollapse_message',
      bodySchema: privateMessagesSchemas.messageIdListSchema,
      contentType: 'application/x-www-form-urlencoded',
    },
    unreadMessage: {
      method: 'POST',
      url: '/api/unread_message',
      bodySchema: privateMessagesSchemas.messageIdListSchema,
      contentType: 'application/x-www-form-urlencoded',
    },
    getMessages: {
      method: 'GET',
      url: '/message/{where}',
      bodySchema: privateMessagesSchemas.getMessageListingSchema,
    },
  },
  misc: {
    getScopes: {
      method: 'GET',
      url: '/api/v1/scopes',
      bodySchema: miscSchemas.getScopesSchema,
    },
  },
  moderation: {
    getModLog: {
      method: 'GET',
      url: '/r/{subreddit}/about/log',
      bodySchema: moderationSchemas.getModLogSchema,
    },
    getModListing: {
      method: 'GET',
      url: '/r/{subreddit}/about/{location}',
      bodySchema: moderationSchemas.getModListingSchema,
    },
    acceptModeratorInvite: {
      method: 'POST',
      url: '/r/{subreddit}/api/accept_moderator_invite',
      params: { api_type: 'json' },
    },
    approve: {
      method: 'POST',
      url: '/api/approve',
      bodySchema: moderationSchemas.approveSchema,
    },
    distinguish: {
      method: 'POST',
      url: '/api/distinguish',
      bodySchema: moderationSchemas.distinguishSchema,
    },
    ignoreReports: {
      method: 'POST',
      url: '/api/ignore_reports',
      bodySchema: moderationSchemas.ignoreReportsSchema,
    },
    leaveContributor: {
      method: 'POST',
      url: '/api/leavecontributor',
      bodySchema: moderationSchemas.leaveContributorSchema,
    },
    leaveModerator: {
      method: 'POST',
      url: '/api/leavemoderator',
      bodySchema: moderationSchemas.leaveModeratorSchema,
    },
    remove: {
      method: 'POST',
      url: '/api/remove',
      bodySchema: moderationSchemas.removeSchema,
    },
    showComment: {
      method: 'POST',
      url: '/api/show_comment',
      bodySchema: moderationSchemas.showCommentSchema,
    },
    snoozeReports: {
      method: 'POST',
      url: '/api/snooze_reports',
      bodySchema: moderationSchemas.snoozeReportsSchema,
    },
    unignoreReports: {
      method: 'POST',
      url: '/api/unignore_reports',
      bodySchema: moderationSchemas.ignoreReportsSchema,
    },
    unsnoozeReports: {
      method: 'POST',
      url: '/api/unsnooze_reports',
      bodySchema: moderationSchemas.ignoreReportsSchema,
    },
    updateCrowdControlLevel: {
      method: 'POST',
      url: '/api/update_crowd_control_level',
      bodySchema: moderationSchemas.updateCrowdControlLevelSchema,
    },
    getStylesheet: {
      method: 'GET',
      url: '/r/{subreddit}/stylesheet',
    },
  },
  newModmail: {
    modmailBulkRead: {
      method: 'POST',
      url: '/api/mod/bulk_read',
      bodySchema: newModmailSchemas.bulkReadSchema,
    },
    getModmailConversations: {
      method: 'GET',
      url: '/api/v1/mod/conversations',
      responseSchema: newModmailSchemas.getConversationsSchema,
      bodySchema: newModmailSchemas.getConversationsSchema,
    },
    createModmailConversation: {
      method: 'POST',
      url: '/api/v1/mod/conversations',
      responseSchema: newModmailSchemas.createConversationSchema,
      bodySchema: newModmailSchemas.createConversationSchema,
    },
    getModmailConversation: {
      method: 'GET',
      url: '/api/v1/mod/conversations/{conversation_id}',
      responseSchema: newModmailSchemas.getConversationSchema,
      bodySchema: newModmailSchemas.getConversationSchema,
    },
    archiveModmailConversation: {
      method: 'POST',
      url: '/api/v1/mod/conversations/{conversation_id}/archive',
    },
    highlightModmailConversation: {
      method: 'POST',
      url: '/api/v1/mod/conversations/{conversation_id}/highlight',
    },
    muteModmailConversation: {
      method: 'POST',
      url: '/api/v1/mod/conversations/{conversation_id}/mute',
      bodySchema: newModmailSchemas.muteConversationSchema,
    },
    unarchiveModmailConversation: {
      method: 'POST',
      url: '/api/v1/mod/conversations/{conversation_id}/unarchive',
    },
    unmuteModmailConversation: {
      method: 'POST',
      url: '/api/v1/mod/conversations/{conversation_id}/unmute',
    },
    createModmailMessage: {
      method: 'POST',
      url: '/api/v1/mod/conversations/{conversation_id}/messages',
      responseSchema: newModmailSchemas.createMessageSchema,
      bodySchema: newModmailSchemas.createMessageSchema,
    },
    getModmailConversationMessages: {
      method: 'GET',
      url: '/api/v1/mod/conversations/{conversation_id}/messages',
      responseSchema: newModmailSchemas.getConversationSchema,
    },
    getModmailSubreddits: {
      method: 'GET',
      url: '/api/v1/mod/conversations/subreddits',
    },
    getModmailUnreadCount: {
      method: 'GET',
      url: '/api/mod/conversations/unread/count',
    },
  },
  subreddits: {
    getSubredditAboutWhere: {
      method: 'GET',
      url: '/r/{subreddit}/about/{where}',
      bodySchema: subredditsSchemas.getSubredditAboutWhereSchema,
    },
    deleteSrBanner: {
      method: 'POST',
      url: '/r/{subreddit}/api/delete_sr_banner',
      bodySchema: subredditsSchemas.deleteSrBannerSchema,
    },
    deleteSrHeader: {
      method: 'POST',
      url: '/r/{subreddit}/api/delete_sr_header',
      bodySchema: subredditsSchemas.deleteSrHeaderSchema,
    },
    deleteSrIcon: {
      method: 'POST',
      url: '/r/{subreddit}/api/delete_sr_icon',
      bodySchema: subredditsSchemas.deleteSrIconSchema,
    },
    deleteSrImg: {
      method: 'POST',
      url: '/r/{subreddit}/api/delete_sr_img',
      bodySchema: subredditsSchemas.deleteSrImgSchema,
    },
    recommendSrBySrnames: {
      method: 'GET',
      url: '/api/recommend/sr/srnames',
      bodySchema: subredditsSchemas.recommendSrBySrnamesSchema,
    },
    searchRedditNamesGet: {
      method: 'GET',
      url: '/api/search_reddit_names',
      bodySchema: subredditsSchemas.searchRedditNamesSchema,
    },
    searchRedditNamesPost: {
      method: 'POST',
      url: '/api/search_reddit_names',
      bodySchema: subredditsSchemas.searchRedditNamesSchema,
    },
    searchSubreddits: {
      method: 'POST',
      url: '/api/search_subreddits',
      bodySchema: subredditsSchemas.searchRedditNamesSchema,
    },
    siteAdmin: {
      method: 'POST',
      url: '/api/site_admin',
      bodySchema: subredditsSchemas.siteAdminSchema,
    },
    getSubmitText: {
      method: 'GET',
      url: '/r/{subreddit}/api/submit_text',
    },
    subredditAutocomplete: {
      method: 'GET',
      url: '/api/subreddit_autocomplete',
      bodySchema: subredditsSchemas.subredditAutocompleteSchema,
    },
    subredditAutocompleteV2: {
      method: 'GET',
      url: '/api/subreddit_autocomplete_v2',
      bodySchema: subredditsSchemas.subredditAutocompleteV2Schema,
    },
    subredditStylesheet: {
      method: 'POST',
      url: '/r/{subreddit}/api/subreddit_stylesheet',
      bodySchema: subredditsSchemas.subredditStylesheetSchema,
    },
    subscribe: {
      method: 'POST',
      url: '/api/subscribe',
      bodySchema: subredditsSchemas.subscribeSchema,
    },
    uploadSrImg: {
      method: 'POST',
      url: '/r/{subreddit}/api/upload_sr_img',
      bodySchema: subredditsSchemas.uploadSrImgSchema,
    },
    getPostRequirements: {
      method: 'GET',
      url: '/api/v1/subreddit/post_requirements',
    },
    getSubredditAbout: {
      method: 'GET',
      url: '/r/{subreddit}/about',
    },
    getSubredditAboutEdit: {
      method: 'GET',
      url: '/r/{subreddit}/about/edit',
      bodySchema: subredditsSchemas.getSubredditAboutEditSchema,
    },
    getSubredditAboutRules: {
      method: 'GET',
      url: '/r/{subreddit}/about/rules',
    },
    getSubredditAboutTraffic: {
      method: 'GET',
      url: '/r/{subreddit}/about/traffic',
    },
    getSidebar: {
      method: 'GET',
      url: '/r/{subreddit}/sidebar',
    },
    getSticky: {
      method: 'GET',
      url: '/r/{subreddit}/sticky',
      bodySchema: subredditsSchemas.getStickySchema,
    },
    getMineWhere: {
      method: 'GET',
      url: '/subreddits/mine/{where}',
      bodySchema: listingParamsSchema,
    },
    searchSubredditsListing: {
      method: 'GET',
      url: '/subreddits/search',
      bodySchema: subredditsSchemas.searchSubredditsSchema,
    },
    getSubredditsWhere: {
      method: 'GET',
      url: '/subreddits/{where}',
      bodySchema: listingParamsSchema,
    },
  },
  users: {
    searchUsers: {
      method: 'GET',
      url: '/users/search',
      bodySchema: usersSchemas.searchUsersSchema,
    },
    getUsersWhere: {
      method: 'GET',
      url: '/users/{where}',
      bodySchema: listingParamsSchema,
    },
    blockUser: {
      method: 'POST',
      url: '/api/block_user',
      bodySchema: usersSchemas.blockUserSchema,
    },
    friend: {
      method: 'POST',
      url: '/r/{subreddit}/api/friend',
      bodySchema: usersSchemas.friendSchema,
    },
    reportUser: {
      method: 'POST',
      url: '/api/report_user',
      bodySchema: usersSchemas.reportUserSchema,
    },
    setPermissions: {
      method: 'POST',
      url: '/r/{subreddit}/api/setpermissions',
      bodySchema: usersSchemas.setPermissionsSchema,
    },
    unfriend: {
      method: 'POST',
      url: '/r/{subreddit}/api/unfriend',
      bodySchema: usersSchemas.unfriendSchema,
    },
    getUserDataByAccountIds: {
      method: 'GET',
      url: '/api/user_data_by_account_ids',
      bodySchema: usersSchemas.userDataByAccountIdsSchema,
      responseSchema: z.record(z.string(), userSchema),
    },
    usernameAvailable: {
      method: 'GET',
      url: '/api/username_available',
      bodySchema: usersSchemas.usernameAvailableSchema,
      responseSchema: z.boolean(),
    },
    getUserTrophies: {
      method: 'GET',
      url: '/api/v1/user/{username}/trophies',
      responseSchema: accountSchemas.trophyListSchema,
    },
    getUserAbout: {
      method: 'GET',
      url: '/user/{username}/about',
      responseSchema: userSchema,
    },
    getUserProfileWhere: {
      method: 'GET',
      url: '/user/{username}/{where}',
      bodySchema: usersSchemas.userProfileWhereSchema,
      responseSchema: thingListingSchema,
    },
  },
  widgets: {
    createWidget: {
      method: 'POST',
      url: '/r/{subreddit}/api/widget',
      bodySchema: widgetSchemas.widgetSchema,
      responseSchema: widgetSchemas.widgetSchema,
    },
    deleteWidget: {
      method: 'DELETE',
      url: '/r/{subreddit}/api/widget/{widget_id}',
    },
    updateWidget: {
      method: 'PUT',
      url: '/r/{subreddit}/api/widget/{widget_id}',
      bodySchema: widgetSchemas.widgetSchema,
      responseSchema: widgetSchemas.widgetSchema,
    },
    getWidgetImageUploadLease: {
      method: 'POST',
      url: '/r/{subreddit}/api/widget_image_upload_s3',
      bodySchema: widgetSchemas.widgetImageUploadLeaseSchema,
      responseSchema: s3LeaseResponseSchema,
    },
    reorderWidgets: {
      method: 'PATCH',
      url: '/r/{subreddit}/api/widget_order/{section}',
      bodySchema: widgetSchemas.widgetOrderSchema,
    },
    getWidgets: {
      method: 'GET',
      url: '/r/{subreddit}/api/widgets',
      responseSchema: widgetSchemas.widgetListSchema,
    },
  },
  wiki: {
    allowEditor: {
      method: 'POST',
      url: '/r/{subreddit}/api/wiki/alloweditor/{act}',
      bodySchema: wikiSchemas.allowEditorSchema,
    },
    editWikiPage: {
      method: 'POST',
      url: '/r/{subreddit}/api/wiki/edit',
      bodySchema: wikiSchemas.editWikiPageSchema,
    },
    hideWikiPage: {
      method: 'POST',
      url: '/r/{subreddit}/api/wiki/hide',
      bodySchema: wikiSchemas.hideWikiPageSchema,
    },
    revertWikiPage: {
      method: 'POST',
      url: '/r/{subreddit}/api/wiki/revert',
      bodySchema: wikiSchemas.revertWikiPageSchema,
    },
    getWikiDiscussions: {
      method: 'GET',
      url: '/r/{subreddit}/wiki/discussions/{page}',
      bodySchema: wikiSchemas.getWikiDiscussionsSchema,
      responseSchema: thingListingSchema,
    },
    getWikiPages: {
      method: 'GET',
      url: '/r/{subreddit}/wiki/pages',
      responseSchema: wikiSchemas.wikiPageListSchema,
    },
    getWikiRevisions: {
      method: 'GET',
      url: '/r/{subreddit}/wiki/revisions',
      responseSchema: wikiSchemas.wikiRevisionListingSchema,
    },
    getWikiPageRevisions: {
      method: 'GET',
      url: '/r/{subreddit}/wiki/revisions/{page}',
      responseSchema: wikiSchemas.wikiRevisionListingSchema,
    },
    getWikiPageSettings: {
      method: 'GET',
      url: '/r/{subreddit}/wiki/settings/{page}',
      responseSchema: wikiSchemas.wikiPageSettingsSchema,
    },
    updateWikiPageSettings: {
      method: 'POST',
      url: '/r/{subreddit}/wiki/settings/{page}',
      bodySchema: wikiSchemas.updateWikiPageSettingsSchema,
      responseSchema: wikiSchemas.wikiPageSettingsSchema,
    },
    getWikiPage: {
      method: 'GET',
      url: '/r/{subreddit}/wiki/{page}',
      responseSchema: wikiSchemas.wikiPageSchema,
    },
  },
}; 