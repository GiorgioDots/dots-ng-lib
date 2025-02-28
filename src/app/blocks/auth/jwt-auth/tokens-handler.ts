/**
 * Abstract class for handling authentication tokens.
 *
 * This class provides methods to store, retrieve, and clear authentication tokens
 * from the browser's localStorage. It also extracts token data using an abstract method
 * that must be implemented by subclasses.
 *
 * @template TData - The type of the extracted token data.
 */
export abstract class TokensHandler<TData> {
  /** Key used to store the access token in localStorage. */
  protected tokenKey = 'a_tkn'

  /** Key used to store the refresh token in localStorage. */
  protected refreshTokenKey = 'a_rfsh'

  /** Stores extracted token data. */
  private tokenData?: TData

  /**
   * Constructor to initialize the token keys and load stored tokens.
   *
   * @param tokenKey - The key used to store the access token.
   * @param refreshTokenKey - The key used to store the refresh token.
   */
  constructor(tokenKey: string, refreshTokenKey: string) {
    this.tokenKey = tokenKey
    this.refreshTokenKey = refreshTokenKey
    this.loadTokens()
  }

  /**
   * Stores the access token and refresh token in localStorage and extracts token data.
   *
   * @param token - The access token.
   * @param refreshToken - The refresh token.
   */
  public setTokens(token: string, refreshToken: string) {
    localStorage.setItem(this.tokenKey, token)
    localStorage.setItem(this.refreshTokenKey, refreshToken)
    this.tokenData = this.extractTokenData(token)
  }

  /**
   * Clears the stored tokens from localStorage and resets token data.
   */
  public clearTokens() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    this.tokenData = undefined
  }

  /**
   * Retrieves the extracted token data.
   *
   * @returns The extracted token data or `undefined` if no token is set.
   */
  public getTokenData(): TData | undefined {
    return this.tokenData
  }

  /**
   * Retrieves the stored access token.
   *
   * @returns The access token or `null` if not found.
   */
  public getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  /**
   * Retrieves the stored refresh token.
   *
   * @returns The refresh token or `null` if not found.
   */
  public getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey)
  }

  /**
   * Loads tokens from localStorage and extracts token data if tokens exist.
   */
  private loadTokens() {
    const token = localStorage.getItem(this.tokenKey)
    const refreshToken = localStorage.getItem(this.refreshTokenKey)
    if (token && refreshToken) {
      this.setTokens(token, refreshToken)
    }
  }

  /**
   * Abstract method to extract data from a given token.
   *
   * @param token - The access token.
   * @returns Extracted token data.
   */
  protected abstract extractTokenData(token: string): TData
}
