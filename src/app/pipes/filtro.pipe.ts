import { Pipe, PipeTransform } from '@angular/core';
import { Note } from '../model/Note';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(notas: Note[], texto: string):Note[] {
    if (texto.length==0) { return notas}
    return notas.filter(nota=>{
      return nota.title.toLocaleLowerCase().includes(texto.toLowerCase()) || nota.description.toLowerCase().includes(texto.toLowerCase());
    })
  }

}
