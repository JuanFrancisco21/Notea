import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public miLoading: HTMLIonLoadingElement;
  private loadingIsUsed: Boolean;

  constructor(public alertController: AlertController,
    private translate:TranslateService,
    private loading: LoadingController,
    private toast: ToastController) {
    this.loadingIsUsed = false;
  }

  /**
   * Presenta un alerta de confirmacion la cual devuelve un boolean. (Confirmacion para borrado de notas)
   * @returns Promesa con un bolean.
   */
  async presentAlertConfirm(): Promise<Boolean> {
    let header=this.translate.instant('REMOVE');
    let message=this.translate.instant('MESSAGE');
    let cancel=this.translate.instant('CANCEL');
    let accept=this.translate.instant('YES');
    return new Promise(async (resolve, reject) => {
      try {
        let result: Boolean = false;
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: header,
          message: message,
          buttons: [
            {
              text: cancel,
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                resolve(result);
              }
            }, {
              text: accept,
              handler: () => {
                resolve(result = true);
              }
            }
          ]
        });

        await alert.present();
      } catch (err) {
        reject(err)
      }

    })
  }

  /**
   * Presenta una pantalla de carga.
   */
  async presentLoading() {
    if (this.loadingIsUsed) {
      this.miLoading.dismiss();
    }
    this.miLoading = await this.loading.create({
      message: ''
    });
    await this.miLoading.present();
    this.loadingIsUsed = true;
  }

  /**
   * Oculta la pantalla de carga.
   */
  async dismissLoading() {
    await this.miLoading.dismiss();
    this.loadingIsUsed = false;
  }

  /**
   * Mensaje emergente con informacion para el usuario (Toast)
   * @param msg Mensaje para el usuario
   * @param clr color de fondo
   */
  async presentToast(msg: string, clr: string) {
    const miToast = await this.toast.create({
      message: msg,
      duration: 2000,
      color: clr
    });
    miToast.present();
  }
}
