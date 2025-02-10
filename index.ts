const FinanceSDK = (() => {
  let iframe: HTMLIFrameElement | null = null;
  let dealerId: string;
  let onPaymentUpdate: ((data: any) => void) | undefined;

  const init = ({
    iframeId,
    dealer,
    onPaymentUpdate: updateCallback,
  }: {
    iframeId: string;
    dealer: string;
    onPaymentUpdate?: (data: any) => void;
  }) => {
    try {
      iframe = document.getElementById(iframeId) as HTMLIFrameElement;
      dealerId = dealer;
      onPaymentUpdate = updateCallback;

      if (!iframe) throw new Error("FinanceSDK: Iframe not found.");

      window.addEventListener("message", handleMessage);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = event.data;

      if (!data || !data.vrm || !data.monthlyPayment)
        throw new Error("FinanceSDK: Invalid data received");

      localStorage.setItem(data.vrm, JSON.stringify(data));
      onPaymentUpdate?.(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getPayment = (vrm: string) => {
    try {
      const data = localStorage.getItem(vrm);
      if (!data) throw new Error("FinanceSDK: No payment data found");
      return JSON.parse(data);
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const generateEmbedURL = (
    vrm: string,
    utmParams?: Record<string, string>
  ) => {
    try {
      if (!dealerId) throw new Error("FinanceSDK: Dealer ID is missing");
      const baseUrl = "https://v1-0-2-marketplace.d24ci3n9psmvrs.amplifyapp.com";
      const queryParams = new URLSearchParams({
        vrm,
        dealerId,
        ...utmParams,
      }).toString();
      return `${baseUrl}?${queryParams}`;
    } catch (error) {
      console.error(error.message);
      return "";
    }
  };

  return { init, getPayment, generateEmbedURL };
})();

export default FinanceSDK;
