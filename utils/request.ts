export async function request<T, P extends Record<string, unknown> = Record<string, unknown>>(
  endpoint: string,
  method: 'GET' | 'POST',
  payload?: P,
  headers: Record<string, string> = {},
  base_url = 'https://api.mangadex.org'
): Promise<T> {
  const searchParams = new URLSearchParams()

  if (method === 'GET' && payload) {
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => searchParams.append(key, String(val)))
      } else {
        searchParams.append(key, String(value))
      }
    })
  }

  const url =
    method === 'GET' && searchParams.toString()
      ? `${base_url}/${endpoint}?${searchParams.toString()}`
      : `${base_url}/${endpoint}`

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
      ...headers
    },
    ...(method === 'POST' && payload ? { body: JSON.stringify(payload) } : {})
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Request failed: ${response.status} - ${errorBody}`)
  }

  return (await response.json()) as T
}
