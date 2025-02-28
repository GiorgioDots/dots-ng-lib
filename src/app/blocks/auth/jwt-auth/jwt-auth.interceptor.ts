import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, filter, Observable, switchMap, take, throwError } from 'rxjs'
import { JwtAuthService } from './jwt-auth.service'

export const jwtAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtAuthSvc = inject(JwtAuthService)
  const handle401Error = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<any>> => {
    if (jwtAuthSvc.isRefreshing) {
      // Waits other refresh token requests to end
      return jwtAuthSvc.refreshTokenSubject.pipe(
        filter((token) => token !== undefined),
        take(1),
        switchMap((token) => {
          return next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            }),
          )
        }),
      )
    }

    jwtAuthSvc.isRefreshing = true
    jwtAuthSvc.refreshTokenSubject.next(undefined)

    if (jwtAuthSvc.refreshTokenFn == undefined) {
      throw new Error('JwtAuthInterceptor: JwtAuthService.refreshTokenFn is undefined')
    }

    return jwtAuthSvc.refreshTokenFn().pipe(
      switchMap((newToken: string) => {
        jwtAuthSvc.isRefreshing = false
        jwtAuthSvc.refreshTokenSubject.next(newToken)
        return next(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          }),
        )
      }),
      catchError((err) => {
        jwtAuthSvc.isRefreshing = false
        jwtAuthSvc.refreshTokenFailedFn?.(err)
        return throwError(() => err)
      }),
    )
  }

  // Executing the original request
  if (jwtAuthSvc.jwtTokenGetterFn == undefined) {
    throw new Error('JwtAuthInterceptor: JwtAuthService.jwtTokenGetterFn is undefined')
  }
  const token = jwtAuthSvc.jwtTokenGetterFn()
  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  ).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next)
      }
      return throwError(() => error)
    }),
  )
}
