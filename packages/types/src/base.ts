/** Common */

export type BIP44Params = {
  purpose: number
  coinType: number
  accountNumber: number
  isChange?: boolean
  index?: number
}

export enum KnownChainIds {
  EthereumMainnet = 'eip155:1',
  BitcoinMainnet = 'bip122:000000000019d6689c085ae165831e93',
  CosmosMainnet = 'cosmos:cosmoshub-4',
  OsmosisMainnet = 'cosmos:osmosis-1'
}

// https://api.coingecko.com/api/v3/asset_platforms
export enum CoingeckoAssetPlatform {
  Ethereum = 'ethereum',
  Cosmos = 'cosmos',
  Osmosis = 'osmosis'
}

export enum WithdrawType {
  DELAYED,
  INSTANT
}

export enum UtxoAccountType {
  SegwitNative = 'SegwitNative',
  SegwitP2sh = 'SegwitP2sh',
  P2pkh = 'P2pkh'
}

// asset-service
export type Asset = {
  assetId: string
  chainId: string
  description?: string
  isTrustedDescription?: boolean
  symbol: string
  name: string
  precision: number
  color: string
  icon: string
  explorer: string
  explorerTxLink: string
  explorerAddressLink: string
}

// swapper
// TODO remove this once web is using the type from swapper
export enum SwapperType {
  Zrx = '0x',
  Thorchain = 'Thorchain',
  Test = 'Test'
}
