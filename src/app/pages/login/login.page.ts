import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userinfo: User;
  public userdata: any;
  public loginForm: FormGroup | any;
  private isAndroid: boolean;

  constructor(private platform: Platform,
    private authS: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) {
      this.loginForm = this.formBuilder.group({
        'email': ['', [Validators.required, Validators.email]],
        'password': ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]]
      });
  }

  ngOnInit() {
  }

  /**
   * Comprueba si el usuario esta registrado.
   * Si lo esta lo redirecciona a la pantalla principal tab1.
   */
  ionViewWillEnter() {
    if (this.authS.isLogged) {
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  /**
   * Al Pulsar en sing Establece el usuario
   * y llama a authservice para iniciar sesion con dicho ususario.
   */
  onSubmit() {
    this.userdata = this.saveUserdata();
    this.authS.inicioSesion(this.userdata)
      .then(data => {
        if (data) {
          this.router.navigate(['private/tabs/tab1']);
        }
      })
      .catch(error => {
          console.log(error);
        }
      );
  }
  
  /**
   * Creacion de un usuario con datos del usuario.
   * @returns Usuario con los datos introducidos del usuario.
   */
  saveUserdata() {
    const saveUserdata = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
    return saveUserdata;
  }

  /**
   * Redirección a la página para registrarse.
   */
  public async signUp() {
    try {
      this.router.navigate(['registro/']);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Llamada a la funcion de authservice para logear usuario con google.
   */
  public async signinGoogle() {
    try {
      await this.authS.loginGoogle();
      this.router.navigate(['private/tabs/tab1']);
    } catch (err) {
      console.error(err);
    }
  }
}
