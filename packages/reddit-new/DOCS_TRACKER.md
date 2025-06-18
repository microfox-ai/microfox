# Reddit API Documentation Tracker

This file tracks the generation of documentation for the Reddit API endpoints.

## Endpoints

### Account
- [x] `account.getMe`
- [x] `account.getMyBlocked`
- [x] `account.getMyFriends`
- [x] `account.removeFriend`
- [x] `account.addFriend`
- [x] `account.getMyKarma`
- [x] `account.getMyPrefs`
- [x] `account.updateMyPrefs`
- [x] `account.getMyTrophies`
- [x] `account.getPrefsBlocked`
- [x] `account.getPrefsFriends`
- [x] `account.getPrefsMessaging`
- [x] `account.getPrefsTrusted`
- [x] `account.getPrefsWhere`

### Announcements
- [x] `announcements.getAnnouncements`
- [x] `announcements.hideAnnouncement`
- [x] `announcements.readAnnouncement`
- [x] `announcements.readAllAnnouncements`
- [x] `announcements.unreadAnnouncement`

### Captcha
- [x] `captcha.needsCaptcha`

### Collections
- [x] `collections.addPostToCollection`
- [x] `collections.getCollection`
- [x] `collections.createCollection`
- [x] `collections.deleteCollection`
- [x] `collections.removePostFromCollection`
- [ ] `collections.reorderCollection`
- [ ] `collections.getSubredditCollections`
- [ ] `collections.updateCollectionDescription`
- [ ] `collections.updateCollectionDisplayLayout`
- [ ] `collections.updateCollectionTitle`

### Emoji
- [ ] `emoji.addOrUpdateEmoji`
- [ ] `emoji.deleteEmoji`
- [ ] `emoji.getEmojiUploadLease`
- [ ] `emoji.setCustomEmojiSize`
- [ ] `emoji.getAllEmojis`

### Flair
- [ ] `flair.clearFlairTemplates`
- [ ] `flair.deleteFlair`
- [ ] `flair.deleteFlairTemplate`
- [ ] `flair.setFlair`
- [ ] `flair.updateFlairTemplateOrder`
- [ ] `flair.configureFlair`
- [ ] `flair.setFlairCsv`
- [ ] `flair.getFlairList`
- [ ] `flair.getFlairSelector`
- [ ] `flair.setFlairTemplate`
- [ ] `flair.setFlairTemplateV2`
- [ ] `flair.getLinkFlair`
- [ ] `flair.getLinkFlairV2`
- [ ] `flair.selectFlair`
- [ ] `flair.setFlairEnabled`
- [ ] `flair.getUserFlair`
- [ ] `flair.getUserFlairV2`

### Links And Comments
- [ ] `linksAndComments.submitComment`
- [ ] `linksAndComments.deleteThing`
- [ ] `linksAndComments.editUserText`
- [ ] `linksAndComments.followPost`
- [ ] `linksAndComments.hide`
- [ ] `linksAndComments.getInfo`
- [ ] `linksAndComments.lock`
- [ ] `linksAndComments.markNsfw`
- [ ] `linksAndComments.getMoreChildren`
- [ ] `linksAndComments.report`
- [ ] `linksAndComments.save`
- [ ] `linksAndComments.getSavedCategories`
- [ ] `linksAndComments.sendReplies`
- [ ] `linksAndComments.setContestMode`
- [ ] `linksAndComments.setSubredditSticky`
- [ ] `linksAndComments.setSuggestedSort`
- [ ] `linksAndComments.spoiler`
- [ ] `linksAndComments.storeVisits`
- [ ] `linksAndComments.submit`
- [ ] `linksAndComments.unhide`
- [ ] `linksAndComments.unlock`
- [ ] `linksAndComments.unmarkNsfw`
- [ ] `linksAndComments.unsave`
- [ ] `linksAndComments.unspoiler`
- [ ] `linksAndComments.vote`

### Listings
- [ ] `listings.getBest`
- [ ] `listings.getById`
- [ ] `listings.getComments`
- [ ] `listings.getDuplicates`
- [ ] `listings.getHot`
- [ ] `listings.getNew`
- [ ] `listings.getRising`
- [ ] `listings.getSorted`
- [ ] `listings.search`

### Live Threads
- [ ] `liveThreads.getLiveByIds`
- [ ] `liveThreads.createLiveThread`
- [ ] `liveThreads.getHappeningNow`
- [ ] `liveThreads.acceptLiveContributorInvite`
- [ ] `liveThreads.closeLiveThread`
- [ ] `liveThreads.deleteLiveUpdate`
- [ ] `liveThreads.editLiveThread`
- [ ] `liveThreads.hideDiscussion`
- [ ] `liveThreads.inviteContributor`
- [ ] `liveThreads.leaveLiveContributor`
- [ ] `liveThreads.reportLiveThread`
- [ ] `liveThreads.removeLiveContributor`
- [ ] `liveThreads.removeLiveContributorInvite`
- [ ] `liveThreads.setLiveContributorPermissions`
- [ ] `liveThreads.strikeLiveUpdate`- [ ] `liveThreads.unhideDiscussion`
- [ ] `liveThreads.postLiveUpdate`
- [ ] `liveThreads.getLiveUpdates`
- [ ] `liveThreads.getLiveAbout`
- [ ] `liveThreads.getLiveContributors`
- [ ] `liveThreads.getLiveDiscussions`
- [ ] `liveThreads.getLiveUpdate`

