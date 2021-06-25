import { FC } from 'react'

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  bio?: string
}

export enum ConnectionStatus {
  UNCONNECTED = 'unconnected',
  REQUESTED = 'requested',
  CONNECTED = 'connected',
}

export type PropsOf<TComponent extends FC> = Parameters<TComponent>[0]
