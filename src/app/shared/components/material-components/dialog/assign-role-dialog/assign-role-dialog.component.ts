import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from "src/app/material.module";

@Component({
  selector: 'app-assign-role-dialog',
  standalone: true,
  imports: [NgFor, NgIf, MaterialModule],
  templateUrl: './assign-role-dialog.component.html',
  styleUrl: './assign-role-dialog.component.scss'
})
export class AssignRoleDialogComponent {
  allRoles: any[] = [];
  userRoles: any[] = [];
  availableRoles: any[] = [];
  selectedRoles: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AssignRoleDialogComponent>
  ) {
    this.allRoles = data.allRoles || [];
    this.userRoles = Array.isArray(data.userRoles) ? data.userRoles : [];

    // Convert role IDs to string for matching
    const assignedRoleIds = new Set(this.userRoles.map(role => String(role.id)));

    this.availableRoles = this.allRoles.filter(role => {
      return !assignedRoleIds.has(String(role.id));
    });

  }

  toggleRole(role: any) {
    const index = this.selectedRoles.findIndex(r => r.id === role.id);
    if (index >= 0) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
  }

  isSelected(role: any): boolean {
    return this.selectedRoles.some(r => r.id === role.id);
  }

  assign() {
    this.dialogRef.close(this.selectedRoles);
  }

  cancel() {
    this.dialogRef.close();
  }
}
