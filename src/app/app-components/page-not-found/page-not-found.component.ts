import { Component } from '@angular/core';
import { MaterialIcon, MaterialModule } from 'src/app/material.module';
import { PrismController } from 'src/prism_core/controller/prism.controller';

@Component({
  selector: 'app-page-not-found',
  imports: [MaterialModule],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent extends PrismController<any> {
  protected maticon: any = MaterialIcon;
  navigateBack() {
    this.navigate('main/home');
  }
}
