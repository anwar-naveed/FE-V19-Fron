import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  inject,
  AfterViewChecked,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { DynamicEditDialogComponent } from '../../dialog/dynamic-edit-dialog/dynamic-edit-dialog.component';
import { UserService } from 'src/app/shared/services/app-services/user.service';
import { PrismController } from 'src/prism_core/controller/prism.controller';
import { HelperMethods } from 'src/core/helper/helper.methods';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';
import { RoleService } from 'src/app/shared/services/app-services/role.service';
import { AssignRoleDialogComponent } from '../../dialog/assign-role-dialog/assign-role-dialog.component';
import { RoleNamesPipe } from 'src/app/shared/pipes/role-names.pipe';

@Component({
  selector: 'app-dynamic-table',
  imports: [CommonModule, MaterialModule, RoleNamesPipe],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent extends PrismController<any> implements OnChanges, AfterViewInit, AfterViewChecked {
  @Input() data: any[] = [];

  path = '';
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumnsWithActions: string[] = [];
  filterValue = '';
  private paginatorAssigned = false;
  private sortAssigned = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private userService = inject(UserService);
  private roleService = inject(RoleService);
  /**
   *
   */
  constructor() {
    super();
    this.activatedRoute.url.subscribe(segments => {
      this.path = segments.map(s => s.path).join('/')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && Array.isArray(this.data) && this.data.length > 0) {
      this.displayedColumns = Object.keys(this.data[0]);
      this.displayedColumns = HelperMethods.RemoveValueFromArray(this.displayedColumns, "id");
      this.displayedColumnsWithActions = [...this.displayedColumns, 'actions'];
      this.dataSource.data = this.data;
      this.dataSource.filterPredicate = (data, filter: string) => {
        return this.displayedColumns.some((col) =>
          String(data[col]).toLowerCase().includes(filter.trim().toLowerCase())
        );
      };
    }
  }

  ngAfterViewInit(): void {
  this.tryAttachPaginatorAndSort();
  }

  ngAfterViewChecked() {
    this.tryAttachPaginatorAndSort();
  }

  private tryAttachPaginatorAndSort() {
    if (!this.paginatorAssigned && this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginatorAssigned = true;
    }

    if (!this.sortAssigned && this.sort) {
      this.dataSource.sort = this.sort;
      this.sortAssigned = true;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editRow(row: any) {

    if (this.path.includes('user')) {
      row.password = "";
      row.IsActive = true;
    } else if (this.path.includes('role')) {
      row.IsActive = true;
    };

    const dialogRef = this.dialog.open(DynamicEditDialogComponent, {
      width: '400px',
      data: { ...row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.path.includes('user')) {
          this.userService.updateUser(result).then(x => {
            this.ShowInfo(x.Data.message);
            this.refreshData();
          })
        } else if (this.path.includes('role')) {
          this.roleService.updateRole(result).then(x => {
            this.ShowInfo(x.Data.message);
            this.refreshData();
          })
        }
      }
    });
  }

  deleteRow(row: any) {
    const msg = `Are you sure you want to delete this record?`;
    this.dialog.open(ConfirmComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      // position: { top: "10px" },
      data: {
        message: msg
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        if (this.path.includes('user')) {
          this.userService.deleteUser(row.id).then(x => {
            this.ShowInfo(x.Data.message);
            this.refreshData()
          });
        } else if (this.path.includes('role')) {
          this.roleService.deleteRole(row.id).then(x => {
            this.ShowInfo(x.Data.message);
            this.refreshData()
          });
        }
      }
    });
  }

  assignRoleToUser(user: any) {
    this.roleService.getAllRoles().then((rolesResponse) => {
      const allRoles = rolesResponse.Data.payload;
      const userRoles = user.roles || [];

      const dialogRef = this.dialog.open(AssignRoleDialogComponent, {
        width: '400px',
        data: {
          username: user.username || user.name || 'User',
          allRoles,
          userRoles
        }
      });

      dialogRef.afterClosed().subscribe((selectedRoles) => {
        if (selectedRoles) {
          const roleIds = selectedRoles.map((role: any) => role.id);
          roleIds.forEach((roleId: bigint) => {
            this.userService.assignRolesToUser(user.id, roleId).then((res) => {
              this.ShowInfo(res.Data.message);
              this.refreshData();
            });
          });
        }
      });
    });
  }



  async refreshData() {
    if (this.path.includes('user')) {
      this.data = (await this.userService.getAllUsers()).Data.payload;
    } else if (this.path.includes('role')) {
      this.data = (await this.roleService.getAllRoles()).Data.payload;
    }

    this.ngOnChanges({ data: { currentValue: this.data, previousValue: [], firstChange: false, isFirstChange: () => false } });
  }
}
