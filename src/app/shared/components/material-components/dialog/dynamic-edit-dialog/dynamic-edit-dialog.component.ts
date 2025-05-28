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
      this.keys = Object.keys(this.data).filter(key => key !== 'roles'); // 🚫 remove 'roles'

    // Extract roleIds from existing roles
    // if (this.data.roles && Array.isArray(this.data.roles)) {
    //   this.data['roleIds'] = this.data.roles.map((r: any) => r.id);
    //   if (!this.keys.includes('roleIds')) {
    //     this.keys.push('roleIds');
    //   }
    // }

    // if (!this.keys.includes('roleId')) {
    //   this.keys.push('roleId');
    // }

    // Build form controls
    const controls = this.keys.reduce((acc, key) => {
      const value = this.data[key] ?? (key === 'roleIds' ? [] : '');
      acc[key] = [value, key === 'roleIds' ? Validators.required : []];
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