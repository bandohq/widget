import type { SettingsProps, SettingsState } from './types.js'

export const getStateValues = (state: SettingsState): SettingsProps => ({
  appearance: state.appearance,
  gasPrice: state.gasPrice,
  language: state.language,
  slippage: state.slippage,
})
