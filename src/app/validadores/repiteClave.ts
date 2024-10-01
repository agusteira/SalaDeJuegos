import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function confirmarClaveValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        
      const clave = formGroup.get('clave');
      const repiteClave = formGroup.get('confirmarClave');
      const respuestaError = { noCoincide: 'Las claves no coinciden' };

      if (clave?.value !== repiteClave?.value) {
        formGroup.get('confirmarClave')?.setErrors(respuestaError);
        // Si los campos de contraseña no coinciden, devolvemos un error de validación
        return respuestaError;

      } else {
        formGroup.get('confirmarClave')?.setErrors(null);
        // Si los campos de contraseña coinciden, la validación es correcta
        return null;
      }
    };
  }