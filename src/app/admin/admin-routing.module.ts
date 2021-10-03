import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './users/client/client.component';
import { ViewClientComponent } from './users/client/view-client/view-client.component';
import { EditClientComponent } from './users/client/edit-client/edit-client.component';
import { FreelancerComponent } from './users/freelancer/freelancer.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { MessageComponent } from './chatroom/message/message.component';
import { ViewFreelancerComponent } from './users/freelancer/view-freelancer/view-freelancer.component';
import { EditFreelancerComponent } from './users/freelancer/edit-freelancer/edit-freelancer.component';
import { JobsComponent } from './jobs/jobs.component';
import { ViewJobComponent } from './jobs/view-job/view-job.component';
import { CategoryComponent } from './jobs/category/category.component';
import { AddCategoryComponent } from './jobs/category/add-category/add-category.component';
import { EditCategoryComponent } from './jobs/category/edit-category/edit-category.component';
import { SkillsComponent } from './jobs/skills/skills.component';
import { SubCategoryComponent } from './jobs/sub-category/sub-category.component';
import { AddSubCategoryComponent } from './jobs/sub-category/add-sub-category/add-sub-category.component';
import { EditSubCategoryComponent } from './jobs/sub-category/edit-sub-category/edit-sub-category.component';
import { MembershipsComponent } from './memberships/memberships.component';
import { AddMembershipComponent } from './memberships/add-membership/add-membership.component';
import { EditMembershipComponent } from './memberships/edit-membership/edit-membership.component';
import { TestCategoriesComponent } from './tests/test-categories/test-categories.component';
import { TestAddCategoriesComponent } from './tests/test-categories/test-add-categories/test-add-categories.component';
import { TestEditCategoriesComponent } from './tests/test-categories/test-edit-categories/test-edit-categories.component';
import { TestGroupsComponent } from './tests/test-groups/test-groups.component';
import { TestAddGroupsComponent } from './tests/test-groups/test-add-groups/test-add-groups.component';
import { TestEditGroupsComponent } from './tests/test-groups/test-edit-groups/test-edit-groups.component';
import { TestQuestionsComponent } from './tests/test-questions/test-questions.component';
import { TestAddQuestionsComponent } from './tests/test-questions/test-add-questions/test-add-questions.component';
import { TestEditQuestionsComponent } from './tests/test-questions/test-edit-questions/test-edit-questions.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { AddTestimonialsComponent } from './testimonials/add-testimonials/add-testimonials.component';
import { EditTestimonialsComponent } from './testimonials/edit-testimonials/edit-testimonials.component';
import { CmsPagesComponent } from './cms-pages/cms-pages.component';
import { AddPageComponent } from './cms-pages/add-page/add-page.component';
import { EditPageComponent } from './cms-pages/edit-page/edit-page.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';
import { AddSecurityQuestionComponent } from './security-question/add-security-question/add-security-question.component';
import { EditSecurityQuestionComponent } from './security-question/edit-security-question/edit-security-question.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ViewContractComponent } from './contracts/view-contract/view-contract.component';
import { LanguagesComponent } from './languages/languages.component';
import { AddLanguageComponent } from './languages/add-language/add-language.component';
import { EditLanguageComponent } from './languages/edit-language/edit-language.component';
import { HomeSettingsComponent } from './home-settings/home-settings.component';
import { EditHomeSettingsComponent } from './home-settings/edit-home-settings/edit-home-settings.component';
import { SettingsComponent } from './settings/settings.component';
import { AddSkillsComponent } from './jobs/skills/add-skills/add-skills.component';
import { EditSkillsComponent } from './jobs/skills/edit-skills/edit-skills.component';
import { AdminGuard } from './../auth/admin.guard';

