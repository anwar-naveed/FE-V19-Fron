import { Injectable, OnDestroy } from '@angular/core';
import { PrismService } from "src/prism_core/services/prism.service";
import { HelperMethods } from "src/core/helper/helper.methods";
import { from, map, of } from 'rxjs';
import { DtoResult } from 'src/core/entities/dto-result';
import { LoginRequest } from "src/app/shared/component-items/models/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends PrismService<any> implements OnDestroy {
  loginRequest = {} as LoginRequest;
  constructor(
  ) { super('auth'); }
  
  ngOnDestroy(): void {
    this.loginRequest = null;
  }

  public async Login(username: string, password: string) {
    const headerDict = {
      'x-api-target' : 'admin'
    }
    
    this.loginRequest.username = HelperMethods.EncodeBase64(username);
    this.loginRequest.password = HelperMethods.EncodeBase64(password);

    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.post('login', this.loginRequest, null, headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
            AuthService.UpdateToken(result.Data.payload.token);
          }
        }
        resolve(result)
      })
    });
  }

  async signOut(){
    AuthService.ClearToken();
  }
}
