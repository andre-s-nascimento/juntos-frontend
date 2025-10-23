import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

// Versão compatível que funciona com todos os navegadores
(async () => {
  try {
    await bootstrapApplication(AppComponent, appConfig);
    console.log('🚀 Application bootstrapped successfully');
  } catch (error) {
    console.error('💥 Critical error during application bootstrap:', error);
    throw error;
  }
})();
