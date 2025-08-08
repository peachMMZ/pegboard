export function uuid() {
  return self.crypto.randomUUID()
}

export function timestamp() {
  return Date.now()
}