### Private Messages
- [ ] `privateMessages.block`
- [ ] `privateMessages.collapseMessage`
- [ ] `privateMessages.composeMessage`
- [ ] `privateMessages.deleteMessage`
- [ ] `privateMessages.readAllMessages`
- [ ] `privateMessages.readMessage`
- [ ] `privateMessages.unblockSubreddit`
- [ ] `privateMessages.uncollapseMessage`
- [ ] `privateMessages.unreadMessage`
- [ ] `privateMessages.getMessages`

### Misc
- [ ] `misc.getScopes`

### Moderation
- [ ] `moderation.getModLog`
- [ ] `moderation.getModListing`
- [ ] `moderation.acceptModeratorInvite`
- [ ] `moderation.approve`
- [ ] `moderation.distinguish`
- [ ] `moderation.ignoreReports`
- [ ] `moderation.leaveContributor`
- [ ] `moderation.leaveModerator`
- [ ] `moderation.remove`
- [ ] `moderation.showComment`
- [ ] `moderation.snoozeReports`
- [ ] `moderation.unignoreReports`
- [ ] `moderation.unsnoozeReports`
- [ ] `moderation.updateCrowdControlLevel`
- [ ] `moderation.getStylesheet`

### New Modmail
- [ ] `newModmail.modmailBulkRead`
- [ ] `newModmail.getModmailConversations`
- [ ] `newModmail.createModmailConversation`
- [ ] `newModmail.getModmailConversation`
- [ ] `newModmail.archiveModmailConversation`
- [ ] `newModmail.highlightModmailConversation`
- [ ] `newModmail.muteModmailConversation`
- [ ] `newModmail.unarchiveModmailConversation`
- [ ] `newModmail.unmuteModmailConversation`
- [ ] `newModmail.createModmailMessage`
- [ ] `newModmail.getModmailConversationMessages`
- [ ] `newModmail.getModmailSubreddits`
- [ ] `newModmail.getModmailUnreadCount`

### Subreddits
- [ ] `subreddits.getSubredditAboutWhere`
- [ ] `subreddits.deleteSrBanner`
- [ ] `subreddits.deleteSrHeader`
- [ ] `subreddits.deleteSrIcon`
- [ ] `subreddits.deleteSrImg`
- [ ] `subreddits.recommendSrBySrnames`
- [ ] `subreddits.searchRedditNamesGet`
- [ ] `subreddits.searchRedditNamesPost`
- [ ] `subreddits.searchSubreddits`
- [ ] `subreddits.siteAdmin`
- [ ] `subreddits.getSubmitText`
- [ ] `subreddits.subredditAutocomplete`
- [ ] `subreddits.subredditAutocompleteV2`
- [ ] `subreddits.subredditStylesheet`
- [ ] `subreddits.subscribe`
- [ ] `subreddits.uploadSrImg`
- [ ] `subreddits.getPostRequirements`
- [ ] `subreddits.getSubredditAbout`
- [ ] `subreddits.getSubredditAboutEdit`
- [ ] `subreddits.getSubredditAboutRules`
- [ ] `subreddits.getSubredditAboutTraffic`
- [ ] `subreddits.getSidebar`
- [ ] `subreddits.getSticky`
- [ ] `subreddits.getMineWhere`
- [ ] `subreddits.searchSubredditsListing`
- [ ] `subreddits.getSubredditsWhere`

### Users
- [ ] `users.searchUsers`
- [ ] `users.getUsersWhere`
- [ ] `users.blockUser`
- [ ] `users.friend`
- [ ] `users.reportUser`
- [ ] `users.setPermissions`
- [ ] `users.unfriend`
- [ ] `users.getUserDataByAccountIds`
- [ ] `users.usernameAvailable`
- [ ] `users.getUserTrophies`
- [ ] `users.getUserAbout`
- [ ] `users.getUserProfileWhere`

### Widgets
- [ ] `widgets.createWidget`
- [ ] `widgets.deleteWidget`
- [ ] `widgets.updateWidget`
- [ ] `widgets.getWidgetImageUploadLease`
- [ ] `widgets.reorderWidgets`
- [ ] `widgets.getWidgets`

### Wiki
- [ ] `wiki.allowEditor`
- [ ] `wiki.editWikiPage`
- [ ] `wiki.hideWikiPage`
- [ ] `wiki.revertWikiPage`
- [ ] `wiki.getWikiDiscussions`
- [ ] `wiki.getWikiPages`
- [ ] `wiki.getWikiRevisions`
- [ ] `wiki.getWikiPageRevisions`
- [ ] `wiki.getWikiPageSettings`
- [ ] `wiki.updateWikiPageSettings`
- [ ] `wiki.getWikiPage`
