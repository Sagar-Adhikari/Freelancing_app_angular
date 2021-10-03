import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Daterangepicker } from 'ng2-daterangepicker';
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatIconModule,
  MatSidenavModule,
  MatDialogModule,
  MatFormFieldModule,
  MatMenuModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatGridListModule,
  MatExpansionModule,
  MatBadgeModule,
  MatListModule,
  MatNativeDateModule,
  MatSliderModule} from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { JobsComponent } from './jobs/jobs.component';
import { MembershipsComponent } from './memberships/memberships.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { CmsPagesComponent } from './cms-pages/cms-pages.component';

import { DeletionComponent } from './dialogs/deletion/deletion.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';
import { ContractsComponent } from './contracts/contracts.component';

import { ClientComponent } from './users/client/client.component';
import { ViewClientComponent } from './users/client/view-client/view-client.component';
import { FreelancerComponent } from './users/freelancer/freelancer.component';
import { ViewFreelancerComponent } from './users/freelancer/view-freelancer/view-freelancer.component';
import { CategoryComponent } from './jobs/category/category.component';
import { SkillsComponent } from './jobs/skills/skills.component';
import { AddCategoryComponent } from './jobs/category/add-category/add-category.component';
import { EditCategoryComponent } from './jobs/category/edit-category/edit-category.component';
import { SubCategoryComponent } from './jobs/sub-category/sub-category.component';
import { AddSubCategoryComponent } from './jobs/sub-category/add-sub-category/add-sub-category.component';
import { EditSubCategoryComponent } from './jobs/sub-category/edit-sub-category/edit-sub-category.component';
import { AddMembershipComponent } from './memberships/add-membership/add-membership.component';
import { EditMembershipComponent } from './memberships/edit-membership/edit-membership.component';
import { AddPageComponent } from './cms-pages/add-page/add-page.component';
import { EditPageComponent } from './cms-pages/edit-page/edit-page.component';
import { AddSecurityQuestionComponent } from './security-question/add-security-question/add-security-question.component';
import { EditSecurityQuestionComponent } from './security-question/edit-security-question/edit-security-question.component';
import { AddTestimonialsComponent } from './testimonials/add-testimonials/add-testimonials.component';
import { EditTestimonialsComponent } from './testimonials/edit-testimonials/edit-testimonials.component';
import { TestCategoriesComponent } from './tests/test-categories/test-categories.component';
import { TestAddCategoriesComponent } from './tests/test-categories/test-add-categories/test-add-categories.component';
import { TestEditCategoriesComponent } from './tests/test-categories/test-edit-categories/test-edit-categories.component';
import { TestGroupsComponent } from './tests/test-groups/test-groups.component';
import { TestAddGroupsComponent } from './tests/test-groups/test-add-groups/test-add-groups.component';
import { TestEditGroupsComponent } from './tests/test-groups/test-edit-groups/test-edit-groups.component';
import { TestQuestionsComponent } from './tests/test-questions/test-questions.component';
import { TestAddQuestionsComponent } from './tests/test-questions/test-add-questions/test-add-questions.component';
import { TestEditQuestionsComponent } from './tests/test-questions/test-edit-questions/test-edit-questions.component';
import { LanguagesComponent } from './languages/languages.component';
import { AddLanguageComponent } from './languages/add-language/add-language.component';
import { EditLanguageComponent } from './languages/edit-language/edit-language.component';
import { HomeSettingsComponent } from './home-settings/home-settings.component';
import { EditHomeSettingsComponent } from './home-settings/edit-home-settings/edit-home-settings.component';
import { AddSkillsComponent } from './jobs/skills/add-skills/add-skills.component';
import { EditSkillsComponent } from './jobs/skills/edit-skills/edit-skills.component';

import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { ManagejobsComponent } from './managejobs/managejobs.component';
import { AddjobsComponent } from './addjobs/addjobs.component';
import { NgSlimScrollModule } from '../ngx-slimscroll/module/ngx-slimscroll.module';
import { SLIMSCROLL_DEFAULTS } from '../../slimscroll_api';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ClipboardModule } from 'ngx-clipboard';
import { ViewJobComponent } from './jobs/view-job/view-job.component';
import { ViewpreviewComponent } from '../templates/base/jobdetail/viewpreview/viewpreview.component';
import { SharedModule } from '../shared/shared.module';
import { ListProposalComponent } from './jobs/list-proposal/list-proposal.component';
import { DetailProposalComponent } from './jobs/detail-proposal/detail-proposal.component';
import { SettingsComponent } from './settings/settings.component';
import { EditFreelancerComponent } from './users/freelancer/edit-freelancer/edit-freelancer.component'; 
import { EditClientComponent } from './users/client/edit-client/edit-client.component'; 
import { ProposalComponent } from './proposal/proposal.component'; 
import { SuggestedQuestionComponent } from './jobs/suggested-question/suggested-question.component';
import { AddSuggestedQuestionComponent } from './jobs/suggested-question/add-suggested-question/add-suggested-question.component';
import { EditSuggestedQuestionComponent } from './jobs/suggested-question/edit-suggested-question/edit-suggested-question.component'; 
import { NgxWeditorModule } from 'ngx-weditor';
import { QuillModule } from 'ngx-quill';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AdminTransactionsComponent } from './admin-transactions/admin-transactions.component';
import { AdminConnectsComponent } from './admin-connects/admin-connects.component';
import { ViewContractComponent } from './contracts/view-contract/view-contract.component';
import { DatePipe } from '@angular/common';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WithdrawSettlementComponent } from './withdraw/withdraw-settlement/withdraw-settlement.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { MessageComponent } from './chatroom/message/message.component';
import { FormatStringPipe } from './chatroom/message/stringFormatPipe';
import { BytesPipe } from './chatroom/message/bytes.pipe';
import { FormatFilePipe } from './chatroom/message/fileFormatPipe';
import { DisputesComponent } from './disputes/disputes.component';
import { DisputesViewComponent } from './disputes/disputes-view/disputes-view.component';
import { DisputesEditComponent } from './disputes/disputes-edit/disputes-edit.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';

