import { Component } from '@angular/core';
import { MaterialModule } from "src/app/material.module";
import { UserService } from 'src/app/shared/services/auth/user.service';
import { PrismController } from 'src/prism_core/controller/prism.controller';

@Component({
  selector: 'app-header',
  imports: [MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends PrismController<any>{

  constructor(
    private userService: UserService
  ){
    super()
  }

  onClickSetting(){

  }

  async onClickSignOut(){
    await this.userService.signOut();
    this.navigate('login');
  }
}
