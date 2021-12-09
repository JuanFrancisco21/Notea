import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/Note';
import { NoteService } from 'src/app/services/note.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  @Input() nota: Note;
  public formNota:FormGroup;

  constructor(private fgb:FormBuilder,
    private noteS:NoteService,
    public modalCtrl: ModalController,
    private notifications:NotificationsService) {}

    /**
     * Al iniciar crea la validación de un nota.
     */
  ngOnInit() {
    this.formNota=this.fgb.group({
      title:["",Validators.required],
      description:[""]
    });
  }

  /**
   * Actuliza una nota, al hacerlo se informa al usuario y cierrea ventana modal.
   */
  public async updateNote(){
    this.noteS.updateNote(this.nota)
    .then(async ()=>{
      await this.notifications.presentToast("Nota editada correctamente","success");
      this.modalCtrl.dismiss({
        'dismissed': true
      });
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  /**
   * Cierra ventana modal y deja a la vista tabs1
   */
  volver(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
