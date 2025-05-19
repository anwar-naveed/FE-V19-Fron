import { Component } from '@angular/core';
import { ConfigService } from 'src/core/services/config.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  today: number = Date.now();
  organizationName: string;
  constructor(
    private configService: ConfigService
  ){
    this.organizationName = this.configService.getSetting("Data").organizationName;
  }
}
