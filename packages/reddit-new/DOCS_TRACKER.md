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
- [x] `collections.reorderCollection`
- [x] `collections.getSubredditCollections`
- [x] `collections.updateCollectionDescription`
- [x] `collections.updateCollectionDisplayLayout`
- [x] `collections.updateCollectionTitle`

### Emoji
- [x] `emoji.addOrUpdateEmoji`
- [x] `emoji.deleteEmoji`
- [x] `emoji.getEmojiUploadLease`
- [x] `emoji.setCustomEmojiSize`
- [x] `emoji.getAllEmojis`

### Flair
- [x] `flair.clearFlairTemplates`
- [x] `flair.deleteFlair`
- [x] `flair.deleteFlairTemplate`
- [x] `flair.setFlair`
- [x] `flair.updateFlairTemplateOrder`
- [x] `flair.configureFlair`
- [x] `flair.setFlairCsv`
- [x] `flair.getFlairList`
- [x] `flair.getFlairSelector`
- [x] `flair.setFlairTemplate`
- [x] `flair.setFlairTemplateV2`
- [x] `flair.getLinkFlair`
- [x] `flair.getLinkFlairV2`
- [x] `flair.selectFlair`
- [x] `flair.setFlairEnabled`
- [x] `flair.getUserFlair`
- [x] `flair.getUserFlairV2`

### Links And Comments
- [x] `linksAndComments.submitComment`
- [x] `linksAndComments.deleteThing`
- [x] `linksAndComments.editUserText`
- [x] `linksAndComments.followPost`
- [x] `linksAndComments.hide`
- [x] `linksAndComments.getInfo`
- [x] `linksAndComments.lock`
- [x] `linksAndComments.markNsfw`
- [x] `linksAndComments.getMoreChildren`
- [x] `linksAndComments.report`
- [x] `linksAndComments.save`
- [x] `linksAndComments.getSavedCategories`
- [x] `linksAndComments.sendReplies`
- [x] `linksAndComments.setContestMode`
- [x] `linksAndComments.setSubredditSticky`
- [x] `linksAndComments.setSuggestedSort`
- [x] `linksAndComments.spoiler`
- [x] `linksAndComments.storeVisits`
- [x] `linksAndComments.submit`
- [x] `linksAndComments.unhide`
- [x] `linksAndComments.unlock`
- [x] `linksAndComments.unmarkNsfw`
- [x] `linksAndComments.unsave`
- [x] `linksAndComments.unspoiler`
- [x] `linksAndComments.vote`

### Listings
- [x] `listings.getBest`
- [x] `listings.getById`
- [x] `listings.getComments`
- [x] `listings.getDuplicates`
- [x] `listings.getHot`
- [x] `listings.getNew`
- [x] `listings.getRising`
- [x] `listings.getSorted`
- [x] `listings.search`

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
- [ ] `liveThreads.strikeLiveUpdate`
- [ ] `liveThreads.unhideDiscussion`
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