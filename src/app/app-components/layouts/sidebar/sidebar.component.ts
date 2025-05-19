import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { MaterialModule } from "src/app/material.module";
import { RouterLink } from '@angular/router';
import { MenuItems } from "src/app/shared/component-items/menu-items/menu-items";
import { PrismController } from 'src/prism_core/controller/prism.controller';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgFor,
    NgIf,
    MaterialModule,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent extends PrismController<any> implements OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems
  ) {
    super();
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
