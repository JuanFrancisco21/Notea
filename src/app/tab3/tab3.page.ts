import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { IonToggle, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Note } from '../model/Note';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public image:any;
  public datacoming:any;
  public nota:Note;

  constructor(
    private storage:LocalStorageService,
    private authS:AuthService,
    private router:Router,
    private route:ActivatedRoute) {
      this.datacoming=this.route.snapshot.params['data'];
      if (this.datacoming) {
        try {
          this.nota=JSON.parse(this.datacoming);
        } catch (err) {
          console.log(err);
        }
      }
    /*traductor.setDefaultLang("en");
    traductor.use("es");
    traductor.get("TAKE A PICTURE").toPromise().then(data=>{
      console.log(data);
    })*/

  }


  
 /**
   * Redireccionamiento a tab1.
   */
  cancel(){
    this.router.navigate(['private/tabs/tab1']);
  }
  /**
   * Método para que se lea nota.
   */
  public async leer(){
      await TextToSpeech.speak({
        text: "Titulo...  "+this.nota.title+"..."+ "Descripcion...  "+ this.nota.description ,
        lang: 'es-ES',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
 
  }
  
  /**
   * Cerrar sesión.
   */
  public async logout(){
    await this.authS.logout();
    this.router.navigate(['']);
  }
}
