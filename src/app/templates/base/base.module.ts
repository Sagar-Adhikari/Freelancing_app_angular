import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminModule } from '../../admin/admin.module';
import { BaseRoutingModule } from './base-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { declaration } from './../../../data/declaration';
import { entrycomponent } from './../../../data/entrycomponent';
import { bootstraps } from './../../../data/bootstraps';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { constant } from '../../../data/constant';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';

import { 
  MatIconModule,
  MatSidenavModule,
  MatDialogModule,
  MatFormFieldModule,
  MatMenuModule,
  MatInputModule,
  MatButtonModule,
  MatTabsModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatListModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatDatepickerModule,

  MatNativeDateModule} from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-img-cropper';
import { ClipboardModule } from 'ngx-clipboard';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider} from 'angularx-social-login';
import { OrderModule } from 'ngx-order-pipe';
import { HotkeyModule } from 'angular2-hotkeys';
import { SharedModule } from '../../shared/shared.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { TextMaskModule } from 'angular2-text-mask';
import 'hammerjs';
import { NgxPayPalModule } from 'ngx-paypal';
import { ToastrModule } from 'ng6-toastr-notifications';
import { SnackbarMsgComponent } from './snackbar-msg/snackbar-msg.component';
import { UserService } from './../../services/sync/user.service';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(constant.googleproviderkey)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(constant.facebookproviderkey)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: declaration.main,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BaseRoutingModule,
    MatIconModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatDialogModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTooltipModule,
    FileUploadModule,
    InfiniteScrollModule,
    AdminModule,
    LazyLoadImageModule,
    NgbModule.forRoot(),
    NgSelectModule,
    ImageCropperModule,
    ClipboardModule,
    SocialLoginModule,
    OrderModule,
    SharedModule,
    HotkeyModule.forRoot(),
    ClickOutsideModule,
    TextMaskModule,
    NgxPayPalModule,
    ToastrModule.forRoot(),
    TimepickerModule.forRoot(),
    // NgxDaterangepickerMd.forRoot({})
    NgxDaterangepickerMd
  ], providers: [UserService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  entryComponents: entrycomponent.main,
  exports: [ SnackbarMsgComponent ]

})
export class BaseModule { }
