import { Injectable } from '@angular/core';
import { DtoResult } from 'src/core/entities/dto-result';
import { AsyncApiCallHelperService } from 'src/core/services/async-api-call-helper.service';
import { PrismService } from 'src/prism_core/services/prism.service';
import { CreateUser, UpdateUser, UserArray, UserRole } from 'src/app/shared/component-items/models/user'
import { HelperMethods } from 'src/core/helper/helper.methods';
import { ApiActionMethodNames } from '../../back-end/api';

@Injectable({
  providedIn: 'root'
})
export class UserService extends PrismService<any> {
  headerDict = {
    'x-api-target' : 'admin'
  }

  public allUsers: UserArray
  constructor() { super('user'); }

  async getAllUsers(){
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.get(ApiActionMethodNames.GETALLUSERS, null, this.headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
            this.allUsers = result.Data.payload.map(item => ({
              id: BigInt(item.id),  // convert number to bigint
              name: HelperMethods.DecodeBase64(item.name),
              username: HelperMethods.DecodeBase64(item.username),
              roles: item.roles
            }));
          }
        }
        resolve(result)
      })
    });
  }

  async createUser(user: CreateUser){
    user.name = HelperMethods.EncodeBase64(user.name);
    user.username = HelperMethods.EncodeBase64(user.username);
    user.password = HelperMethods.EncodeBase64(user.password);
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.post(ApiActionMethodNames.USERCREATE, user, null, this.headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
          }
        }
        resolve(result)
      })
    });
  }

  async updateUser(user: UpdateUser){
    user.name = HelperMethods.EncodeBase64(user.name);
    user.username = HelperMethods.EncodeBase64(user.username);
    user.password = HelperMethods.EncodeBase64(user.password);
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.put(ApiActionMethodNames.USERUPDATE, user, null, this.headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
          }
        }
        resolve(result)
      })
    });
  }
  
  async deleteUser(id: bigint){
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.del(ApiActionMethodNames.USERDELETE, null, [{name: "id", value: id.toString()}], this.headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
          }
        }
        resolve(result)
      })
    });
  }

  async assignRolesToUser(userId: bigint, roleId: bigint){
    const userRole: UserRole = {
      userId: userId,
      roleId: roleId
    }
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.post(ApiActionMethodNames.ASIGNROLETOUSER, userRole, null, this.headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
          }
        }
        resolve(result)
      })
    });
  }
}
