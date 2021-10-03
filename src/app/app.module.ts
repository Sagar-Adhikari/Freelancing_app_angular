import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import {HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './route/app-routing.module';
import { AppComponent } from './app.component';
import { AdminGuard } from './auth/admin.guard';
import { ApiService } from './services/api/api.service';
import { WebsocketService } from './services/ws/websocket.service';
import { ChatService } from './services/chat/chat.service';
import { FileUploadService } from './services/file-upload/file-upload.service';
import { UserService } from './services/sync/user.service';
import { AuthService } from './services/auth/auth.service';
import { RoleGuardService } from './auth/role-guard.service';
import { UserGuard } from './auth/user.guard';
import { DeactivateGuardService } from './auth/deactivate-guard.service';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpClientModule } from '@ngx-progressbar/http-client';
import { ErrorService } from './error.service';
import { HttpErrorInterceptor } from './services/api/apphttpinterceptor.service';

import {
  MatIconModule,
  MatSidenavModule,
  MatDialogModule,
  MatFormFieldModule,
  MatMenuModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
   
  MatToolbarModule, MatCardModule,
  MatTabsModule,
  MatTableModule,
  MatSortModule,
  MatListModule} from '@angular/material';
  import {MatGridListModule} from '@angular/material/grid-list';
import { FileUploadModule } from 'ng2-file-upload';
import {RouterModule} from '@angular/router';
// fontawesome
import { AngularFontAwesomeModule } from 'angular-font-awesome';

export function tokenGetter() {
  return localStorage.getItem('workplus_token');
}

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatGridListModule,
    MatTabsModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    
    NgProgressModule.forRoot(),
    NgProgressHttpClientModule,
    FileUploadModule,
    AngularFontAwesomeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [''],
        headerName: 'WorkPlus',
        throwNoTokenError: false
      }
    })
  ],
  declarations: [AppComponent],
  bootstrap: [
    AppComponent
  ],
  providers: [
    AdminGuard,
    Title,
    Meta,
    ApiService,
    UserService,
    AuthService,
    UserGuard,
    DeactivateGuardService,
    RoleGuardService,
    WebsocketService,
    ChatService,
    FileUploadService,
    DeactivateGuardService,
    {
      provide: ErrorHandler,
      useClass: ErrorService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
