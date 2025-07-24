export function buildQueryParams(params: Record<string, any>) {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value)
    }
  })
  return queryParams.toString()
}
