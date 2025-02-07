import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { SearchNotFound } from '../Search/SearchNotFound.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { WidgetEvent, NoTokensAvailable } from '../../types/events.js'

export const TokenNotFound: React.FC<FormTypeProps> = ({ formType }) => {
  const { t } = useTranslation()
  const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType))
  const emitter = useWidgetEvents()
  const { getChainById } = useAvailableChains()

  emitter.emit(WidgetEvent.NoTokensAvailable, {
    chainId: selectedChainId,
  } as NoTokensAvailable)
  
  return (
    <SearchNotFound
      message={t('info.message.emptyTokenList', {
        chainName: getChainById(selectedChainId)?.name,
      })}
    />
  )
}
