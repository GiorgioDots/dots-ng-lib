import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class JwtAuthService {
  /**
   * Indicates whether a token refresh operation is in progress.
   * Used by `refreshTokenInterceptor`. Do not modify manually.
   */
  isRefreshing = false

  /**
   * Subject that holds the latest refreshed token value.
   * Used by `refreshTokenInterceptor`. Do not modify manually.
   */
  public refreshTokenSubject = new BehaviorSubject<string | undefined>(undefined)

  private config: JwtAuthServiceConfig | undefined

  public get refreshTokenFn() {
    return this.config?.refreshTokenFn
  }

  public get jwtTokenGetterFn() {
    return this.config?.jwtTokenGetterFn
  }

  public get refreshTokenFailedFn() {
    return this.config?.refreshTokenFailedFn
  }

  public initialize(config: JwtAuthServiceConfig) {
    this.config = config
  }
}

export interface JwtAuthServiceConfig {
  /**
   * This function should handle the actual token refresh logic and return a new JWT token as an Observable.
   */
  refreshTokenFn: () => Observable<string>

  /**
   * This function should return the active jwt bearer token as a string.
   */
  jwtTokenGetterFn: () => string
  /**
   * Callback function that gets triggered if the HTTP request executed
   * with the refreshed token fails. Can be used for error handling (e.g., logout, alert display).
   */
  refreshTokenFailedFn?: (err: any) => void
}
