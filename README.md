# Finance Calculator SDK Integration Guide

## Overview

The Auto Fintech Finance Calculator SDK provides a simple way to integrate vehicle finance calculations into third-party dealer websites. The SDK offers:

- Easy integration with minimal code required
- Automatic UTM parameter tracking
- Payment data storage with dealer validation
- Bulk payment data retrieval via API

## Quick Start

### 1. Add the SDK Script

```html
<script src="https://raw.githubusercontent.com/autofintechuk/finance-sdk/main/finance-sdk.js"></script>
```

### 2. Create Required HTML Element

```html
<iframe 
    id="finance-calculator"
    loading="eager"
    style="width: 100%; height: 800px; border: none;"
></iframe>
```

### 3. Initialize the Calculator

```javascript
const calculator = createFinanceCalculator({
    iframeId: 'finance-calculator',
    dealerId: 'YOUR_DEALER_ID',
    apiKey: 'YOUR_API_KEY', // Required for fetchDealerPayments
    onPaymentUpdate: (data) => {
        console.log('Payment updated:', data);
    }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `dealerId` | string | Yes | Your Auto Fintech dealer ID |
| `iframeId` | string | Yes | ID of the calculator iframe element |
| `apiKey` | string | No | API key for accessing dealer payments |
| `onPaymentUpdate` | function | No | Callback for payment updates |
| `baseUrl` | string | No | Override default calculator URL |
| `storagePrefix` | string | No | Prefix for localStorage keys (default: 'finance_sdk_') |

## Integration Methods

### 1. Full SDK Integration
- Complete SDK with all features
- Payment data storage
- UTM parameter tracking
- Bulk payment data access

### 2. Standalone Calculator
- Simple iframe implementation
- No additional features required
- Minimal setup needed

## Payment Data Storage

The SDK stores payment data in localStorage:

```javascript
// Get stored payment data
const paymentData = calculator.getStoredPayment('ML69EDO');
```

Storage features:
- Dealer-specific validation
- Automatic cleanup when dealer ID changes

## Bulk Payment Data Access

Fetch all finance payments for your dealership in CSV format:

```javascript
try {
    const csvData = await calculator.fetchDealerPayments();
    console.log('Finance payments:', csvData);
} catch (error) {
    console.error('Failed to fetch payments:', error);
}
```

The CSV data includes:
```csv
VRM,Monthly Payment,Deposit,APR
ML69EDO,299.99,1000,6.9
```

Requirements:
- Valid API key must be provided during initialization
- Dealer ID must match the authenticated dealer

## UTM Parameter Handling

Automatically captures and forwards UTM parameters from:
- URL parameters
- localStorage (for returning visitors)

Supported parameters:
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term
- utm_id
- fbclid
- gclid

## Security

- Dealer authentication via dealerId
- Origin validation for iframe communication
- Dealer-specific data storage
- API key authentication for bulk data access