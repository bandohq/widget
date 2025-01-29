import { useImperativeHandle } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { formDefaultValues } from '../../stores/form/createFormStore.js'
import type { FormRef } from '../../types/widget.js'
import type { FormStoreStore, GenericFormValue } from './types.js'

export const useFormRef = (formStore: FormStoreStore, formRef?: FormRef) => {
  const { hiddenUI } = useWidgetConfig()

  useImperativeHandle(
    formRef,
    () => {
      const sanitizeValue: {
        [key: string]: (value: any) => GenericFormValue
      } = {
        fromAmount: (value) =>
          (typeof value === 'number' ? value?.toPrecision() : value) ||
          formDefaultValues.fromAmount,
      }

      return {
        setFieldValue: (fieldName, value, options) => {
          const sanitizedValue = (
            sanitizeValue[fieldName] ? sanitizeValue[fieldName](value) : value
          ) as GenericFormValue

          const fieldValueOptions = options?.setUrlSearchParam
            ? { isTouched: options?.setUrlSearchParam }
            : undefined

          formStore
            .getState()
            .setFieldValue(fieldName, sanitizedValue, fieldValueOptions)
        },
      }
    },
    [formStore, hiddenUI]
  )
}
