import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialIcon, MaterialModule } from 'src/app/material.module';
import { CreateUser, User } from 'src/app/shared/component-items/models/user';
import { DynamicEditDialogComponent } from 'src/app/shared/components/material-components/dialog/dynamic-edit-dialog/dynamic-edit-dialog.component';
import { DynamicTableComponent } from 'src/app/shared/components/material-components/table/dynamic-table/dynamic-table.component';
import { UserService } from 'src/app/shared/services/app-services/user.service';
import { PrismController } from 'src/prism_core/controller/prism.controller';

@Component({
  selector: 'app-user',
  imports: [DynamicTableComponent, MaterialModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent extends PrismController<any> implements OnInit {
  @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;
  
  protected maticon: any = MaterialIcon;
  private user: CreateUser = {
    name: '',
    username: '',
    password: '',
    roleId: BigInt(0)
  };
  /**
   *
   */
  constructor(private userService: UserService) {
    super();
    
  }

  async ngOnInit(): Promise<void> {
    await this.userService.getAllUsers();
  }

  public getAllUsers(): User[] {
    return this.userService.allUsers;
  }

  createUser() {
    const dialogRef = this.dialog.open(DynamicEditDialogComponent, {
      width: '400px',
      data: { ...this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createUser(result).then(x => {
          this.dynamicTable.refreshData();
        })
      }
    });
  }
}
