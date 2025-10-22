import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export const AppSettings = {
  apiBaseUrl: 'http://localhost:8080/api',
  loginUrl: '/auth/login',
  usersUrl: '/users',
  adminUrl: '/admin',
  tokenStorageKey: 'token',
  defaultRole: 'USER',
  requestTimeout: 10000,
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([tokenInterceptor]))],
};
