import { Routes } from '@angular/router';
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AuthGuard } from "src/core/helper/auth.gaurd";
import { HomeComponent } from './home/home.component';

export const ComponentsRoutes: Routes = [
  { path: 'main', component: HomeComponent, canActivate: [AuthGuard] },
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent) 
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'index', redirectTo: '/main' },
  { path: 'index.html', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
