# Bando.cool Widget

The ideal widget to make crypto spendable easily and efficiently.

Check the complete documentation here:

- [Widget Documentation](https://docs.bando.cool/widget/overview)
- [BFP Documentation](https://docs.bando.cool/)

## Key Features

- **Wallet Compatibility**: Support for any wallet compatible with EVM, SVM, and UTXO.
- **Custom Configuration**: Customize the widget settings to fit your specific use cases.
- **Bando Fulfillment Protocol (BFP)**: Utilizes the BFP to efficiently manage operations.

---

## Installation

Prerequisites:

- Node.js v16+
- npm

### Step 1: Install Dependencies

```bash
npm install @bandohq/widget @bigmi/react @bigmi/core viem
```

---

## Configuration

Create a configuration file for your widget:

### Configuration Example

```javascript
import { BandoWidget } from "@bandohq/widget";

const widgetConfig = {
  fromChain: "ethereum",
  fromToken: "ETH",
  country: "US",
};

function App() {
  return <BandoWidget config={widgetConfig} />;
}

export default App;
```

---

## Usage

### Import and Render the Widget

```javascript
import { BandoWidget } from "@bandohq/widget";

function App() {
  return <BandoWidget />;
}
```

### Customize the Widget

You can pass configuration properties and other adjustments:

```javascript
<BandoWidget fromChain="solana" fromToken="SOL" />
```

---

## Technologies Used

- React
- Bigmi (for configuration management and integration)
- Viem (for on-chain interactions)

---

## License

This project is licensed under the **MIT** license.

---

## Contact

If you have any questions or suggestions, contact us at **support@bando.cool**.

---

© 2024 Bando.cool. All rights reserved.
