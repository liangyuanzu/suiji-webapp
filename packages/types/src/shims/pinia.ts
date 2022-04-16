// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PiniaPluginContext } from 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptions<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    S,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    G,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    A,
  > {
    /**
     * Persist store in storage.
     */
    persist?: PersistOptions
  }
}

export interface PersistStrategy {
  key?: string
  storage?: Storage
  paths?: string[]
}

export interface PersistOptions {
  strategies?: PersistStrategy[]
}
