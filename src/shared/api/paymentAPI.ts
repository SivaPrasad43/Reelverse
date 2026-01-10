import { api } from './endpoints';

/**
 * Payment API service
 */
export const paymentAPI = {
  /**
   * Create payment intent
   */
  createPaymentIntent: async (courseId: string, amount: number) => {
    try {
      return await api.payment.createIntent(courseId, amount);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  /**
   * Confirm payment
   */
  confirmPayment: async (paymentIntentId: string) => {
    try {
      return await api.payment.confirmPayment(paymentIntentId);
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },
};

export default paymentAPI;