import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  inject,
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

@Component({
  selector: 'app-dynamic-table',
  imports: [CommonModule, MaterialModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent extends PrismController<any> implements OnChanges, AfterViewInit {
  @Input() data: any[] = [];

  path = '';
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumnsWithActions: string[] = [];
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

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
    if (changes['data'] && this.data.length > 0) {
      this.displayedColumns = Object.keys(this.data[0]);
      this.displayedColumns = HelperMethods.RemoveValueFromArray(this.displayedColumns, "id");
      this.displayedColumnsWithActions = [...this.displayedColumns, 'actions'];
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.filterPredicate = (data, filter: string) => {
        return this.displayedColumns.some((col) =>
          String(data[col]).toLowerCase().includes(filter.trim().toLowerCase())
        );
      };
      this.attachPaginatorAndSort();
    }
  }

  ngAfterViewInit(): void {
    this.attachPaginatorAndSort();
  }

  private attachPaginatorAndSort() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
      if (result) { //here check condition to use service based on input data
        if (this.path.includes('user')) {
          this.userService.updateUser(result).then(x => {
            this.refreshData();
          })
        } else if(this.path.includes('role')) {
          this.roleService.updateRole(result).then(x => {
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
          this.refreshData()});
        } else if(this.path.includes('role')) {
          this.roleService.deleteRole(row.id).then(x => {
            this.refreshData()});
        }
      }
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
