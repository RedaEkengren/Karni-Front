// services/newsletter.ts

//EXAMPLE

export interface Shop {
  id: string;
  name: string;
  email: string;
  city: string;
}

export const NewsletterService = {
  // Calculate the MAD price based on your 1,000 shop list
  calculateQuote: (shopCount: number, ratePerShop: number = 1.5): number => {
    return shopCount * ratePerShop;
  },

  // Trigger the send via your backend or an API like Brevo/Resend
  sendCampaign: async (subject: string, htmlContent: string, shopIds: string[]) => {
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, htmlContent, shopIds }),
      });

      return await response.json();
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      throw error;
    }
  }
};
