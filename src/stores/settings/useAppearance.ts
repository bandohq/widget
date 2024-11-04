import { useSettingsActions } from '../../stores/settings/useSettingsActions'
import type { Appearance } from '../../types/widget'
import { useSettingsStore } from './useSettingsStore'

export const useAppearance = (): [
  Appearance,
  (appearance: Appearance) => void,
] => {
  const { setValue } = useSettingsActions()
  const appearance = useSettingsStore((state) => state.appearance)
  const setAppearance = (appearance: Appearance) => {
    setValue('appearance', appearance)
  }
  return [appearance, setAppearance]
}
