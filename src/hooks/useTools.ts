import { type ToolsResponse, getTools } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useSettingsStore } from '../stores/settings/useSettingsStore'
import { isItemAllowed } from '../utils/item.js'

export const useTools = () => {
  const { bridges, exchanges } = useWidgetConfig()
  const { data } = useQuery({
    queryKey: [
      'tools',
      bridges?.allow,
      bridges?.deny,
      exchanges?.allow,
      exchanges?.deny,
    ],
    queryFn: async (): Promise<ToolsResponse> => {
      const tools = await getTools()
      const result = {
        bridges: tools.bridges.filter((bridge) =>
          isItemAllowed(bridge.key, bridges)
        ),
        exchanges: tools.exchanges.filter((exchange) =>
          isItemAllowed(exchange.key, exchanges)
        ),
      }
      const { initializeTools } = useSettingsStore.getState()
      initializeTools(
        'Bridges',
        result.bridges.map((bridge) => bridge.key)
      )
      initializeTools(
        'Exchanges',
        result.exchanges.map((exchange) => exchange.key)
      )
      return result
    },
    refetchInterval: 180_000,
    staleTime: 180_000,
  })

  return { tools: data }
}
