// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { App } from './app';
import { Home } from './features/home/home';
import { Register } from './features/auth/register/register';
import { Userlist } from './features/users/userlist/userlist';
import { Login } from './features/auth/login/login';
import { Companies } from './features/companies/companies';

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
       component: Login,
       title: 'Login'
      },
      {
        path: 'companies',
        component: Companies,
        title:'Companies'

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