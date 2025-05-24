import { Injectable } from '@angular/core';
import { ConfigService } from 'src/core/services/config.service';
import { DocumentService } from 'src/core/services/document.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private configService: ConfigService,
    private documentService: DocumentService
  ) { }

  async getdefaultTheme(){
    return this.configService.getSetting("Data").themeColor;
  }

  async changeTheme(themeName: string){
    document.body.classList.replace(document.body.classList.value, themeName);
  }

  async changeThemeViaDocumentService(themeName: string){
    this.documentService.updateDocumentBodyClassByRemovingAll(themeName);
  }

  async addThemeViaDocumentService(themeName: string){
    this.documentService.addDocumentBodyClass(themeName);
  }
}
