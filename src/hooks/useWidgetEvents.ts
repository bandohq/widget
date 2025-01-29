import _mitt from 'mitt';
import type { WidgetEvents } from '../types/events';
// https://github.com/developit/mitt/issues/191
// @ts-ignore
const mitt = _mitt as unknown as typeof _mitt.default;

export const widgetEvents = mitt<WidgetEvents>();

export const useWidgetEvents = () => {
  return widgetEvents;
};
