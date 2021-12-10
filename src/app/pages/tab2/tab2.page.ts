import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Note } from '../../model/Note';
import { AuthService } from '../../services/auth.service';
import { NoteService } from '../../services/note.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public formNota:FormGroup;

  constructor(private fgb:FormBuilder,
              private noteS:NoteService,
              private notifications:NotificationsService,
              private authS:AuthService,
              private router:Router) {
    this.formNota=this.fgb.group({
      title:["",Validators.required],
      description:[""]
    });
  }
  

  /**
   * Método para añadir una nota.
   */
  public async addNote(){
    let newNote:Note={
      title:this.formNota.get("title").value,
      description:this.formNota.get("description").value
    }
    await this.notifications.presentLoading();
    try{
      let id=await this.noteS.addNote(newNote);
      this.notifications.dismissLoading();
      await this.notifications.presentToast("Nota añadida correctamente","success");
      this.formNota.reset();
    }catch(err){
      console.log(err);
      this.notifications.dismissLoading();
      await this.notifications.presentToast("Error agregando nota","danger");
    }
  }
  /**
   * Método para cerrar sesión.
   */
  public async logout(){
    await this.authS.logout();
    this.router.navigate(['']);
  }
}
