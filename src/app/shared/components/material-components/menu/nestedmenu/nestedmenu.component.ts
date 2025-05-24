import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MenuItem } from "src/app/shared/component-items/menu-items/menu-items";
import { NgIf, NgFor } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-nestedmenu',
  imports: [NgIf, NgFor, MaterialModule],
  templateUrl: './nestedmenu.component.html',
  styleUrl: './nestedmenu.component.scss',
})
export class NestedmenuComponent implements AfterViewInit, OnDestroy{
  @Input({ required: true, alias: 'menuItems'}) menuItems: any;
  @ViewChildren(MatMenuTrigger) triggers!: QueryList<MatMenuTrigger>;
  
  private closeTimeoutId: any = null;
  private openedTrigger: MatMenuTrigger | null = null;

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.closeTimeoutId) {
      clearTimeout(this.closeTimeoutId);
    }
  }

  openSubMenu(trigger: MatMenuTrigger) {
    if (this.closeTimeoutId) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }

    if (this.openedTrigger && this.openedTrigger !== trigger) {
      this.openedTrigger.closeMenu();
    }

    trigger.openMenu();
    this.openedTrigger = trigger;
  }

  scheduleClose() {
    this.closeTimeoutId = setTimeout(() => {
      if (this.openedTrigger) {
        this.openedTrigger.closeMenu();
        this.openedTrigger = null;
      }
    }, 300);
  }

  cancelClose() {
    if (this.closeTimeoutId) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }
  }

  onParentMouseEnter(trigger: MatMenuTrigger) {
    this.openSubMenu(trigger);
  }

  onParentMouseLeave() {
    this.scheduleClose();
  }

  onSubMenuMouseEnter() {
    this.cancelClose();
  }

  onSubMenuMouseLeave() {
    this.scheduleClose();
  }

  handleClick(item: MenuItem) {
    if (item.action) item.action();
  }
}