import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { ManagejobsComponent } from './managejobs/managejobs.component';
import { AddjobsComponent } from './addjobs/addjobs.component';
import { ListProposalComponent } from './jobs/list-proposal/list-proposal.component';
import { DetailProposalComponent } from './jobs/detail-proposal/detail-proposal.component';
import { ProposalComponent } from './proposal/proposal.component'; 
import { SuggestedQuestionComponent } from './jobs/suggested-question/suggested-question.component'; 
import { AddSuggestedQuestionComponent } from './jobs/suggested-question/add-suggested-question/add-suggested-question.component'; 
import { EditSuggestedQuestionComponent } from './jobs/suggested-question/edit-suggested-question/edit-suggested-question.component'; 
import { AdminTransactionsComponent } from './admin-transactions/admin-transactions.component';
import { AdminConnectsComponent } from './admin-connects/admin-connects.component';
import { DisputesComponent } from './disputes/disputes.component';
import { DisputesEditComponent } from './disputes/disputes-edit/disputes-edit.component';
import { DisputesViewComponent } from './disputes/disputes-view/disputes-view.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: DashboardComponent }
    ],
    data: {
            title: 'Dashboard'
    }
  }, {
    path: 'user-clients',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ClientComponent }
    ],
    data: {
            title: 'Clients Lists'
    }
  },{
    path: 'client/view/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ViewClientComponent }
    ],
    data: {
            title: 'View Client'
    }
  },{
    path: 'client/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditClientComponent }
    ],
    data: {
            title: 'Edit Client'
    }
  }, {
    path: 'user-freelancers',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: FreelancerComponent }
    ],
    data: {
            title: 'Freelancers Lists'
    }
  },{
    path: 'freelancer/view/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [ 
      { path: '', component: ViewFreelancerComponent }
    ],
    data: {
            title: 'View Freelancer' 
    }
  }, {
    path: 'freelancer/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [ 
      { path: '', component: EditFreelancerComponent }
    ],
    data: {
            title: 'Edit Freelancer' 
    }
  }, {
    path: 'jobs/categorys',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: CategoryComponent }
    ],
    data: {
            title: 'Category Lists'
    }
  }, {
    path: 'user/withdraws',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: WithdrawComponent }
    ],
    data: {
            title: 'Withdraw Lists'
    }
  },{
    path: 'chat/room',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ChatroomComponent }
    ],
    data: {
            title: 'Chat Room Lists'
    }
  },{
    path: 'chat/message/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: MessageComponent }
    ],
    data: {
            title: 'Message Lists'
    }
  }, {
    path: 'jobs/add-category',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddCategoryComponent }
    ],
    data: {
            title: 'Add Category'
    }
  }, {
    path: 'jobs/edit-category/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditCategoryComponent }
    ],
    data: {
            title: 'Edit Category'
    }
  }, {
    path: 'jobs/sub-categorys',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: SubCategoryComponent }
    ],
    data: {
            title: 'Subcategory Lists'
    }
  }, {
    path: 'jobs/add-sub-category',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddSubCategoryComponent }
    ],
    data: {
            title: 'Add Subcategory'
    }
  }, {
    path: 'jobs/edit-sub-category/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditSubCategoryComponent }
    ],
    data: {
            title: 'Edit Subcategory'
    }
  }, {
    path: 'jobs',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: JobsComponent }
    ],
    data: {
            title: 'Edit Subcategory'
    }
  },{
    path: 'jobs/view/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ViewJobComponent }
    ],
    data: {
            title: 'View Job'
    }
  },{
    path: 'proposals',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ProposalComponent }
    ],
    data: {
            title: 'Job Proposals'
    }
  },   
  {
    path: 'proposal-list/:job',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ListProposalComponent }
    ],
    data: {
            title: 'Proposals'
    }
  },
  {
    path: 'proposal-detail/:proposalid',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: DetailProposalComponent }
    ],
    data: {
            title: 'Proposal Detail'
    }
  },
   {
    path: 'jobs/skills',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: SkillsComponent }
    ],
    data: {
            title: 'Job Skills'
    }
  }, {
    path: 'membership',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: MembershipsComponent }
    ],
    data: {
            title: 'Memberships'
    }
  }, {
    path: 'add-membership',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddMembershipComponent }
    ],
    data: {
            title: 'Add Membership'
    }
  }, {
    path: 'edit-membership/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditMembershipComponent }
    ],
    data: {
            title: 'Edit Membership'
    }
  }, {
    path: 'test-categories',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestCategoriesComponent }
    ],
    data: {
            title: 'Test Categories'
    }
  }, {
    path: 'add-test-category',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestAddCategoriesComponent }
    ],
    data: {
            title: 'Test Add Categories'
    }
  }, {
    path: 'edit-test-category/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestEditCategoriesComponent }
    ],
    data: {
            title: 'Test Edit Categories'
    }
  }, {
    path: 'test-groups',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestGroupsComponent }
    ],
    data: {
            title: 'Test Groups'
    }
  }, {
    path: 'add-test-group',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestAddGroupsComponent }
    ],
    data: {
            title: 'Test Add Groups'
    }
  }, {
    path: 'edit-test-group/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestEditGroupsComponent }
    ],
    data: {
            title: 'Test Edit Groups'
    }
  }, {
    path: 'test-questions',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestQuestionsComponent }
    ],
    data: {
            title: 'Test Questions'
    }
  }, {
    path: 'add-test-question',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestAddQuestionsComponent }
    ],
    data: {
            title: 'Test Add Questions'
    }
  }, {
    path: 'edit-test-question/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestEditQuestionsComponent }
    ],
    data: {
            title: 'Test Add Questions'
    }
  }, {
    path: 'testimonials',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: TestimonialsComponent }
    ],
    data: {
            title: 'Testimonials'
    }
  }, {
    path: 'add-testimonial',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddTestimonialsComponent }
    ],
    data: {
            title: 'Add Testimonials'
    }
  }, {
    path: 'edit-testimonial/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditTestimonialsComponent }
    ],
    data: {
            title: 'Edit Testimonials'
    }
  }, {
    path: 'pages',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: CmsPagesComponent }
    ],
    data: {
            title: 'CMS Pages'
    }
  }, {
    path: 'add-page',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddPageComponent }
    ],
    data: {
            title: 'Add CMS Page'
    }
  }, {
    path: 'edit-page/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditPageComponent }
    ],
    data: {
            title: 'Edit CMS Page'
    }
  }, {
    path: 'security-questions',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: SecurityQuestionComponent }
    ],
    data: {
            title: 'Security Questions'
    }
  }, {
    path: 'add-security-question',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddSecurityQuestionComponent }
    ],
    data: {
            title: 'Add Security Question'
    }
  }, {
    path: 'edit-security-question/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditSecurityQuestionComponent }
    ],
    data: {
            title: 'Edit Security Question'
    }
  }, {
    path: 'contracts',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ContractsComponent }
    ],
    data: {
            title: 'Contracts Listing'
    }
  }, {
    path: 'contract/view/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ViewContractComponent }
    ],
    data: {
            title: 'Contracts Listing'
    }
  }, {
    path: 'languages',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: LanguagesComponent }
    ],
    data: {
            title: 'Language Listing'
    }
  }, {
    path: 'add-language',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddLanguageComponent }
    ],
    data: {
            title: 'Add Language'
    }
  }, {
    path: 'edit-language/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditLanguageComponent }
    ],
    data: {
            title: 'Edit Language'
    }
  }, {
    path: 'home-settings',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: HomeSettingsComponent }
    ],
    data: {
            title: 'Home Page Text Update'
    }
  }, {
    path: 'edit-home-setting/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditHomeSettingsComponent }
    ],
    data: {
            title: 'Edit Home Page Text'
    }
  },  {
    path: 'settings',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: SettingsComponent }
    ],
    data: {
            title: 'Settings Page'
    }
  },{
    path: 'jobs/add-skill',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddSkillsComponent }
    ],
    data: {
            title: 'Add Skills'
    }
  }, {
    path: 'jobs/edit-skill/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditSkillsComponent }
    ],
    data: {
            title: 'Edit Skills'
    }
  }, {
    path: 'jobs/add-suggested-question',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddSuggestedQuestionComponent }
    ],
    data: {
            title: 'Add Suggested Question'
    }
  },{
    path: 'jobs/edit-suggested-question/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: EditSuggestedQuestionComponent }
    ],
    data: {
            title: 'Edit Suggested Question'
    }
  },{
    path: 'jobs/suggested/question',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: SuggestedQuestionComponent }
    ],
    data: {
            title: 'Jobs Suggested Questions'
    }
  },{
    path: 'managejobs',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: ManagejobsComponent }
    ],
    data: {
            title: 'Manage Jobs'
    }
  }, {
    path: 'addjobs',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AddjobsComponent }
    ],
    data: {
            title: 'Add Jobs'
    }
  }, {
    path: 'transactions',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AdminTransactionsComponent }
    ],
    data: {
            title: 'Admin Transactions'
    }
  }, {
    path: 'disputes',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: DisputesComponent }
    ],
    data: {
            title: 'Admin Transactions'
    }
  }, {
    path: 'disputes/edit/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: DisputesEditComponent }
    ],
    data: {
            title: 'Admin Transactions'
    }
  }, {
    path: 'disputes/view/:id',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: DisputesViewComponent }
    ],
    data: {
            title: 'Admin Transactions'
    }
  }, {
    path: 'mail_settings',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: MailSettingsComponent }
    ],
    data: {
            title: 'Admin Transactions'
    }
  },{
    path: 'connects',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', component: AdminConnectsComponent }
    ],
    data: {
            title: 'Admin Connects History'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
