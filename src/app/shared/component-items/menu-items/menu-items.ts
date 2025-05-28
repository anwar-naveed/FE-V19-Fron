import { Injectable } from '@angular/core';
import { PrismService } from 'src/prism_core/services/prism.service';
import { Observable, delay, of } from "rxjs";
import { Role } from 'src/core/helper/helper.methods';
import { ThemeService } from '../../services/common/theme.service';

export interface MenuItem {
  label: string;
  icon?: string;
  action?: () => void;
  children?: MenuItem[];
  // loadChildren?: () => Observable<MenuItem[]>; // Lazy-load
  activatedRole?: string[];
}

export interface SideBarMenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: SideBarMenuItem[];
  roles?: string[]; // Allowed roles for this item
  expanded?: boolean;
}

export const MENU_DATA: SideBarMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: [Role.USER, Role.ADMIN, Role.MANAGER],
  },
  {
    label: 'Admin',
    icon: 'shopping_cart',
    roles: [Role.USER, Role.ADMIN],
    children: [
      { label: 'Home', route: '/main/home', roles: [Role.ADMIN, Role.USER] },
      { label: 'User', route: '/main/user', roles: [Role.ADMIN] },
      { label: 'Role', route: '/main/role', roles: [Role.ADMIN] },
      { label: 'Clothing', route: '/products/clothing', roles: [Role.USER] },
      {
        label: 'More',
        roles: ['USER', 'ADMIN'],
        children: [
          { label: 'Shoes', route: '/products/shoes', roles: [Role.USER] },
          {
            label: 'Accessories',
            route: '/products/accessories',
            roles: ['ADMIN', 'MANAGER'],
          },
        ],
      },
    ],
  },
  {
    label: 'Settings',
    icon: 'settings',
    roles: [Role.ADMIN],
    children: [
      { label: 'Profile', route: '/settings/profile', roles: [Role.MANAGER] },
      { label: 'Security', route: '/settings/security', roles: [Role.ADMIN] },
    ],
  },
];

@Injectable({
  providedIn: 'root'
})
export class MenuItems extends PrismService<any> {

  headerMenuItems: MenuItem[] = [
    {
      label: 'Themes',
      icon: 'home',
      activatedRole: [Role.USER],
      children: [
        { label: 
          'Dark-Red', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-red"); },
        },
        { label: 
          'Dark-Green', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-green"); },
        },
        { label: 
          'Dark-Blue', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-blue"); },
        },
        { label: 
          'Dark-Yellow', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-yellow"); },
        },
        { label: 
          'Dark-Cyan', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-cyan"); },
        },
        { label: 
          'Dark-Orange', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-orange"); },
        },
        { label: 
          'Dark-CharterUse', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-charteruse"); },
        },
        { label: 
          'Dark-Magenta', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-magenta"); },
        },
        { label: 
          'Dark-Spring-Green', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-spring\-green"); },
        },
        { label: 
          'Dark-Azure', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-azure"); },
        },
        { label: 
          'Dark-Violet', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-violet"); },
        },
        { label: 
          'Dark-Rose', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("dark\-mode\-rose"); },
        },
        { label: 
          'Light-Red', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-red"); },
        },
        { label: 
          'Light-Green', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-green"); },
        },
        { label: 
          'Light-Blue', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-blue"); },
        },
        { label: 
          'Light-Yellow', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-yellow"); },
        },
        { label: 
          'Light-Cyan', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-cyan"); },
        },
        { label: 
          'Light-Orange', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-orange"); },
        },
        { label: 
          'Light-CharterUse', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-charteruse"); },
        },
        { label: 
          'Light-Magenta', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-magenta"); },
        },
        { label: 
          'Light-Spring-Green', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-spring\-green"); },
        },
        { label: 
          'Light-Azure', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-azure"); },
        },
        { label: 
          'Light-Violet', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-violet"); },
        },
        { label: 
          'Light-Rose', 
          icon: 'devices', 
          activatedRole: [Role.ADMIN],
          action: () => { this.themeService.changeTheme("light\-mode\-rose"); },
        },
        { label: 
          'Light-1', 
          icon: 'checkroom', 
          activatedRole: [Role.USER],
          action: () => { this.themeService.changeTheme("light-theme1"); },
        },
        { label: 
          'Light-2', 
          icon: 'checkroom', 
          activatedRole: [Role.USER],
          action: () => { this.themeService.changeTheme("light-theme2"); },
        },
      ]
    },
    {
      label: 'Home',
      icon: 'home',
      action: () => { console.log('Item 1 clicked'); },
      activatedRole: [Role.USER]
    },
    {
      label: 'Products',
      icon: 'shopping_cart',
      activatedRole: [Role.USER],
      children: [
        { label: 'Electronics', icon: 'devices', activatedRole: [Role.ADMIN] },
        { label: 'Clothing', icon: 'checkroom', activatedRole: [Role.USER] },
        {
          label: 'More',
          icon: 'expand_more',
          activatedRole: [Role.USER],
          children: [
            { label: 'Shoes', icon: 'sports_shoe', activatedRole: [Role.USER] },
            { label: 'Accessories', icon: 'watch', activatedRole: [Role.ADMIN, Role.MANAGER] },
          ],
        },
      ],
    },
    {
      label: 'About Us',
      icon: 'info',
      activatedRole: [Role.MANAGER]
    },
  ];

  dataMap = new Map<string, string[]>([
    ["Fruits", ["Apple", "Orange", "Banana"]],
    ["Vegetables", ["Tomato", "Potato", "Onion"]],
    ["Apple", ["Fuji", "Macintosh"]],
    ["Onion", ["Yellow", "White", "Purple"]],
    ["Macintosh", ["Yellow", "White", "Purple"]],
  ]);

  constructor(private themeService: ThemeService) {
    super("");
  }

  getHeaderMenuItems(allowedRoles?: string[]): MenuItem[] {
    if (allowedRoles) {
      const menu = this.filterMenuItemsByRoles(this.headerMenuItems, allowedRoles);
      return menu.length > 0 ? menu : [{ label: 'No Menu' }];
    }
    return [{ label: 'No Menu' }];
  }

  public getChildren(node: string) {
    // adding delay to mock a REST API call
    return of(this.dataMap.get(node)).pipe(delay(1000));
  }

  public isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }

  private filterMenuItemsByRoles(menuItems: MenuItem[], allowedRoles: string[]): MenuItem[] {
    return menuItems
      .map(item => {
        const filteredChildren = item.children
          ? this.filterMenuItemsByRoles(item.children, allowedRoles)
          : [];
  
        const isAuthorized = item.activatedRole?.some(role =>
          allowedRoles.some(userRole => userRole.toLowerCase() === role.toLowerCase())
        );
  
        if (isAuthorized || filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : undefined
          };
        }
  
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }
}
