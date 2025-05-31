import { Routes } from '@angular/router';
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AuthGuard } from "src/core/gaurds/auth.gaurd";
import { RoleGuard } from "src/core/gaurds/role.gaurd";
import { MainlayoutComponent } from "./layouts/mainlayout/mainlayout.component";
import { Role } from "src/core/helper/helper.methods";
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const ComponentsRoutes: Routes = [
  { path: 'main', 
    component: MainlayoutComponent, 
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
    {
      path: 'home',
      loadComponent: () => import('./sections/home/home.component').then(c => c.HomeComponent),
      data: { roles: [Role.USER] },
      canActivate: [RoleGuard]
    },
    {
      path: 'user',
      loadComponent: () => import('./sections/user/user.component').then(c => c.UserComponent),
      data: { roles: [Role.ADMIN, Role.SUPERADMIN] },
      canActivate: [RoleGuard]
    },
    {
      path: 'role',
      loadComponent: () => import('./sections/role/role.component').then(c => c.RoleComponent),
      data: { roles: [Role.ADMIN, Role.SUPERADMIN] },
      canActivate: [RoleGuard]
    }
  ]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent) 
  },
  { 
    path: 'unauthorized',
    loadComponent: () => import('./unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'system-error',
    loadComponent: () => import('./system-error/system-error.component').then(c => c.SystemErrorComponent), 
    canActivate: [AuthGuard] 
  },
  { path: '', redirectTo: 'main/home', pathMatch: 'full' },
  { path: 'index', redirectTo: 'main/home' },
  { path: 'index.html', redirectTo: 'main/home', pathMatch: 'full' },
  { 
    path: '**', 
    loadComponent: () => import('./page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent),  
    canActivate: [AuthGuard] },  // Wildcard route for a 404 page
];
