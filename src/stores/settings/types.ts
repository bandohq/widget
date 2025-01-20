import type { PropsWithChildren } from 'react';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { Appearance, SplitSubvariant } from '../../types/widget.js';

export type ValueSetter<S> = <K extends keyof S>(
  key: K,
  value: S[Extract<K, string>],
) => void;

export type ValuesSetter<S> = <K extends keyof S>(
  values: Record<K, S[Extract<K, string>]>,
) => void;

export type ValueGetter<S> = <K extends keyof S>(key: K) => S[K]

export interface SettingsProps {
  appearance: Appearance;
  gasPrice?: string;
  language?: string;
  slippage?: string;
}

export interface SettingsActions {
  setValue: ValueSetter<SettingsProps>
  getValue: ValueGetter<SettingsProps>
  getSettings: () => SettingsProps
}

export interface SettingsState extends SettingsProps {
  setValue: ValueSetter<SettingsProps>;
  setValues: ValuesSetter<SettingsProps>;
  reset(): void;
}

export interface SendToWalletState {
  showSendToWallet: boolean;
}

export interface SendToWalletStore extends SendToWalletState {
  setSendToWallet(value: boolean): void;
}

export interface SplitSubvariantState {
  state?: SplitSubvariant;
  setState(state: SplitSubvariant): void;
}

export type SplitSubvariantStore = UseBoundStoreWithEqualityFn<
  StoreApi<SplitSubvariantState>
>;

export interface SplitSubvariantProps {
  state?: SplitSubvariant;
}

export type SplitSubvariantProviderProps =
  PropsWithChildren<SplitSubvariantProps>;
