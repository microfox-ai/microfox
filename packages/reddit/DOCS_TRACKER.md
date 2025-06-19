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

### Private Messages

- [x] `privateMessages.block`
- [x] `privateMessages.collapseMessage`
- [x] `privateMessages.composeMessage`
- [x] `privateMessages.deleteMessage`
- [x] `privateMessages.readAllMessages`
- [x] `privateMessages.readMessage`
- [x] `privateMessages.unblockSubreddit`
- [x] `privateMessages.uncollapseMessage`
- [x] `privateMessages.unreadMessage`
- [x] `privateMessages.getMessages`

### Misc

- [x] `misc.getScopes`

### Subreddits

- [x] `subreddits.getSubredditAboutWhere`
- [x] `subreddits.deleteSrBanner`
- [x] `subreddits.deleteSrHeader`
- [x] `subreddits.deleteSrIcon`
- [x] `subreddits.deleteSrImg`
- [x] `subreddits.recommendSrBySrnames`
- [x] `subreddits.searchRedditNamesGet`
- [x] `subreddits.searchRedditNamesPost`
- [x] `subreddits.searchSubreddits`
- [x] `subreddits.siteAdmin`
- [x] `subreddits.getSubmitText`
- [x] `subreddits.subredditAutocomplete`
- [x] `subreddits.subredditAutocompleteV2`
- [x] `subreddits.subredditStylesheet`
- [x] `subreddits.subscribe`
- [x] `subreddits.uploadSrImg`
- [x] `subreddits.getPostRequirements`
- [x] `subreddits.getSubredditAbout`
- [x] `subreddits.getSubredditAboutEdit`
- [x] `subreddits.getSubredditAboutRules`
- [x] `subreddits.getSubredditAboutTraffic`
- [x] `subreddits.getSidebar`
- [x] `subreddits.getSticky`
- [x] `subreddits.getMineWhere`
- [x] `subreddits.searchSubredditsListing`
- [x] `subreddits.getSubredditsWhere`

### Users

- [x] `users.searchUsers`
- [x] `users.getUsersWhere`
- [x] `users.blockUser`
- [x] `users.friend`
- [x] `users.reportUser`
- [x] `users.setPermissions`
- [x] `users.unfriend`
- [x] `users.getUserDataByAccountIds`
- [x] `users.usernameAvailable`
- [x] `users.getUserTrophies`
- [x] `users.getUserAbout`
- [x] `users.getUserProfileWhere`

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

### Live Threads

- [ ] `liveThreads.acceptModeratorInvite`
- [ ] `liveThreads.close`
- [ ] `liveThreads.create`
- [ ] `liveThreads.get`
- [ ] `liveThreads.getContributors`
- [ ] `liveThreads.getDiscussions`
- [ ] `liveThreads.getUpdate`
- [ ] `liveThreads.getUpdates`
- [ ] `liveThreads.inviteContributor`
- [ ] `liveThreads.leaveContributor`
- [ ] `liveThreads.removeContributor`
- [ ] `liveThreads.removeUpdate`
- [ ] `liveThreads.report`
- [ ] `liveThreads.setContributorPermissions`
- [ ] `liveThreads.strikeUpdate`
- [ ] `liveThreads.update`

### Moderation

- [x] `moderation.getModLog`
- [x] `moderation.getModListing`
- [x] `moderation.acceptModeratorInvite`
- [x] `moderation.approve`
- [x] `moderation.distinguish`
- [x] `moderation.ignoreReports`
- [x] `moderation.leaveContributor`
- [x] `moderation.leaveModerator`
- [x] `moderation.remove`
- [x] `moderation.showComment`
- [x] `moderation.snoozeReports`
- [x] `moderation.unignoreReports`
- [x] `moderation.unsnoozeReports`
- [x] `moderation.updateCrowdControlLevel`
- [x] `moderation.getStylesheet`

### New Modmail

- [x] `newModmail.modmailBulkRead`
- [x] `newModmail.getModmailConversations`
- [x] `newModmail.createModmailConversation`
- [x] `newModmail.getModmailConversation`
- [x] `newModmail.archiveModmailConversation`
- [x] `newModmail.highlightModmailConversation`
- [x] `newModmail.muteModmailConversation`
- [x] `newModmail.unarchiveModmailConversation`
- [x] `newModmail.unmuteModmailConversation`
- [x] `newModmail.createModmailMessage`
- [x] `newModmail.getModmailConversationMessages`
- [x] `newModmail.getModmailSubreddits`
- [x] `newModmail.getModmailUnreadCount`
- [x] `newModmail.markModmailAsRead`
- [x] `newModmail.markModmailAsUnread`
