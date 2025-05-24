import { Injectable } from '@angular/core';
import { DtoResult } from 'src/core/entities/dto-result';
import { PrismService } from 'src/prism_core/services/prism.service';
import { CreateRole, RoleArray, UpdateRole } from '../../component-items/models/role';
import { ApiActionMethodNames } from '../../back-end/api';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends PrismService<any> {
  headerDict = {
    'x-api-target' : 'admin'
  }
  public allRoles: RoleArray
  constructor() { super('role'); }

  async getAllRoles(){
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.get(ApiActionMethodNames.GETALLROLES, null, this.headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
            this.allRoles = result.Data.payload.map(item => ({
              id: BigInt(item.id),  // convert number to bigint
              name: item.name,
            }));
          }
        }
        resolve(result)
      })
    });
  }

  async createRole(role: CreateRole){
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.post(ApiActionMethodNames.ROLECREATE, role, null, this.headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
          }
        }
        resolve(result)
      })
    });
  }

  async updateRole(role: UpdateRole){
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.put(ApiActionMethodNames.ROLEUPDATE, role, null, this.headerDict))
      .subscribe(result => {
        if (result.IsSuccessful) {
          if (result.Data.status){
          }
        }
        resolve(result)
      })
    });
  }

  async deleteRole(id: bigint){
    return new Promise<DtoResult<any>>((resolve) => {
      this.apiHelperService.doTask(this.del(ApiActionMethodNames.ROLEDELETE, null, [{name: "id", value: id.toString()}], this.headerDict))
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
