import { Component } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private langsAvailable = ['es', 'en'];
  public subscription: any;
  constructor(private traductor: TranslateService,
    private storage: LocalStorageService,
    private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(100, () => {
      navigator['app'].exitApp();
    });

    (async () => {
      let lang = await storage.getItem("lang");
      if (lang == null) {
        lang = this.traductor.getBrowserLang();
      } else {
        lang = lang.lang;
      }
      if (this.langsAvailable.indexOf(lang) > -1) {
        traductor.setDefaultLang(lang)
      } else {
        traductor.setDefaultLang("en");
      }
    })();

    //detectar el lenguaje del navegador
    //const lang = window.navigator.language.split("-")[0]
    const lang = this.traductor.getBrowserLang();
    if (this.langsAvailable.indexOf(lang) > -1) {
      traductor.setDefaultLang(lang);
    }
    traductor.setDefaultLang("en");
  }
  ionViewDidEnter() {

  }


  public async cambiaIdioma(event) {

    if (event && event.detail && event.detail.checked) {
      await this.storage.setItem('lang', { lang: 'en' });
      this.traductor.use('en');
    } else {
      await this.storage.setItem('lang', { lang: 'es' });
      this.traductor.use('es');
    }
  }


}
