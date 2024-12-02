import { shallow } from 'zustand/shallow'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions'
import {
  defaultConfigurableSettings,
  useSettingsStore,
} from '../stores/settings/useSettingsStore'
import { useTools } from './useTools'

export const useSettingMonitor = () => {
  const [
    disabledBridges,
    disabledExchanges,
    slippage,
    gasPrice,
  ] = useSettingsStore(
    (state) => [
      state.disabledBridges,
      state.disabledExchanges,
      state.slippage,
      state.gasPrice,
    ],
    shallow
  )
  const { tools } = useTools()
  const config = useWidgetConfig()
  const { setDefaultSettings, resetSettings } = useSettingsActions()

  const isSlippageChanged = config.slippage
    ? Number(slippage) !== config.slippage * 100
    : slippage !== defaultConfigurableSettings.slippage

  const isSlippageOutsideRecommendedLimits =
    isSlippageChanged && Number(slippage) > 1


  const isGasPriceChanged = gasPrice !== defaultConfigurableSettings.gasPrice

  const isBridgesChanged = Boolean(disabledBridges.length)
  const isExchangesChanged = Boolean(disabledExchanges.length)

  const isCustomRouteSettings =
    isBridgesChanged ||
    isExchangesChanged ||
    isSlippageChanged ||
    isGasPriceChanged

  const isRouteSettingsWithWarnings = isSlippageOutsideRecommendedLimits

  const reset = () => {
    if (tools) {
      resetSettings(
        tools.bridges.map((tool) => tool.key),
        tools.exchanges.map((tool) => tool.key)
      )

      setDefaultSettings(config)
    }
  }

  return {
    isBridgesChanged,
    isExchangesChanged,
    isSlippageChanged,
    isSlippageOutsideRecommendedLimits,
    isGasPriceChanged,
    isCustomRouteSettings,
    isRouteSettingsWithWarnings,
    reset,
  }
}
