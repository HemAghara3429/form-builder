import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  FIELD_PALETTE,
  FIELD_TYPE_LABELS,
  FieldType,
  FormField,
} from '../../models/form-field.model';

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

  toggleCollapse(): void {
    this.fieldChange.emit({ collapsed: !this.field.collapsed });
  }

  toggleRequired(): void {
    this.fieldChange.emit({ required: !this.field.required });
  }

  onLabelChange(value: string): void {
    this.fieldChange.emit({ label: value });
  }

  onPlaceholderChange(value: string): void {
    this.fieldChange.emit({ placeholder: value });
  }

  onDescriptionChange(value: string): void {
    this.fieldChange.emit({ description: value });
  }

  onTermsChange(value: string): void {
    this.fieldChange.emit({ termsText: value });
  }

  onImageUrlChange(value: string): void {
    this.fieldChange.emit({ imageUrl: value });
  }

  onMaxRatingChange(value: number): void {
    this.fieldChange.emit({ maxRating: value });
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  closeMenu(): void {
    this.showMenu = false;
  }

  getStarArray(): number[] {
    const count = this.field.maxRating ?? 5;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  getNumberArray(): number[] {
    const count = this.field.maxRating ?? 10;
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}
