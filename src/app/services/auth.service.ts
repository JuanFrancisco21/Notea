import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any;
  private isAndroid = false;

  constructor(private storage: LocalStorageService,
    private platform: Platform,
    public authf: AngularFireAuth) {
    this.isAndroid = platform.is("android");
    this.loadSession();
    if (!this.isAndroid)
      GoogleAuth.init(); //lee la config clientid del meta de index.html
  }
  public test() {
    //SecureStoragePlugin.set();
    //const message, nonce, path, privateKey; // ...
    //const hashDigest = sha256(nonce + message);
    //const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));
  }
  /**
   * Registro de un usuario en firebase.
   * @param userdata que se registra en firebase. 
   * @returns Promesa de un boolean.
   */
  public registroUsuario(userdata: { email: any; password: any; }): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      return this.authf.createUserWithEmailAndPassword(userdata.email, userdata.password)
      .then(async u => {
        if (u != null && u.user != null) {
          this.user = {
            displayName: u.user?.displayName,
            email: u.user?.email,
            photoURL: u.user?.photoURL,
            uid: u.user?.uid
          };
          await this.keepSession();
          resolve(true);
        } else {
          reject(false);
          this.user = null;
        }
      })
      .catch(
        error => {
          console.log(error);
        }
      );
    })
  }

  /**
   * Inicio de sesion de un usuario en firebase.
   * @param userdata usuario a iniciar sesión.
   * @returns Promesa de un boolean.
   */
  public async inicioSesion(userdata: { email: any; password: any; }): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      this.authf.signInWithEmailAndPassword(userdata.email, userdata.password)
        .then(async u => {
          if (u != null && u.user != null) {
            this.user = {
              displayName: u.user?.displayName,
              email: u.user?.email,
              photoURL: u.user?.photoURL,
              uid: u.user?.uid
            };
            await this.keepSession();
            resolve(true);
          } else {
            reject(false);
            this.user = null;
          }
        })
        .catch(
          error => {
            console.log(error);
          }
        );
    })
  }

  /**
   * Cargar datos del usuario guardado.
   */
  public async loadSession() {
    let user = await this.storage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.user = user;
    }
  }
  /**
   * Log de usuario mediante google.
   */
  public async loginGoogle() {
    let user: User = await GoogleAuth.signIn();
    this.user = user;
    await this.keepSession();
  }
  /**
   * Cierre de sesión del usuario como borrado de sus datos para acceso rápido.
   */
  public async logout() {
    await GoogleAuth.signOut();
    await this.storage.removeItem('user');
    this.user = null;
  }
  /**
   * Guardar un usuario en un almacen de datos.
   */
  public async keepSession() {
    await this.storage.setItem('user', JSON.stringify(this.user));
  }

  /**
   * Método para saber si ya se está logeado.
   * @returns boolean.
   */
  public isLogged(): boolean {
    if (this.user) return true; else return false;
  }

}
