import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleNames'
})
export class RoleNamesPipe implements PipeTransform {

  transform(roles: any[], ...args: unknown[]): string  {
    return Array.isArray(roles) ? roles.map(r => r.name).join(', ') : '';
  }

}
