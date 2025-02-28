export function generateCodeVerifier() {
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function generateState() {
  const array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '') // Base64-URL encoding
}

export function getDotsAuthLoginUrl(
  authUrl: string,
  clientId: string,
  redirectUri: string,
  codeChallenge: string,
  state: string,
) {
  return `${authUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&state=${state}`
}
