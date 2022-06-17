import toLower from 'lodash/toLower'

import { fromAssetId } from '../../assetId/assetId'
import { ChainId, fromChainId } from '../../chainId/chainId'
import { CHAIN_NAMESPACE, CHAIN_REFERENCE } from '../../constants'
import * as adapters from './generated'

// https://api.coingecko.com/api/v3/asset_platforms
export enum CoingeckoAssetPlatform {
  Ethereum = 'ethereum',
  Cosmos = 'cosmos',
  Osmosis = 'osmosis',
  Avalanche = 'avalanche'
}

export const coingeckoBaseUrl = 'http://api.coingecko.com/api/v3'
export const coingeckoProBaseUrl = 'http://pro-api.coingecko.com/api/v3'
export const coingeckoUrl = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true'

const generatedAssetIdToCoingeckoMap = Object.values(adapters).reduce((acc, cur) => ({
  ...acc,
  ...cur
})) as Record<string, string>

const invert = <T extends Record<string, string>>(data: T) =>
  Object.entries(data).reduce((acc, [k, v]) => ((acc[v] = k), acc), {} as Record<string, string>)

const generatedCoingeckoToAssetIdMap: Record<string, string> = invert(
  generatedAssetIdToCoingeckoMap
)

export const coingeckoToAssetId = (id: string): string | undefined =>
  generatedCoingeckoToAssetIdMap[id]

export const assetIdToCoingecko = (assetId: string): string | undefined =>
  generatedAssetIdToCoingeckoMap[toLower(assetId)]

export const makeCoingeckoAssetUrl = (assetId: string, apiKey?: string): string => {
  const id = assetIdToCoingecko(assetId)
  if (!id) throw new Error(`no coingecko asset for assetId: ${assetId}`)

  const baseUrl = apiKey ? coingeckoProBaseUrl : coingeckoBaseUrl
  const maybeApiKey = apiKey ? `&x_cg_pro_api_key=${apiKey}` : ''

  const { chainReference, assetNamespace, assetReference } = fromAssetId(assetId)

  if (assetNamespace === 'erc20') {
    const assetPlatform = (() => {
      switch (chainReference) {
        case CHAIN_REFERENCE.EthereumMainnet:
          return CoingeckoAssetPlatform.Ethereum
        case CHAIN_REFERENCE.AvalancheCChain:
          return CoingeckoAssetPlatform.Avalanche
        default:
          throw new Error(
            `no supported coingecko asset platform for chain reference: ${chainReference}`
          )
      }
    })()

    return `${baseUrl}/coins/${assetPlatform}/contract/${assetReference}${maybeApiKey}`
  }

  return `${baseUrl}/coins/${id}${maybeApiKey}`
}

// https://www.coingecko.com/en/api/documentation - See asset_platforms
export const chainIdToCoingeckoAssetPlatform = (chainId: ChainId): string => {
  const { chainNamespace, chainReference } = fromChainId(chainId)
  switch (chainNamespace) {
    case CHAIN_NAMESPACE.Ethereum:
      switch (chainReference) {
        case CHAIN_REFERENCE.EthereumMainnet:
          return 'ethereum'
        case CHAIN_REFERENCE.AvalancheCChain:
          return 'avalanche'
        default:
          throw new Error(
            `chainNamespace ${chainNamespace}, chainReference ${chainReference} not supported.`
          )
      }
    case CHAIN_NAMESPACE.Cosmos:
      switch (chainReference) {
        case CHAIN_REFERENCE.CosmosHubMainnet:
          return 'cosmos'
        case CHAIN_REFERENCE.OsmosisMainnet:
          return 'osmosis'
        default:
          throw new Error(
            `chainNamespace ${chainNamespace}, chainReference ${chainReference} not supported.`
          )
      }
    // Bitcoin is not a valid asset platform: https://api.coingecko.com/api/v3/asset_platforms
    case CHAIN_NAMESPACE.Bitcoin:
    default:
      throw new Error(
        `chainNamespace ${chainNamespace}, chainReference ${chainReference} not supported.`
      )
  }
}
