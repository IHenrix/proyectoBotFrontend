import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PrivateLayoutComponent,
    PublicLayoutComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-pulse-sync' }),
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.msal.clientId,
        authority: environment.msal.authority,
        redirectUri: environment.msal.redirectUri
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
      }
    }), {
      interactionType:  InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      interactionType:  InteractionType.Redirect,
      protectedResourceMap: new Map([['https://graph.microsoft.com/v1.0/me', ['user.read']]])
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
