import { FC } from 'react'
import moment from 'moment';

export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
  bio?: string
}

export enum ConnectionStatus {
  UNCONNECTED = 'unconnected',
  REQUESTED = 'requested',
  CONNECTED = 'connected',
}

export type Task = {
  id: string,
  title: string,
  description: string,
  deadline: moment.Moment,
  estimatedDays: number
};

export type PropsOf<TComponent extends FC> = Parameters<TComponent>[0]
