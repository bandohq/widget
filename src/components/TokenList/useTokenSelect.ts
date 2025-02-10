import { useCallback } from 'react'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useChainOrderStoreContext } from '../../stores/chains/ChainOrderStore.js'
import type { FormType } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldController } from '../../stores/form/useFieldController'
import { WidgetEvent } from '../../types/events.js'

export type UseTokenSelectArgs = {
  formType: FormType
  onClick?: () => void
}

export const useTokenSelect = (formType: FormType, onClick?: () => void) => {
  const { subvariant, disabledUI } = useWidgetConfig()
  const emitter = useWidgetEvents()
  const { setFieldValue, getFieldValues } = useFieldActions()
  const chainOrderStore = useChainOrderStoreContext()

  const tokenKey = FormKeyHelper.getTokenKey(formType)
  const { onChange } = useFieldController({ name: tokenKey })

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      onChange(tokenAddress)
      const selectedChainId =
        chainId ?? getFieldValues(FormKeyHelper.getChainKey(formType))[0]
      // Set chain again to trigger URL builder update
      setFieldValue(FormKeyHelper.getChainKey(formType), selectedChainId, {
        isDirty: true,
        isTouched: true,
      })

      const eventToEmit = WidgetEvent.SourceChainTokenSelected

      if (selectedChainId) {
        emitter.emit(eventToEmit, {
          chainId: selectedChainId,
          tokenAddress,
        })
      }

      onClick?.()
    },
    [
      chainOrderStore,
      disabledUI,
      emitter,
      formType,
      getFieldValues,
      onChange,
      onClick,
      setFieldValue,
      subvariant,
    ]
  )
}
