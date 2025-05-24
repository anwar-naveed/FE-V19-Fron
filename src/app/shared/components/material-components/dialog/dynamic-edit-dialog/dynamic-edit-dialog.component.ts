import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { HelperMethods } from 'src/core/helper/helper.methods';
import { RoleArray } from "src/app/shared/component-items/models/role";
import { RoleService } from 'src/app/shared/services/app-services/role.service';

@Component({
  selector: 'app-dynamic-edit-dialog',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './dynamic-edit-dialog.component.html',
  styleUrl: './dynamic-edit-dialog.component.scss'
})
export class DynamicEditDialogComponent implements OnInit {
  form!: FormGroup;
  keys: string[] = [];
  roles: RoleArray = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DynamicEditDialogComponent>,
    private fb: FormBuilder,
    private roleService: RoleService
  ) {}

  async ngOnInit() {
    this.keys = Object.keys(this.data);

    const controls = this.keys.reduce((acc, key) => {
      acc[key] = [this.data[key] || '', key === 'roleId' ? Validators.required : []];
      return acc;
    }, {} as any);

    this.form = this.fb.group(controls);

    if (this.keys.includes('roleId')) {
      const roleResponse = await this.roleService.getAllRoles();
      if (roleResponse?.IsSuccessful) {
        this.roles = this.roleService.allRoles || [];
      }
    }
  }

  isBoolean(key: string): boolean {
    return HelperMethods.isBoolean(key);
  }

  isPasswordField(key: string): boolean {
    return key.toLowerCase().includes('password');
  }

  onSave(): void {
    if (this.form.valid) {
      const result = {
        ...this.form.value,
        roleId: this.form.value.roleId ? BigInt(this.form.value.roleId) : null
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}