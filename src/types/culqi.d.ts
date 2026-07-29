export {};

declare global {
  interface CulqiCheckoutToken {
    id: string;
  }

  interface CulqiCheckoutError {
    user_message?: string;
    merchant_message?: string;
  }

  interface CulqiCheckoutInstance {
    token?: CulqiCheckoutToken;
    order?: unknown;
    error?: CulqiCheckoutError;
    culqi?: () => void;
    open: () => void;
    close: () => void;
  }

  interface Window {
    CulqiCheckout: new (
      publicKey: string,
      config: Record<string, unknown>,
    ) => CulqiCheckoutInstance;
  }
}
