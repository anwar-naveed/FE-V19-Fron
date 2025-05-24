import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialIcon, MaterialModule } from 'src/app/material.module';
import { CreateRole, RoleArray } from 'src/app/shared/component-items/models/role';
import { DynamicEditDialogComponent } from 'src/app/shared/components/material-components/dialog/dynamic-edit-dialog/dynamic-edit-dialog.component';
import { DynamicTableComponent } from 'src/app/shared/components/material-components/table/dynamic-table/dynamic-table.component';
import { RoleService } from 'src/app/shared/services/app-services/role.service';
import { PrismController } from 'src/prism_core/controller/prism.controller';

@Component({
  selector: 'app-role',
  imports: [DynamicTableComponent, MaterialModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent extends PrismController<any> implements OnInit {
  @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;
  protected maticon: any = MaterialIcon;
  private role: CreateRole = {
    name: ''
  };
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
    const dialogRef = this.dialog.open(DynamicEditDialogComponent, {
      width: '400px',
      data: { ...this.role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.createRole(result).then(x => {
          this.dynamicTable.refreshData();
        })
      }
    });
  }
}
