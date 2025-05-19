import { Injectable } from '@angular/core';
// import { BaseService } from "src/core/services/base.service";
import { PrismService } from "src/prism_core/services/prism.service";
import { HelperMethods } from "src/core/helper/helper.methods";
import { from, map, of } from 'rxjs';
import { DtoResult } from 'src/core/entities/dto-result';
import { AsyncApiCallHelperService } from "src/core/services/async-api-call-helper.service";

@Injectable({
  providedIn: 'root'
})
export class UserService extends PrismService<any> {

  // constructor() { super('login'); BaseService.ClearToken(); }
  constructor(
    private apiHelperService: AsyncApiCallHelperService,
  ) { super('auth'); UserService.ClearToken(); }

  // async EncodeBase64(text: string) {
  //   return Buffer.from(text).toString('base64');
  // }

  // async DecodeBase64(encodedText: string) {
  //   return Buffer.from(encodedText, 'base64').toString('binary');
  // }
  
  public async Login(username: string, password: string) {
    //console.log('user service login method called')
    //console.log('user login: ', username)
    //console.log('user password: ', password)
    const headerDict = {
      'x-api-target' : 'admin'
    }

    const loginEntity = {
      UserName: HelperMethods.EncodeBase64(username),
      Password: HelperMethods.EncodeBase64(password),
    }

    // const result = await this.put('', loginEntity);

    // //const resultPrimary = from(this.put('', loginEntity));
    // // .then(response => {
    // //     return response;
    // //   });
    // // resultPrimary.pipe(map(result => {
    // //   if (result.IsSuccessful) {
    // //     const user = result.Data;
    // //     console.log("user login success with token: \n", user.token);
    // //     // BaseService.UpdateToken(user.token);
    // //     UserService.UpdateToken(user.token);
    // //   }
    // // }))
    // // return resultPrimary;

    // if (result.IsSuccessful) {
    //   console.log("user login success with token: \n", result.Data.token);
    //   // BaseService.UpdateToken(user.token);
    //   UserService.UpdateToken(result.Data.token);
    // }
    // console.log("user login errors: \n", result.Errors);

    // return result;
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.post('login', loginEntity,null,headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
            UserService.UpdateToken(result.Data.payload.token);
          }
        }
        resolve(result)
      })
    });
  }

  async signOut(){
    UserService.ClearToken();
  }
}
