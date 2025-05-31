import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialIcon, MaterialModule } from 'src/app/material.module';
import { RoleArray } from 'src/app/shared/component-items/models/role';
import { DynamicEditDialogComponent } from 'src/app/shared/components/material-components/dialog/dynamic-edit-dialog/dynamic-edit-dialog.component';
import { DynamicTableComponent } from 'src/app/shared/components/material-components/table/dynamic-table/dynamic-table.component';
import { RoleService } from 'src/app/shared/services/app-services/role.service';
import { HelperMethods } from 'src/core/helper/helper.methods';
import { PrismController } from 'src/prism_core/controller/prism.controller';
import { Role } from "src/core/helper/helper.methods";

@Component({
  selector: 'app-role',
  imports: [DynamicTableComponent, MaterialModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent extends PrismController<any> implements OnInit {
  @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;
  protected maticon: any = MaterialIcon;
  /**
   *
   */
  constructor(private roleService: RoleService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.roleService.getAllRoles();
  }

  public getAllRoles(): RoleArray {
    return this.roleService.allRoles;
  }

  createRole() {
    const existingRoles = this.getAllRoles().map(role => role.name.toLowerCase());
    // const allRoles = Object.values(Role);
    // const availableRoles = allRoles.filter(role => !existingRoles.includes(role));
    const availableRoles = HelperMethods.getUnusedEnumValues(Role, existingRoles);
    const dialogRef = this.dialog.open(DynamicEditDialogComponent, {
      width: '400px',
      data: {
        multiSelectEnum: true, // custom flag
        enumOptions: availableRoles, // only unused
        formKey: 'roleNames', // what form control name to use
        entityName: 'Role' //, 'Product', etc.
      }
    });

    dialogRef.afterClosed().subscribe(async result => {

      if (result?.roleNames?.length) {
        for (const roleName of result.roleNames) {
          await this.roleService.createRole({ name: HelperMethods.ToTitleCase(roleName) }).then(x => {
            this.ShowInfo(x.Data.message);
          });
        }
        this.dynamicTable.refreshData();
      }

    });
  }
}
