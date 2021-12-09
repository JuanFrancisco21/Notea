import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage'

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Método para guardado de información en localstorage.
   * @param key string identificador del item guardado.
   * @param value object que se va a guardar
   * @returns Promesa de un boolean.
   */
  public async setItem(key:string, value:any):Promise<boolean>{
    let result:boolean = false;
    try{
      await Storage.set({
        key:key,
        value:JSON.stringify(value)
      })
      result=true;
    }catch(err){
      console.error(err);
    }
    
    return Promise.resolve(result);
  }

  /**
   * Método para obtener un item.
   * @param key identificador del objeto a traer.
   * @returns no devuelve nada.
   */
  public async getItem(key:string):Promise<any>{
    let data=null;  
    try{
      data=await Storage.get({key:key});
      data=data.value;
      if(data!=null)
        data=JSON.parse(data);
    }catch(err){
      console.error(err);
    }
    return Promise.resolve(data);

  }

  /**
   * Método para eliminar item.
   * @param key identificador del item.
   * @returns Promesa de un boolean
   */
  public async removeItem(key:string):Promise<boolean>{
    let result=false;
    try{
      await Storage.remove({key:key});
      result=true;
    }catch(err){
      console.error(err);
    }
    return Promise.resolve(result);
  }

}