@NgModule({
  imports: [
  InfiniteScrollModule,
  CommonModule,
  AdminRoutingModule,
  MatTableModule,
  MatPaginatorModule,
  MatTabsModule,
  MatSortModule,
  MatIconModule,
  MatSidenavModule,
  MatDialogModule,
  MatFormFieldModule,
  MatMenuModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatGridListModule,
  MatListModule,
  MatExpansionModule,
  MatBadgeModule,
  MatDatepickerModule,
  MatNativeDateModule,
  ClipboardModule,
  FormsModule,
  ReactiveFormsModule,
  FileUploadModule,
  NgSlimScrollModule,
  ChartsModule,
  SharedModule,
  NgxWeditorModule,
  QuillModule,
  TooltipModule.forRoot(),
  Daterangepicker,
  MatSliderModule,
  MatSlideToggleModule
  ],
  entryComponents: [ DeletionComponent,ViewpreviewComponent,WithdrawSettlementComponent],
  declarations: [
    AdminComponent,
    DashboardComponent,
    JobsComponent,
    MembershipsComponent,
    TestimonialsComponent,
    CmsPagesComponent,
    DeletionComponent,
    SecurityQuestionComponent,
    ContractsComponent,
    ClientComponent,
    ViewClientComponent,
    FreelancerComponent,
    ViewFreelancerComponent,
    CategoryComponent,
    SkillsComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    SubCategoryComponent,
    AddSubCategoryComponent,
    EditSubCategoryComponent,
    AddMembershipComponent,
    EditMembershipComponent,
    AddPageComponent,
    EditPageComponent,
    AddSecurityQuestionComponent,
    EditSecurityQuestionComponent,
    AddTestimonialsComponent,
    EditTestimonialsComponent,
    TestCategoriesComponent,
    TestAddCategoriesComponent,
    TestEditCategoriesComponent,
    TestGroupsComponent,
    TestAddGroupsComponent,
    TestEditGroupsComponent,
    TestQuestionsComponent,
    TestAddQuestionsComponent,
    TestEditQuestionsComponent,
    LanguagesComponent,
    AddLanguageComponent,
    EditLanguageComponent,
    HomeSettingsComponent,
    EditHomeSettingsComponent,
    AddSkillsComponent,
    EditSkillsComponent,
    SidemenuComponent,
    HeaderComponent,
    ManagejobsComponent,
    AddjobsComponent,
    ViewJobComponent,
    ViewpreviewComponent,
    ListProposalComponent,
    DetailProposalComponent,
    SettingsComponent,
    EditFreelancerComponent,
    EditClientComponent,
    ProposalComponent,
    SuggestedQuestionComponent,
    AddSuggestedQuestionComponent,
    EditSuggestedQuestionComponent,
    AdminTransactionsComponent,
    AdminConnectsComponent,
    ViewContractComponent,
    WithdrawComponent,
    WithdrawSettlementComponent,
    ChatroomComponent,
    MessageComponent,
    FormatStringPipe,
    BytesPipe,
    FormatFilePipe,
    DisputesComponent,
    DisputesViewComponent,
    DisputesEditComponent,
    MailSettingsComponent
  ],
  providers: [
    // OPTIONAL : provide default global settings which will be merge with component options.
    {
      provide: SLIMSCROLL_DEFAULTS,
      useValue: {
        alwaysVisible : true,
        gridOpacity: '0.2', barOpacity: '0.5',
        gridBackground: '#c2c2c2',
        gridWidth: '6',
        gridMargin: '2px 2px',
        barBackground: '#2C3E50',
        barWidth: '6',
        barMargin: '2px 2px'
      }
    },
    DatePipe
  ],
  bootstrap: [
    AdminComponent,
  ],
  exports: [
  ]
})
export class AdminModule { }
