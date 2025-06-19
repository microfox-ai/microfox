import { z } from 'zod';
import { listingParamsSchema } from './index';

export const getModLogSchema = listingParamsSchema.extend({
  mod: z.string().optional().describe('A moderator filter'),
  type: z.enum([
    'banuser', 'unbanuser', 'spamlink', 'removelink', 'approvelink', 'spamcomment', 'removecomment', 'approvecomment', 
    'addmoderator', 'showcomment', 'invitemoderator', 'uninvitemoderator', 'acceptmoderatorinvite', 'removemoderator', 
    'addcontributor', 'removecontributor', 'editsettings', 'editflair', 'distinguish', 'marknsfw', 'wikibanned', 
    'wikicontributor', 'wikiunbanned', 'wikipagelisted', 'removewikicontributor', 'wikirevise', 'wikipermlevel', 
    'ignorereports', 'unignorereports', 'setpermissions', 'setsuggestedsort', 'sticky', 'unsticky', 'setcontestmode', 
    'unsetcontestmode', 'lock', 'unlock', 'muteuser', 'unmuteuser', 'createrule', 'editrule', 'reorderrules', 
    'deleterule', 'spoiler', 'unspoiler', 'modmail_enrollment', 'community_status', 'community_styling', 
    'community_welcome_page', 'community_widgets', 'markoriginalcontent', 'collections', 'events', 'hidden_award', 
    'add_community_topics', 'remove_community_topics', 'create_scheduled_post', 'edit_scheduled_post', 
    'delete_scheduled_post', 'submit_scheduled_post', 'edit_comment_requirements', 'edit_post_requirements', 
    'invitesubscriber', 'submit_content_rating_survey', 'adjust_post_crowd_control_level', 'enable_post_crowd_control_filter', 
    'disable_post_crowd_control_filter', 'deleteoverriddenclassification', 'overrideclassification', 'reordermoderators', 
    'request_assistance', 'snoozereports', 'unsnoozereports', 'addnote', 'deletenote', 'addremovalreason', 
    'createremovalreason', 'updateremovalreason', 'deleteremovalreason', 'reorderremovalreason', 'dev_platform_app_changed', 
    'dev_platform_app_disabled', 'dev_platform_app_enabled', 'dev_platform_app_installed', 'dev_platform_app_uninstalled', 
    'edit_saved_response', 'chat_approve_message', 'chat_remove_message', 'chat_ban_user', 'chat_unban_user', 
    'chat_invite_host', 'chat_remove_host', 'approve_award'
  ]).optional(),
});

export const getModListingSchema = listingParamsSchema.extend({
  location: z.string().optional(),
  only: z.enum(['links', 'comments', 'chat_comments']).optional(),
});

export const approveSchema = z.object({
  id: z.string().describe('Fullname of a thing'),
});

export const distinguishSchema = z.object({
  api_type: z.literal('json').optional(),
  how: z.enum(['yes', 'no', 'admin', 'special']),
  id: z.string().describe('Fullname of a thing'),
  sticky: z.boolean().optional(),
});

export const ignoreReportsSchema = z.object({
  id: z.string().describe('Fullname of a thing'),
});

export const leaveContributorSchema = z.object({
  id: z.string().describe('Fullname of a thing'),
});

export const leaveModeratorSchema = z.object({
  id: z.string().describe('Fullname of a thing'),
});

export const removeSchema = z.object({
  id: z.string().describe('Fullname of a thing'),
  spam: z.boolean().optional(),
});

export const showCommentSchema = z.object({
  id: z.string().describe('Fullname of a thing'),
});

export const snoozeReportsSchema = z.object({
  id: z.string().describe('Fullname of a thing'),
  reason: z.string().optional(),
});

export const updateCrowdControlLevelSchema = z.object({
  id: z.string().describe('Fullname of a thing'),
  level: z.number().int().min(0).max(3),
}); 