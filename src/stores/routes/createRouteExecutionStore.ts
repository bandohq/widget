// Mock types replacing SDK-based types
export interface Route {
  id: string
  fromChainId: number
  toChainId: number
  fromAmount: string
  toAmount: string
  fromToken: {
    address: string
    symbol: string
    decimals: number
  }
  toToken: {
    address: string
    symbol: string
    decimals: number
  }
}

export interface RouteExtended extends Route {
  steps: Array<{
    type: string
    action: {
      fromToken: {
        address: string
        symbol: string
        decimals: number
      }
      toToken: {
        address: string
        symbol: string
        decimals: number
      }
    }
    execution?: {
      status: string
      process: Array<{
        startedAt?: number
      }>
    }
  }>
}

import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import { hasEnumFlag } from '../../utils/enum'
import type { PersistStoreProps } from '../types.js'
import type { RouteExecutionState } from './types.js'
import { RouteExecutionStatus } from './types.js'
import {
  isRouteDone,
  isRouteFailed,
  isRoutePartiallyDone,
  isRouteRefunded,
} from './utils.js'

export const createRouteExecutionStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<RouteExecutionState>(
    persist(
      (set, get) => ({
        routes: {},
        setExecutableRoute: (route: Route, observableRouteIds?: string[]) => {
          if (!get().routes[route.id]) {
            set((state: RouteExecutionState) => {
              const routes = { ...state.routes }
              Object.keys(routes)
                .filter(
                  (routeId) => (!observableRouteIds?.includes(routeId) &&
                    hasEnumFlag(
                      routes[routeId]!.status,
                      RouteExecutionStatus.Idle
                    )) ||
                    hasEnumFlag(
                      routes[routeId]!.status,
                      RouteExecutionStatus.Done
                    )
                )
                .forEach((routeId) => delete routes[routeId])
              routes[route.id] = {
                route,
                status: RouteExecutionStatus.Idle,
              }
              return {
                routes,
              }
            })
          }
        },
        updateRoute: (route: RouteExtended) => {
          if (get().routes[route.id]) {
            set((state: RouteExecutionState) => {
              const updatedState = {
                routes: {
                  ...state.routes,
                  [route.id]: { ...state.routes[route.id]!, route },
                },
              }
              const isFailed = isRouteFailed(route)
              if (isFailed) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Failed
                return updatedState
              }
              const isDone = isRouteDone(route)
              if (isDone) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Done
                if (isRoutePartiallyDone(route)) {
                  updatedState.routes[route.id]!.status |=
                    RouteExecutionStatus.Partial
                } else if (isRouteRefunded(route)) {
                  updatedState.routes[route.id]!.status |=
                    RouteExecutionStatus.Refunded
                }
                return updatedState
              }
              const isLoading = route.steps.some((step) => step.execution)
              if (isLoading) {
                updatedState.routes[route.id]!.status =
                  RouteExecutionStatus.Pending
              }
              return updatedState
            })
          }
        },
        restartRoute: (routeId: string) => {
          if (get().routes[routeId]) {
            set((state: RouteExecutionState) => ({
              routes: {
                ...state.routes,
                [routeId]: {
                  ...state.routes[routeId]!,
                  status: RouteExecutionStatus.Pending,
                },
              },
            }))
          }
        },
        deleteRoute: (routeId: string) => {
          if (get().routes[routeId]) {
            set((state: RouteExecutionState) => {
              const routes = { ...state.routes }
              delete routes[routeId]
              return {
                routes,
              }
            })
          }
        },
        deleteRoutes: (type) => set((state: RouteExecutionState) => {
          const routes = { ...state.routes }
          Object.keys(routes)
            .filter((routeId) => type === 'completed'
              ? hasEnumFlag(
                routes[routeId]?.status ?? 0,
                RouteExecutionStatus.Done
              )
              : !hasEnumFlag(
                routes[routeId]?.status ?? 0,
                RouteExecutionStatus.Done
              )
            )
            .forEach((routeId) => delete routes[routeId])
          return {
            routes,
          }
        }),
      }),
      {
        name: `${namePrefix || 'mock'}-widget-routes`,
        version: 2,
        partialize: (state) => ({ routes: state.routes }),
        merge: (persistedState: any, currentState: RouteExecutionState) => {
          const state = {
            ...currentState,
            ...persistedState,
          } as RouteExecutionState
          try {
            const currentTime = new Date().getTime()
            const oneDay = 1000 * 60 * 60 * 24
            Object.values(state.routes).forEach((routeExecution) => {
              const startedAt = routeExecution?.route.steps
                ?.find((step) => step.execution?.status === 'FAILED')
                ?.execution?.process.find((process) => process.startedAt)
                ?.startedAt ?? 0
              const outdated = startedAt > 0 && currentTime - startedAt > oneDay
              if (routeExecution?.route && outdated) {
                delete state.routes[routeExecution.route.id]
              }
            })
          } catch (error) {
            console.error(error)
          }
          return state
        },
      }
    ) as unknown as StateCreator<RouteExecutionState, [], [], RouteExecutionState>,
    Object.is
  )
