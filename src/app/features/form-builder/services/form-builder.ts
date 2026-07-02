import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  createDefaultField,
  FieldOption,
  FieldType,
  FormField,
} from '../models/form-field.model';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderStateService {
  private readonly fieldsSubject = new BehaviorSubject<FormField[]>([]);
  readonly fields$ = this.fieldsSubject.asObservable();

  get fields(): FormField[] {
    return this.fieldsSubject.value;
  }

  //addfiled when user drag and drop the field from the sidebar to the canvas.
  addField(type: FieldType, index?: number): FormField {
    const field = createDefaultField(type);
    const fields = [...this.fields];
    if (index !== undefined && index >= 0 && index <= fields.length) {
      fields.splice(index, 0, field);
    } else {
      fields.push(field);
    }
    this.fieldsSubject.next(fields);
    return field;
  }

  //remove filed when user click the remove button then this method call.
  removeField(id: string): void {
    this.fieldsSubject.next(this.fields.filter((f) => f.id !== id));
  }

  //duplicate field when user click the duplicate button then this method call.
  duplicateField(id: string): void {
    const index = this.fields.findIndex((f) => f.id === id);
    if (index === -1) return;

    const source = this.fields[index];
    const copy: FormField = {
      ...source,
      id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      options: source.options.map((opt) => ({
        ...opt,
        id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      })),
    };

    const fields = [...this.fields];
    fields.splice(index + 1, 0, copy);
    this.fieldsSubject.next(fields);
  }

  //update filed when the user change the filed are updated.
  updateField(id: string, changes: Partial<FormField>): void {
    this.fieldsSubject.next(
      this.fields.map((f) => (f.id === id ? { ...f, ...changes } : f))
    );
  }

  //reorder fields when the user drag and drop the field in the canvas.
  reorderFields(previousIndex: number, currentIndex: number): void {
    const fields = [...this.fields];
    const [moved] = fields.splice(previousIndex, 1);
    fields.splice(currentIndex, 0, moved);
    this.fieldsSubject.next(fields);
  }
 
  //add option when the user add the option in the field.
  addOption(fieldId: string): void {
    const field = this.fields.find((f) => f.id === fieldId);
    if (!field) return;

    const newOption: FieldOption = {
      id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label: `Option ${field.options.length + 1}`,
    };

    this.updateField(fieldId, {
      options: [...field.options, newOption],
    });
  }

  //update option when the user update the option in the field.
  updateOption(fieldId: string, optionId: string, label: string): void {
    const field = this.fields.find((f) => f.id === fieldId);
    if (!field) return;

    this.updateField(fieldId, {
      options: field.options.map((o) =>
        o.id === optionId ? { ...o, label } : o
      ),
    });
  }

  //remove option when the user remove the option in the field.
  removeOption(fieldId: string, optionId: string): void {
    const field = this.fields.find((f) => f.id === fieldId);
    if (!field || field.options.length <= 1) return;

    this.updateField(fieldId, {
      options: field.options.filter((o) => o.id !== optionId),
    });
  }

  clearFields(): void {
    this.fieldsSubject.next([]);
  }
}
