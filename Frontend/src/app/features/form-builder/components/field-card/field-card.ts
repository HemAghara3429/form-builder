import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';//material icon module is used to display the icons
import {
  FIELD_PALETTE,
  FIELD_TYPE_LABELS,
  FieldType,
  FormField,
} from '../../models/form-field.model';  //form field model is used to describe the structure of the form field.

@Component({
  selector: 'app-field-card',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './field-card.html',
  styleUrl: './field-card.scss',
})
export class FieldCard {
  @Input({ required: true }) field!: FormField;
  @Output() fieldChange = new EventEmitter<Partial<FormField>>();
  @Output() duplicate = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Output() addOption = new EventEmitter<void>();
  @Output() updateOption = new EventEmitter<{ optionId: string; label: string }>();
  @Output() removeOption = new EventEmitter<string>();

  showMenu = false;
  readonly FieldType = FieldType;

  get typeLabel(): string {
    return FIELD_TYPE_LABELS[this.field.type];
  }

  get paletteMeta() {
    return FIELD_PALETTE.find((p) => p.type === this.field.type);
  }

  get hasPlaceholder(): boolean {
    return [
      FieldType.SINGLE_LINE,
      FieldType.PARAGRAPH,
      FieldType.DROPDOWN,
      FieldType.DATE_PICKER,
      FieldType.TIME_PICKER,
    ].includes(this.field.type);
  }

  get hasOptions(): boolean {
    return [FieldType.CHECKBOX, FieldType.DROPDOWN, FieldType.RADIO].includes(
      this.field.type
    );
  }

  trackByOptionId(_index: number, option: { id: string }): string {
    return option.id;
  }

  //togglecollapse when the user click the collapse button then this method call
  toggleCollapse(): void {
    this.fieldChange.emit({ collapsed: !this.field.collapsed });
  }

  //togglerequired when the user click the required button then this method call
  toggleRequired(): void {
    this.fieldChange.emit({ required: !this.field.required });
  }

//onlabelchange when the user change the label then this method call
  onLabelChange(value: string): void {
    this.fieldChange.emit({ label: value });
  }

  //onplaceholderchange when the user change the placeholder then this method call
  onPlaceholderChange(value: string): void {
    this.fieldChange.emit({ placeholder: value });
  }

  //ondescriptionchange when the user change the description then this method call
  onDescriptionChange(value: string): void {
    this.fieldChange.emit({ description: value });
  }

  //ontermschange when the user change the terms then this method call
  onTermsChange(value: string): void {
    this.fieldChange.emit({ termsText: value });
  }

  //onimageurlchange when the user change the image url then this method call
  onImageUrlChange(value: string): void {
    this.fieldChange.emit({ imageUrl: value });
  }

  //onmaxratingchange when the user change the max rating then this method call
  onMaxRatingChange(value: number): void {
    this.fieldChange.emit({ maxRating: value });
  }

  //togglemenu when the user click the menu button then this method call
  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  //closemenu when the user click the close button then this method call
  closeMenu(): void {
    this.showMenu = false;
  }

  toggleValidationSettings(): void {
    const show = !this.field.showValidation;
    const rules = this.field.validationRules || {
      minLength: undefined,
      maxLength: undefined,
      patternType: 'none',
      customRegex: '',
      customErrorMessage: '',
      allowedExtensions: '',
      maxFileSize: undefined,
    };
    this.fieldChange.emit({
      showValidation: show,
      validationRules: rules
    });
  }

  updateValidationRule(key: string, value: any): void {
    const rules = {
      ...(this.field.validationRules || {}),
      [key]: value === '' || value === null ? undefined : value
    };
    this.fieldChange.emit({ validationRules: rules });
  }

  //getstararray when the user click the star button then this method call
  getStarArray(): number[] {
    const count = this.field.maxRating ?? 5;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  //getnumberarray when the user click the number button then this method call
  getNumberArray(): number[] {
    const count = this.field.maxRating ?? 10;
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}
