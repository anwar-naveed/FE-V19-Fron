import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { LocalStorage } from '../helper/local.storage';
import { AuthService } from "../services/auth.service";
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate{
  /**
   *
   */
  constructor(
    private router: Router, 
    private localStorage: LocalStorage,
    private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const requiredRoles = route.data['roles'] as Array<string>;
    if (!requiredRoles) return true; // No specific roles required
    
    if (this.authService.checkRoles(requiredRoles)){
      return true;
    }
    else {
      this.router.navigate(['/unauthorized']); // Redirect to unauthorized page
      return false;
    }
  }

}