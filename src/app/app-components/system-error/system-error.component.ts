import { Component } from '@angular/core';
import { MaterialIcon, MaterialModule } from 'src/app/material.module';
import { PrismController } from 'src/prism_core/controller/prism.controller';
@Component({
  selector: 'app-system-error',
  imports: [MaterialModule],
  templateUrl: './system-error.component.html',
  styleUrl: './system-error.component.scss'
})
export class SystemErrorComponent extends PrismController<any> {
  protected maticon: any = MaterialIcon;
  navigateBack() {
    this.navigate('main/home');
  }
}
