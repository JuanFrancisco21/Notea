import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, ModalController, NavController } from '@ionic/angular';
import { Note } from '../model/Note';
import { EditPage } from '../pages/edit/edit.page';
import { AuthService } from '../services/auth.service';
import { NoteService } from '../services/note.service';
import { NotificationsService } from '../services/notifications.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  public notas: Note[] = [];
  public textoBuscar: string='';

  constructor(private ns: NoteService,
    public modalController: ModalController,
    private notifications: NotificationsService,
    private authS: AuthService,
    private router: Router,
    private navCtrl: NavController) { }

    /**
     * Cargar notas cuando este lista la vista.
     */
  async ionViewDidEnter() {
    await this.cargaNotas();
  }

  /**
   * Método para borrar una nota.
   * @param nota Borra nota
   */
  public async borra(nota: Note) {
    this.notifications.presentAlertConfirm().then((async data => {
      if (data) {
        await this.notifications.presentLoading();
        await this.ns.remove(nota.key);
        let i = this.notas.indexOf(nota, 0);
        if (i > -1) {
          this.notas.splice(i, 1);
        }
        await this.notifications.dismissLoading();
      }
    }))
  }

  /**
   * Método para cargar notas de firebase.
   * @param event para cargar notas de 12 en 12
   */
  public async cargaNotas(event?) {
    if (this.infinite) {
      this.infinite.disabled = false;
    }
    if (!event) {
      await this.notifications.presentLoading();
    }
    this.notas = [];
    try {
      this.notas = await this.ns.getNotesByPage('algo').toPromise();
    } catch (err) {
      console.error(err);
      await this.notifications.presentToast("Error cargando datos", "danger");
    } finally {
      if (event) {
        event.target.complete();
      } else {
        await this.notifications.dismissLoading();
      }
    }
  }

  /**
   * Método para busqueda de notas
   * @param event escribir en el search bar
   */
  public async onInput(event) {
    this.textoBuscar=event.detail.value;
  }

  /**
   * Método para concatenar notas.
   * @param $event que carga las nuevas notas.
   */
  public async cargaInfinita($event) {
    let nuevasNotas = await this.ns.getNotesByPage().toPromise();
    if (nuevasNotas.length < 10) {
      $event.target.disabled = true;
    }
    this.notas = this.notas.concat(nuevasNotas);
    $event.target.complete();
  }
  public async logout() {
    await this.authS.logout();
    this.router.navigate(['']);
  }

  /**
   * Apertura de ventana modal para editar nota.
   * @param nota nota a editar
   * @returns 
   */
  async edita(nota: Note) {
    const modal = await this.modalController.create({
      component: EditPage,
      componentProps: {
        'nota': nota
      }
    });
    return await modal.present();
  }

  /**
   * Redireccionamiento a la pagina de lectura de notas.
   * @param nota que se va a enviar a tab3
   */
  public irtab3(nota:Note){
    this.navCtrl.navigateForward(['private/tabs/tab3',{data:JSON.stringify(nota)}]);
  }
}
