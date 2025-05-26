import { Component } from '@angular/core';
import { MaterialIcon, MaterialModule } from 'src/app/material.module';
import { PrismController } from 'src/prism_core/controller/prism.controller';

@Component({
  selector: 'app-unauthorized',
  imports: [MaterialModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent extends PrismController<any> {
  protected maticon: any = MaterialIcon;
  navigateBack() {
    this.navigate('main/home');
  }
}
