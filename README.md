# Bando.cool Widget

The ideal widget to make crypto spendable easily and efficiently.

Check the complete documentation here:

- [Widget Documentation](https://docs.bando.cool/widget/overview)
- [BFP Documentation](https://docs.bando.cool/)

## Key Features

- **All-in-One Solution**: Support for all ecosystems, chains and tokens, and products supported by Bando.
- **Wallet Management**: Includes UI for managing wallets (EVM, Solana, and Bitcoin) with the option to use your own wallet solution.
- **Flexible Styling**: Customizable themes and styles to seamlessly integrate with your app's design.
- **Multi-Language Support**: Complete UI translations to cater to a global audience.
- **Broad Compatibility**: Tested with popular frameworks including React, Next.js, Vue, Nuxt.js, Svelte, Remix, Gatsby, Vite, and CRA.

---

## Installation

Prerequisites:

- Node.js v16+
- npm

### Step 1: Install Dependencies

Install the Bando Widget using npm:

```bash
npm install @bandohq/widget
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
  fromChain="solana"
  fromToken="SOL"
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
- Bigmi (for configuration management and integration)
- Viem (for on-chain interactions)

---

## Getting Started

- [Install the Bando Widget](https://docs.bando.cool/widget/install)
- [Configure the Widget](https://docs.bando.cool/widget/configure)
- [Localization](https://docs.bando.cool/widget/localization)
- [Customize Styles](https://docs.bando.cool/widget/customization)
- [Wallet Management](https://docs.bando.cool/widget/wallet-management)

Guides:

- [Next.js Guide](https://docs.bando.cool/widget/framework-integration/next)
- [Vue Guide](https://docs.bando.cool/widget/framework-integration/vue)
- [Svelte Guide](https://docs.bando.cool/widget/framework-integration/svelte)

---

## License

This project is licensed under the **MIT** license.

---

## Contact

If you have any questions or suggestions, contact us at **support@bando.cool**.

---

© 2024 Bando.cool. All rights reserved.
