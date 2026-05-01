// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { App } from './app';
import { Home } from './features/home/home';
import { Register } from './features/auth/register/register';
import { Userlist } from './features/users/userlist/userlist';
import { Login } from './features/auth/login/login';
import { Companies } from './features/companies/companies';
import { ChooseRole } from './features/choose-role/choose-role';
import { StudentProfileCompletion } from './features/student/student-profile-completion/student-profile-completion';
import { CompanyProfileCompletion } from './features/company/company-profile-completion/company-profile-completion';
import { CompanyDashboard } from './features/company/company-dashboard/company-dashboard';
import { StudentDasboard } from './features/student/student-dasboard/student-dasboard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Role } from './shared/models/enums/role';
import { chooseRoleGuard } from './core/guards/chose-role-guard';
import { loginGuard } from './core/guards/login-guard';
import { JobList } from './features/jobs/job-list/job-list';
import { JobDetail } from './features/jobs/job-detail/job-detail';
import { CompanyDetail } from './features/companies/company-detail/company-detail';

export const routes: Routes = [
  {
    path: '',
    component: App,  // navbar lives here
    children: [
      {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
      },
      {
        path: 'home',
        component: Home,
        title: 'Home'
        
      },
      {
       path: 'register',
       component: Register,
       title: 'Register'
      },
      {
       path: 'login',
       //canActivate: [loginGuard],
       component: Login,
       title: 'Login'
      },
      {
        path: 'companies',
        component: Companies,
        title:'Companies'

      },
      {
        path: 'choose-role',
        canActivate: [chooseRoleGuard],
        component:ChooseRole,
        title: 'Choose Role'
      },

      {
        path: 'student',
        canActivate: [authGuard, roleGuard],
        data: { role: Role.STUDENT },
        children: [
      

       {
        path: 'student-dashboard',
        component: StudentDasboard,
        title: 'Student Dashboard'
      },

      {
        path: 'complete-profile',
        component: StudentProfileCompletion,
        title: 'Complete Student Profile'
      }
    ]
      },
      {
        path:'company',
        canActivate: [authGuard, roleGuard],
        data: {role: Role.COMPANY},
        children: [
      {
        path: 'company/complete-profile',
        component: CompanyProfileCompletion,
        title: 'Complete Company Profile'
      },
      {
        path: 'company/company-dashboard',
        component: CompanyDashboard,
        title: 'Company Dashboard'
      }
       ]
      },
      {
        path: 'jobs',
        component: JobList,
        title: 'Jobs'

      },
      {
        path: 'jobs/:id',
        component: JobDetail,
        title: 'Job Detail'

      },
      {
        path: 'companies/:id',
        component: CompanyDetail,
        title: 'Company Detail'

      },


      {
        path: 'users',
        component: Userlist,
        title: 'User List'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];