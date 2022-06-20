import { HDWallet } from '@shapeshiftoss/hdwallet-core'
import { Asset } from '@shapeshiftoss/types'

import { BuildTradeInput, GetTradeQuoteInput, TradeQuote } from '../../../api'
import { FOX, WETH } from './assets'

export const setupQuote = () => {
  const sellAsset: Asset = { ...FOX }
  const buyAsset: Asset = { ...WETH }
  const tradeQuote: TradeQuote<'eip155:1'> = {
    buyAmount: '',
    sellAmount: '1000000000000000000',
    sellAsset,
    buyAsset,
    allowanceContract: 'allowanceContractAddress',
    sellAssetAccountNumber: 0,
    minimum: '0',
    maximum: '999999999999',
    feeData: { fee: '0', tradeFee: '0', chainSpecific: {} },
    rate: '1',
    sources: []
  }

  const quoteInput: GetTradeQuoteInput = {
    chainId: 'eip155:1',
    sellAmount: '1000000000000000000',
    sellAsset,
    buyAsset,
    sellAssetAccountNumber: 0,
    sendMax: false
  }
  return { quoteInput, tradeQuote, buyAsset, sellAsset }
}

export const setupBuildTrade = () => {
  const sellAsset: Asset = { ...FOX }
  const buyAsset: Asset = { ...WETH }
  const buildTradeInput: BuildTradeInput = {
    chainId: 'eip155:1',
    sellAmount: '1000000000000000000',
    buyAsset,
    sendMax: false,
    sellAssetAccountNumber: 0,
    buyAssetAccountNumber: 0,
    sellAsset,
    wallet: <HDWallet>{}
  }
  return { buildTradeInput, buyAsset, sellAsset }
}
