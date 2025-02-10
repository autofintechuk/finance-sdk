# Finance SDK

A lightweight JavaScript/TypeScript SDK for integrating finance calculator functionality into dealer websites.

## Installation

### Using CDN

Add the following script tag to your HTML:

```html
<script src="https://raw.githubusercontent.com/autofintechuk/finance-sdk/main/index.ts"></script>
```

Or import directly in your TypeScript file:

```typescript
import FinanceSDK from 'https://raw.githubusercontent.com/autofintechuk/finance-sdk/main/index.ts'
```

## Quick Start

```typescript
// Initialize the SDK
FinanceSDK.init({
  iframeId: "finance-calculator", // ID of the iframe element
  dealer: "YOUR_DEALER_ID",      // Your unique dealer identifier
  onPaymentUpdate: (data) => {   // Optional callback for payment updates
    console.log(`Monthly Payment for ${data.vrm}: ${data.monthlyPayment}`);
  },
});
```

## API Reference

### `init(options)`

Initializes the Finance SDK with the required configuration.

#### Parameters

- `options` (Object):
  - `iframeId` (string): The ID of the iframe element where the calculator will be embedded
  - `dealer` (string): Your unique dealer identifier
  - `onPaymentUpdate` (function, optional): Callback function that receives payment data updates

#### Example

```typescript
FinanceSDK.init({
  iframeId: "finance-calculator",
  dealer: "12345",
  onPaymentUpdate: (data) => {
    console.log(data.vrm);         // Vehicle registration number
    console.log(data.monthlyPayment); // Monthly payment amount
  },
});
```

### `getPayment(vrm)`

Retrieves stored payment information for a specific vehicle.

#### Parameters

- `vrm` (string): Vehicle registration number

#### Returns

- Payment data object or null if not found

#### Example

```typescript
const paymentData = FinanceSDK.getPayment("AB12CDE");
if (paymentData) {
  console.log(paymentData.monthlyPayment);
}
```

### `generateEmbedURL(vrm, utmParams?)`

Generates the URL for embedding the finance calculator.

#### Parameters

- `vrm` (string): Vehicle registration number
- `utmParams` (object, optional): UTM parameters for tracking

#### Returns

- URL string for the finance calculator

#### Example

```typescript
const url = FinanceSDK.generateEmbedURL("AB12CDE", {
  utm_source: "dealer_website",
  utm_medium: "widget"
});
```

## Error Handling

The SDK includes built-in error handling and will log errors to the console. Common errors include:

- "FinanceSDK: Iframe not found" - The specified iframe element doesn't exist
- "FinanceSDK: Invalid data received" - Received malformed data from the calculator
- "FinanceSDK: No payment data found" - No stored payment data for the specified VRM
- "FinanceSDK: Dealer ID is missing" - SDK not properly initialized with dealer ID

## Data Storage

The SDK uses localStorage to cache payment information for quick retrieval. Data is stored using the VRM as the key.

## Security

The SDK communicates with the finance calculator through a secure iframe using the postMessage API. All data is validated before processing.

## Browser Support

The SDK is compatible with all modern browsers that support:
- localStorage
- postMessage API
- iframe embedding
