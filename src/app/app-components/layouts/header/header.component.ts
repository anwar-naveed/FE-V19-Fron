import { Component } from '@angular/core';
import { MaterialModule } from "src/app/material.module";
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MenuItems, MenuItem } from "src/app/shared/component-items/menu-items/menu-items";
import { NestedmenuComponent } from "src/app/shared/components/material-components/menu/nestedmenu/nestedmenu.component";
import { PrismController } from 'src/prism_core/controller/prism.controller';

@Component({
  selector: 'app-header',
  imports: [MaterialModule, NestedmenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends PrismController<any>{
  themeList: any;
  menuItems: MenuItem[];
  constructor(
    private auth_Service: AuthService,
    private menuItemsService: MenuItems
  ){
    super()
    this.menuItems = this.menuItemsService.getHeaderMenuItems(this.getRoles());
  }

  async onClickSignOut(){
    await this.auth_Service.signOut();
    this.navigate('login');
  }
}
