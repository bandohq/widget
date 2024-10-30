import { RouteExecutionStatus } from "../stores/routes/types"

// Mock for useRouteExecution to simulate route execution data
export const useRouteExecution = ({
    routeId,
    executeInBackground,
  }: {
    routeId: string
    executeInBackground?: boolean
  }) => {
    // Mock route structure with dummy data
    const route = {
      id: routeId,
      fromToken: {
        symbol: 'ETH',
        address: '0xMockAddressFrom',
        decimals: 18,
        logoURI: '',
      },
      toToken: {
        symbol: 'DAI',
        address: '0xMockAddressTo',
        decimals: 18,
        logoURI: '',
      },
      steps: [
        {
          execution: {
            status: 'IN_PROGRESS', // Mock status
            process: [
              {
                status: 'ACTION_REQUIRED', // Example status for the process
                substatus: 'PARTIAL',
                txHash: '0xMockTxHash',
                type: 'SWAP',
              },
            ],
          },
        },
      ],
    }
  
    // Mock route status
    const status = RouteExecutionStatus.Pending
  
    return {
      route,
      status,
      executeRoute: () => console.log('Executing route...'),
      restartRoute: () => console.log('Restarting route...'),
      deleteRoute: () => console.log('Deleting route...'),
    }
  }
  