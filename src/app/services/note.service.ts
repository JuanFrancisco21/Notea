import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../model/Note';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private last:any=null;
  private myCollection: AngularFirestoreCollection;
  private myCollectionString:string;

  constructor(private db: AngularFirestore,private authS:AuthService) {
    //this.myCollection = db.collection<any>(environment.firebaseConfig.todoCollection);
    if (authS.user!=null) {
      this.myCollectionString = authS.user.email;
      this.myCollection = db.collection<any>(this.myCollectionString);
    } else {
      this.myCollection = db.collection<any>(environment.firebaseConfig.todoCollection);
    }
  }

  /**
   * Método para guardar nota en firebase.
   * @param note Nota a guardar en firebase.
   * @returns id de la nota.
   */
  public addNote(note: Note): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let response: DocumentReference<firebase.default.firestore.DocumentData> =
          await this.myCollection.add(note);
        resolve(response.id);
      } catch (err) {
        reject(err);
      }
    })
  }

  /**
   * Método para actualizar nota en firebase.
   * @param note Nota a actualizar en firebase.
   * @returns id de la nota.
   */
  public updateNote(note: Note): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        
          await this.myCollection.doc(note.key).update({
            title: note.title,
            description: note.description
          });
        resolve(note.key);
      } catch (err) {
        reject(err);
      }
    })
  }
  /**
   * getNotesByPage() -> page=1,criteria=undefined
   * getNotesByPage(2) -> page=2, criteria=undefined
   * getNotesByPage(2,'title')
   * .orderBy(criteria,'desc')
   * @param page 
   * @param criteria 
   */
  /**
   * Método para la obtención de notas de firebase.
   * @param all 
   * @returns Observable con una lista de notas.
   */
  public getNotesByPage(all?):Observable<Note[]> {
    if(all){
      this.last=null;
    }
    return new Observable((observer) => {
      let result: Note[] = [];
      let query=null;
      if(this.last){
        query=this.db.collection<any>(this.myCollectionString,
          ref => ref.limit(12).startAfter(this.last));
      }else{
        query=this.db.collection<any>(this.myCollectionString,
          ref => ref.limit(12));
      }
      
        
        query.get()
        .subscribe(
          (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
            data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
              this.last=d;
              let tmp = d.data(); //devuelve el objeto almacenado -> la nota con title y description
              let id = d.id; //devuelve la key del objeto
              result.push({ 'key': id, ...tmp });
              //operador spread-> 'title':tmp.title,'description':tmp.description
            })
            observer.next(result);  ///este es el return del observable que devolvemos
            observer.complete();
          }) //final del subscribe
    }); //final del return observable
  }

  //INUTILIZADO
  /**
   * Primer método de obtención de notas.
   * @returns Lista de notas.
   */
  public getNotes(): Observable<Note[]> {
    return new Observable((observer) => {
      let result: Note[] = [];
      this.myCollection.get().subscribe(
        (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
          data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
            let tmp = d.data(); //devuelve el objeto almacenado -> la nota con title y description
            let id = d.id; //devuelve la key del objeto
            result.push({ 'key': id, ...tmp });
            //operador spread-> 'title':tmp.title,'description':tmp.description
          })
          observer.next(result);  ///este es el return del observable que devolvemos
          observer.complete();
        }) //final del subscribe
    }); //final del return observable
  } //final del método getNotes

  /**
   * Método para obtener una nota.
   * @param id de la nota a recibir.
   * @returns Nota envuelta en una promesa.
   */
  public getNote(id: string): Promise<Note> {
    return new Promise(async (resolve, reject) => {
      let note: Note = null;
      try {
        let result: firebase.default.firestore.DocumentData = await this.myCollection.doc(id).get().toPromise();
        note = {
          id: result.id,
          ...result.data()
        }
        resolve(note);
      } catch (err) {
        reject(err);
      }
    })

  }

  /**
   * Método para el borrado de una nota en firebase.
   * @param id de la nota a borrar.
   * @returns Promesa vacia.
   */
  public remove(id: string): Promise<void> {
    return this.myCollection.doc(id).delete();
  }
}
