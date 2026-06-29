import { ErrorHandler, Injectable, Provider } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import posthog from 'posthog-js';

@Injectable({ providedIn: 'root' })
class PostHogErrorHandler implements ErrorHandler {
  public constructor() {}
  public handleError(error: unknown): void {
    const extractedError = this._extractError(error) || 'Unknown error';
    runOutsideAngular(() => posthog.captureException(extractedError));
  }
  protected _extractError(errorCandidate: unknown): unknown {
    const error = tryToUnwrapZonejsError(errorCandidate);
    if (error instanceof HttpErrorResponse) {
      return extractHttpModuleError(error);
    }
    if (typeof error === 'string' || isErrorOrErrorLikeObject(error)) {
      return error;
    }
    return null;
  }
}

function tryToUnwrapZonejsError(error: unknown): unknown | Error {
  return error && (error as { ngOriginalError: Error }).ngOriginalError
    ? (error as { ngOriginalError: Error }).ngOriginalError
    : error;
}

function extractHttpModuleError(error: HttpErrorResponse): string | Error {
  if (isErrorOrErrorLikeObject(error.error)) {
    return error.error;
  }
  if (
    typeof ErrorEvent !== 'undefined' &&
    error.error instanceof ErrorEvent &&
    error.error.message
  ) {
    return error.error.message;
  }
  if (typeof error.error === 'string') {
    return `Server returned code ${error.status} with body "${error.error}"`;
  }
  return error.message;
}

function isErrorOrErrorLikeObject(value: unknown): value is Error {
  if (value instanceof Error) {
    return true;
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return 'name' in value && 'message' in value && 'stack' in value;
}

declare const Zone: any;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const isNgZoneEnabled = typeof Zone !== 'undefined' && Zone.root?.run;
export function runOutsideAngular<T>(callback: () => T): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return isNgZoneEnabled ? Zone.root.run(callback) : callback();
}

export function providePostHogErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useValue: new PostHogErrorHandler(),
  };
}