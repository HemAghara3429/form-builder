import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { FIELD_TYPE_LABELS, FieldType, FormField } from '../../models/form-field.model';
import { FormSetupService } from '../../services/form-setup.service';

@Component({
  selector: 'app-preview-panel',
  imports: [CommonModule],
  templateUrl: './preview-panel.html',
  styleUrl: './preview-panel.scss',
})
export class PreviewPanel {
  @Input() fields: FormField[] = [];
  readonly FieldType = FieldType;

  constructor(private readonly formSetupService: FormSetupService) {}

  get formName$() {
    return this.formSetupService
      .getFormSetupData()
      .pipe(map((data) => data?.formName?.trim() || 'Untitled Form'));
  }

  trackByFieldId(_index: number, field: FormField): string {
    return field.id;
  }

  fieldTypeLabel(type: FieldType): string {
    return FIELD_TYPE_LABELS[type] || type;
  }

  getRatingArray(max: number): number[] {
    return Array.from({ length: max }, (_, i) => i + 1);
  }
}
