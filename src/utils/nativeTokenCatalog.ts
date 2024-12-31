export type NativeTokenCatalog = {
    key: string;
    native_token: {
        name: string;
        symbol: string;
        decimals: number;
    };
};

const nativeTokenCatalog: NativeTokenCatalog[] = [
    {
        key: "bls",
        native_token: {
            name: "Blast Token",
            symbol: "BLST",
            decimals: 18,
        },
    },
    {
        key: "cel",
        native_token: {
            name: "Celo Token",
            symbol: "CELO",
            decimals: 18,
        },
    },
    {
        key: "mam",
        native_token: {
            name: "Metis Token",
            symbol: "METIS",
            decimals: 18,
        },
    },
    {
        key: "eth",
        native_token: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "lsk",
        native_token: {
            name: "Lisk",
            symbol: "LSK",
            decimals: 8,
        },
    },
    {
        key: "fus",
        native_token: {
            name: "Fuse Token",
            symbol: "FUSE",
            decimals: 18,
        },
    },
    {
        key: "xly",
        native_token: {
            name: "XLayer Token",
            symbol: "XLY",
            decimals: 18, // TODO: Confirm data
        },
    },
    {
        key: "pol",
        native_token: {
            name: "Polygon Token",
            symbol: "MATIC",
            decimals: 18,
        },
    },
    {
        key: "sol",
        native_token: {
            name: "Solana",
            symbol: "SOL",
            decimals: 9,
        },
    },
    {
        key: "mor",
        native_token: {
            name: "Moonriver",
            symbol: "MOVR",
            decimals: 18,
        },
    },
    {
        key: "arb",
        native_token: {
            name: "Arbitrum Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "rsk",
        native_token: {
            name: "Rootstock R-BTC",
            symbol: "RBTC",
            decimals: 18,
        },
    },
    {
        key: "dai",
        native_token: {
            name: "xDai",
            symbol: "xDAI",
            decimals: 18,
        },
    },
    {
        key: "pze",
        native_token: {
            name: "Polygon zkEVM Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "imx",
        native_token: {
            name: "Immutable zkEVM Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "mod",
        native_token: {
            name: "Mode Token",
            symbol: "MODE",
            decimals: 18, // TODO: Confirm data
        },
    },
    {
        key: "wcc",
        native_token: {
            name: "World Chain Token",
            symbol: "WCC",
            decimals: 18, // TODO: Confirm data
        },
    },
    {
        key: "opb",
        native_token: {
            name: "opBNB Token",
            symbol: "BNB",
            decimals: 18,
        },
    },
    {
        key: "cro",
        native_token: {
            name: "Cronos",
            symbol: "CRO",
            decimals: 18,
        },
    },
    {
        key: "moo",
        native_token: {
            name: "Moonbeam",
            symbol: "GLMR",
            decimals: 18,
        },
    },
    {
        key: "gra",
        native_token: {
            name: "Gravity Token",
            symbol: "GRAV",
            decimals: 18, // TODO: Confirm data
        },
    },
    {
        key: "era",
        native_token: {
            name: "zkSync Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "lna",
        native_token: {
            name: "Linea Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "bsc",
        native_token: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
        },
    },
    {
        key: "aur",
        native_token: {
            name: "Aurora Token",
            symbol: "AUR",
            decimals: 18, // TODO: Confirm data
        },
    },
    {
        key: "ftm",
        native_token: {
            name: "Fantom",
            symbol: "FTM",
            decimals: 18,
        },
    },
    {
        key: "tai",
        native_token: {
            name: "Taiko Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "bas",
        native_token: {
            name: "Base Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "ava",
        native_token: {
            name: "Avalanche",
            symbol: "AVAX",
            decimals: 18,
        },
    },
    {
        key: "bob",
        native_token: {
            name: "Boba Token",
            symbol: "BOBA",
            decimals: 18,
        },
    },
    {
        key: "opt",
        native_token: {
            name: "Optimism Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "scl",
        native_token: {
            name: "Scroll Ether",
            symbol: "ETH",
            decimals: 18,
        },
    },
    {
        key: "mnt",
        native_token: {
            name: "Mantle Token",
            symbol: "MNT",
            decimals: 18, // TODO: Confirm data
        },
    },
    {
        key: "sei",
        native_token: {
            name: "Sei Token",
            symbol: "SEI",
            decimals: 18,
        },
    },
    {
        key: "kai",
        native_token: {
            name: "Kaia Token",
            symbol: "KAI",
            decimals: 18,
        },
    },
    {
        key: "fra",
        native_token: {
            name: "Fraxtal Token",
            symbol: "FRAX",
            decimals: 18,
        },
    },
];
  
export default nativeTokenCatalog;
  