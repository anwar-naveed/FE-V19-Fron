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
  hidePassword = true;
  dialogTitle = 'Fill Form';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DynamicEditDialogComponent>,
    private fb: FormBuilder,
    private roleService: RoleService
  ) { }

  async ngOnInit() {
    const { multiSelectEnum, enumOptions, formKey } = this.data;
    const entityName = this.data.entityName || 'Item';
    // Heuristic: data includes 'email' or 'username' it's a user
    const isUser = 'email' in this.data || 'username' in this.data;
    const isEditMode = this.data?.id !== undefined && this.data?.id !== null;

    this.dialogTitle = `${isEditMode ? 'Edit' : 'Create'} ${entityName}`;

    // Special case for multi-select enum (create-role flow only)
    if (multiSelectEnum && Array.isArray(enumOptions) && formKey) {
      this.keys = [formKey];
      this.form = this.fb.group({
        // [formKey]: [[], Validators.required]
        [formKey]: [[], this.getValidators(formKey)]
      });
      this.roles = enumOptions;
      return;
    }

    // Determine visible keys
    this.keys = Object.keys(this.data).filter(key =>
      !['roles', 'multiSelectEnum', 'enumOptions', 'formKey', 'entityName'].includes(key) &&
      !(isEditMode && isUser && (this.isPasswordField(key) || key === 'IsActive')) // hide password and isactive in edit mode only
    );

    // Fallback for normal use-case
    const controls = this.keys.reduce((acc, key) => {
      // Check if it's the password field and we're creating a user
      const isCreatingUser = !this.data?.id && isUser;
      const isPassword = this.isPasswordField(key);

      acc[key] = [this.data[key] ?? '', this.getValidators(key,isCreatingUser)];

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

  toTitleCase(value: unknown): string {
    return HelperMethods.ToTitleCase(value);
  }

  getValidators(key: string, condition: boolean = false): any[] {
    if (this.isPasswordField(key) && condition) {
      return [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ];
    } else if (key.includes('Id')) {
      return [Validators.required, Validators.min(1)];
    }
    return [Validators.required];
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // ensures errors display if untouched
      return;
    }
    const result = { ...this.form.value };
    if ('roleId' in result) {
      result.roleId = result.roleId ? BigInt(result.roleId) : null;
    }

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}