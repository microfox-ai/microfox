import { Identity } from '../schemas';

export function convertWhatsappUserToIdentity(rawUserData: any): Identity {
    return {
        userInfo: {
            id: `${rawUserData.phoneNumber}`,
            name: rawUserData.userProfile?.contacts?.[0]?.profile?.name || ""
        },
        providerInfo: {
            provider: "whatsapp",
            providerUserId: `${rawUserData.phoneNumber}`,
            providerIcon: "https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/whatsapp-icon.svg",
        }
    }
} 