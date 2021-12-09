import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public miLoading: HTMLIonLoadingElement;
  private loadingIsUsed: Boolean;

  constructor(public alertController: AlertController,
    private loading: LoadingController,
    private toast: ToastController) {
    this.loadingIsUsed = false;
  }

  /**
   * Presenta un alerta de confirmacion la cual devuelve un boolean. (Confirmacion para borrado de notas)
   * @returns Promesa con un bolean.
   */
  async presentAlertConfirm(): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let result: Boolean = false;
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Borrado de nota!',
          message: '¿Estas seguro de borrarla?',
          buttons: [
            {
              text: 'NO',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                resolve(result);
              }
            }, {
              text: 'SI',
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
