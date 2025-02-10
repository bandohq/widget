# Bando Spend Widget

The ideal widget to make crypto spendable easily and efficiently.

Check the complete documentation here:

- [Widget Documentation](https://docs.bando.cool/widget/overview)
- [BFP Documentation](https://docs.bando.cool/)

## Key Features

- **All-in-One Solution**: Support for all ecosystems, chains and tokens, and products supported by Bando (more and more added every week).
- **Wallet Management**: Includes UI for managing wallets (EVM, solana coming soon) with the option to use your own wallet solution.
- **Flexible Styling**: Customizable themes and styles to seamlessly integrate with your app's design.
- **Multi-Language Support**: Complete UI translations to cater to a global audience.
- **Broad Compatibility**: Tested with React, Next.js, Vite.

---

## Installation

Prerequisites:

- Node.js v16+
- @tanstack/react-query
- wagmi
- @bigmi/react
- @solana/wallet-adapter-react

### Step 1: Install Dependencies

Install the Bando Widget using your favorite package manager eg:

```bash
pnpm add @bandohq/widget wagmi @bigmi/react @solana/wallet-adapter-react @tanstack/react-query
```
---

## Configuration

Create a configuration file for your widget:

### Configuration Example

```javascript
import { BandoWidget, WidgetConfig } from "@bandohq/widget";

const widgetConfig: WidgetConfig = {
  theme: {
    container: {
      border: "1px solid rgb(234, 234, 234)",
      borderRadius: "16px",
    },
  },
};

export const WidgetPage = () => {
  return (
    <BandoWidget integrator="Your dApp/company name" config={widgetConfig} />
  );
};
```

---

## Usage

### Import and Render the Widget

```javascript
import { BandoWidget } from "@bandohq/widget";

function App() {
  return <BandoWidget integrator="Your dApp/company name" />;
}
```

### Customize the Widget

You can pass configuration properties and other adjustments:

```javascript
<BandoWidget
  fromChain="celo"
  fromToken="CELO"
  theme={{
    container: {
      border: "2px solid #000",
      borderRadius: "8px",
    },
  }}
/>
```

---

## Technologies Used

- React
- Viem and Wagmi (for on-chain interactions)
- Solana support coming soon

---

## Getting Started

- [Install the Bando Widget](https://docs.bando.cool/widget/install)
- [Configure the Widget](https://docs.bando.cool/widget/configure)
- [Localization](https://docs.bando.cool/widget/localization)
- [Customize Styles](https://docs.bando.cool/widget/customization)
- [Wallet Management](https://docs.bando.cool/widget/wallet-management)

Guides:

- [Next.js Guide](https://docs.bando.cool/widget/framework-integration/next)

---

## License

This project is licensed under the **Apache 2.0** license.

---

## Contact

If you have any questions or suggestions, contact us at **support@bando.cool**.

---

## Special thanks to @lifinance
"Great software, likewise, requires a fanatical devotion to beauty. If you look inside good software, you find that parts no one is ever supposed to see are beautiful too." - Paul Graham

The bando widget is built on top of the amazing @lifi/wallet-management package and their on @lifi/widget architecture.
