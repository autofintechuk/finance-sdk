/**
 * Finance Calculator SDK
 * Version 1.0.0
 * Auto Fintech UK
 */

(function (window) {
  "use strict";

  // Constants
  const DEFAULT_CONFIG = {
    baseUrl: "https://yourcompany.com",
    storagePrefix: "finance_sdk_",
    apiKey: null,
  };

  const createFinanceCalculator = (config) => {
    const currentConfig = { ...DEFAULT_CONFIG, ...config };
    let iframe = null;

    // Validate configuration
    const validateConfig = () => {
      if (!currentConfig.dealerId) {
        throw new Error("dealerId is required");
      }
      if (!currentConfig.iframeId) {
        throw new Error("iframeId is required");
      }
    };

    // Handle messages from iframe
    const handleMessage = (event) => {
      // Verify origin
      if (!event.origin.includes(new URL(currentConfig.baseUrl).hostname)) {
        return;
      }

      handlePaymentUpdate(event.data);
    };

    const handlePaymentUpdate = (data) => {
      if (!data.vrm) return;

      const storageData = {
        ...data,
        dealerId: currentConfig.dealerId,
      };

      // Store in localStorage
      localStorage.setItem(
        `${currentConfig.storagePrefix}payment_${data.vrm}`,
        JSON.stringify(storageData)
      );

      // Callback if provided
      if (typeof currentConfig.onPaymentUpdate === "function") {
        currentConfig.onPaymentUpdate(data);
      }
    };

    const getAllUtmParams = () => {
      const utmParams = {};
      const urlParams = new URLSearchParams(window.location.search);

      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "utm_id",
        "fbclid",
        "gclid",
      ].forEach((param) => {
        const value = urlParams.get(param) || localStorage.getItem(param);
        if (value) {
          utmParams[param] = value;
        }
      });

      return utmParams;
    };

    const captureUtmParams = () => {
      const utmParams = getAllUtmParams();

      // Store UTM params in localStorage
      Object.entries(utmParams).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Send UTM params to iframe
      postMessageToIframe({
        type: "UTM_PARAMS",
        payload: utmParams,
      });
    };

    const postMessageToIframe = (message) => {
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage(message, currentConfig.baseUrl);
    };

    // Initialize calculator
    const init = () => {
      validateConfig();

      // Initialize calculator iframe
      iframe = document.getElementById(currentConfig.iframeId);
      if (!iframe) {
        throw new Error(`Iframe with id "${currentConfig.iframeId}" not found`);
      }

      // Set iframe src with UTM parameters
      const params = new URLSearchParams({
        dealerId: currentConfig.dealerId,
        ...getAllUtmParams(),
      });
      iframe.src = `${currentConfig.baseUrl}/?${params.toString()}`;

      // Set up message listener
      window.addEventListener("message", handleMessage);

      // Capture and forward UTM parameters
      captureUtmParams();
    };

    // Public Methods
    const getStoredPayment = (vrm) => {
      const data = localStorage.getItem(
        `${currentConfig.storagePrefix}payment_${vrm}`
      );
      if (!data) return null;

      const parsedData = JSON.parse(data);

      // Only validate dealer ID
      if (parsedData.dealerId !== currentConfig.dealerId) {
        localStorage.removeItem(`${currentConfig.storagePrefix}payment_${vrm}`);
        return null;
      }

      return parsedData;
    };

    const fetchDealerPayments = async () => {
      if (!currentConfig.apiKey) {
        throw new Error("apiKey is required for fetching dealer payments");
      }

      const url = new URL("/api/finance-payments", currentConfig.baseUrl);
      url.searchParams.append("dealerId", currentConfig.dealerId);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-API-KEY": currentConfig.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch dealer payments: ${response.statusText}`
        );
      }

      const csvText = await response.text();
      return csvText;
    };

    // Initialize and return public API
    init();

    return {
      getStoredPayment,
      fetchDealerPayments,
    };
  };

  // Export to window
  window.createFinanceCalculator = createFinanceCalculator;
})(window);
