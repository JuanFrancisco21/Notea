import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { validarQueSeanIguales } from './app.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public userinfo: User;
  public userdata: any;
  public Form: FormGroup | any;
  private isAndroid: boolean;

  constructor(
    private authS: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.Form = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]],
      'confirmarPassword': ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]]
    }, {validators: validarQueSeanIguales});

  }
  checarSiSonIguales(): boolean {
    return this.Form.hasError('noSonIguales') &&
      this.Form.get('password').dirty &&
      this.Form.get('confirmarPassword').dirty;
  }

  ngOnInit() {
  }

  /**
   * Redireccionamiento al login.
   */
  cancel(){
    this.router.navigate(['']);
  }

  /**
   * Al pulsar registrarse introduce los datos del registro en userdata.
   * Llama al registro de usuario en authservice.
   * Cuando lo registra redirecciona a tab1
   */
  onSubmit() {
    this.userdata = this.saveUserdata();
    this.authS.registroUsuario(this.userdata)
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
      email: this.Form.get('email').value,
      password: this.Form.get('password').value,
    };
    return saveUserdata;
  }


}
