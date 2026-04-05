import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { firebaseConfig } from '../enviroments/enviroment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // ✅ ONLY initialize ONCE
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    // ✅ These automatically use the SAME app
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};