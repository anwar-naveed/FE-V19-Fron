import { Component, Input } from '@angular/core';
import { SideBarMenuItem } from 'src/app/shared/component-items/menu-items/menu-items';
import { MaterialModule } from "src/app/material.module";
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nested-menu',
  imports: [MaterialModule, NgIf, NgFor,RouterLink],
  templateUrl: './nested-menu.component.html',
  styleUrl: './nested-menu.component.scss'
})
export class NestedMenuComponent {
  @Input() menuItems: SideBarMenuItem[] = [];

  toggleExpand(item: SideBarMenuItem): void {
    item.expanded = !item.expanded;
  }
}
