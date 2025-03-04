import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { ReferenceType } from '../../providers/CatalogProvider/types'

export interface DefaultFieldValues {
  fromChain?: number
  fromToken?: string
  reference?: string
  requiredFields?: ReferenceType[]
  fromAmount: string
  toAmount: string
  productId?: string
  phone: string
  country?: string
  quote_display?: string
}

export interface DefaultValues extends DefaultFieldValues {
  contractCalls?: any
  tokenSearchFilter: string
}

export type GenericFormValue = string | number | any | undefined
export interface FormValueControl<T> {
  isTouched: boolean
  isDirty: boolean
  value: T
}

export type FormValues = {
  [Property in keyof DefaultValues]: FormValueControl<DefaultValues[Property]>
}

export type FormFieldNames = keyof FormValues
export type ExtractValueType<T> = T extends FormValueControl<infer U>
  ? U
  : never
export type FormFieldArray<T extends FormFieldNames[]> = {
  [K in keyof T]: ExtractValueType<FormValues[T[K]]>
}

export type TouchedFields = { [K in FormFieldNames]?: boolean }

type ValidationFn = (value: any) => Promise<boolean | string>
export interface ValidationProps {
  isValid: boolean
  isValidating: boolean
  errors: {
    [K in FormFieldNames]?: string
  }
  validation: {
    [K in FormFieldNames]?: ValidationFn
  }
}

export interface ValidationActions {
  addFieldValidation: (name: FormFieldNames, validationFn: ValidationFn) => void
  triggerFieldValidation: (name: FormFieldNames) => Promise<boolean>
  clearErrors: (name: FormFieldNames) => void
}

export interface FormProps {
  defaultValues: FormValues
  userValues: FormValues
  touchedFields: { [K in FormFieldNames]?: boolean }
}

export interface ResetOptions {
  defaultValue?: GenericFormValue
}

export interface FormActions {
  setDefaultValues: (formValues: DefaultValues) => void
  setUserAndDefaultValues: (formValues: Partial<DefaultValues>) => void
  isTouched: (fieldName: FormFieldNames) => boolean
  isDirty: (fieldName: FormFieldNames) => boolean
  setAsTouched: (fieldName: FormFieldNames) => void
  resetField: (fieldName: FormFieldNames, resetOptions?: ResetOptions) => void
  setFieldValue: (
    fieldName: FormFieldNames,
    value: GenericFormValue,
    options?: SetOptions
  ) => void
  getFieldValues: <T extends FormFieldNames[]>(...names: T) => FormFieldArray<T>
}

export type FormValuesState = FormProps &
  FormActions &
  ValidationProps &
  ValidationActions

export type FormStoreStore = UseBoundStoreWithEqualityFn<
  StoreApi<FormValuesState>
>

export interface SetOptions {
  isDirty?: boolean
  isTouched?: boolean
}

export type FormType = 'from' 

export interface FormTypeProps {
  formType: FormType
  readOnly?: boolean
}

export const FormKeyHelper = {
  getChainKey: (formType: FormType): 'fromChain' =>
    `${formType}Chain`,
  getTokenKey: (formType: FormType): 'fromToken' =>
    `${formType}Token`,
  getAmountKey: (formType: FormType): 'fromAmount' =>
    `${formType}Amount`,
}