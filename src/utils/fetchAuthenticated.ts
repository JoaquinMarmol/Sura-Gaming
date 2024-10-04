const apiHost = import.meta.env.VITE_API_HOST
const waasApiHost = import.meta.env.VITE_WAAS_API_HOST
const verifyWalletEndpoint = 'http://localhost:5555/verifyWallet'

export const fetchAuthenticated = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  childWalletJwt?: string,
  useVerifyWalletEndpoint: boolean = false
): Promise<Response> => {
  const token = localStorage.getItem('jwt')
  if (!token) {
    console.error('no token in localstorage')
    throw new Error('No token found in local storage')
  }

  const headers = { ...(init?.headers ?? {}), Authorization: `Bearer ${childWalletJwt ?? token}` }

  let url: string
  if (useVerifyWalletEndpoint) {
    url = verifyWalletEndpoint
  } else {
    const host = childWalletJwt ? waasApiHost : apiHost
    url = host + input
  }

  return fetch(url, { ...init, headers })
}
