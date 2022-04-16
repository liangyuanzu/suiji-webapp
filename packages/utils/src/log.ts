export const warn = (message: string) => {
  console.warn(`[suiji warn]:${message}`)
}

export const error = (message: string): never => {
  throw new Error(`[suiji error]:${message}`)
}
