import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MaterialModule } from "src/app/material.module";
import { MENU_DATA, MenuItems, SideBarMenuItem } from "src/app/shared/component-items/menu-items/menu-items";
import { PrismController } from 'src/prism_core/controller/prism.controller';
import { NestedMenuComponent } from 'src/app/shared/components/material-components/menu/nested-menu/nested-menu.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    MaterialModule,
    NestedMenuComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent extends PrismController<any> implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  allMenuItems: SideBarMenuItem[] = MENU_DATA;
  filteredMenuItems: SideBarMenuItem[] = [];
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
  ngOnInit() {
    this.filteredMenuItems = this.filterMenuItemsByRoles(
      this.allMenuItems,
      this.getRoles()
    );
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  private filterMenuItemsByRoles(
    items: SideBarMenuItem[],
    allowedRoles: string[]
  ): SideBarMenuItem[] {
    // Lowercase all allowedRoles once for efficiency
    const allowedRolesLower = allowedRoles.map((r) => r.toLowerCase());
  
    return items
      .map((item) => {
        const filteredChildren = item.children
          ? this.filterMenuItemsByRoles(item.children, allowedRoles)
          : [];
  
        const isAllowed =
          !item.roles ||
          item.roles.some((role) =>
            allowedRolesLower.includes(role.toLowerCase())
          );
  
        if (isAllowed || filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }
  
}
