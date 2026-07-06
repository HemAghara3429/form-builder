import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { FieldType, FormField } from '../../models/form-field.model';
import { FormSetupService } from '../../services/form-setup.service';
import { FormSubmissionService } from '../../services/form-submission.service';
import { FormBuilderStateService } from '../../services/form-builder';

const PREVIEW_VALUES_KEY = 'form-builder-preview-values';
const PREVIEW_SUBMISSIONS_KEY = 'form-builder-preview-submissions';

@Component({
  selector: 'app-preview-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './preview-panel.html',
  styleUrl: './preview-panel.scss',
})
export class PreviewPanel implements OnInit, OnChanges {
  @Input() fields: FormField[] = [];
  readonly FieldType = FieldType;
  formValues: Record<string, unknown> = {};
  successMessage = '';

  constructor(
    private readonly formSetupService: FormSetupService,
    private readonly formSubmissionService: FormSubmissionService,
    private readonly formBuilderStateService: FormBuilderStateService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.formValues = this.loadSavedValues();
    this.initializeFieldValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const fieldChanges = changes['fields'];
    if (fieldChanges) {
      this.initializeFieldValues();
    }
  }

  get formName$() {
    return this.formSetupService
      .getFormSetupData()
      .pipe(map((data) => data?.formName?.trim() || 'Untitled Form'));
  }

  trackByFieldId(_index: number, field: FormField): string {
    return field.id;
  }

  getRatingArray(maxRating: number): number[] {
    return Array.from({ length: maxRating }, (_, i) => i + 1);
  }

  onValueChange(field: FormField, value: unknown): void {
    this.formValues = {
      ...this.formValues,
      [field.id]: value,
    };
    this.saveValues();
  }

  onCheckboxChange(field: FormField, optionId: string, checked: boolean): void {
    const current = Array.isArray(this.formValues[field.id])
      ? [...(this.formValues[field.id] as string[])]
      : [];

    const next = checked
      ? [...current, optionId]
      : current.filter((id) => id !== optionId);

    this.onValueChange(field, next);
  }

  isCheckboxChecked(field: FormField, optionId: string): boolean {
    return Array.isArray(this.formValues[field.id])
      ? (this.formValues[field.id] as string[]).includes(optionId)
      : false;
  }

  onFileSelected(fieldId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.onValueChange({ id: fieldId } as FormField, file.name);
    }
  }

  submitForm(): void {
    this.successMessage = '';
    this.saveValues();
    const submissionValues = this.buildSubmissionValues();

    // Get current form name to label the submission in the DB
    this.formSetupService.getFormSetupData().subscribe((data) => {
      const formName = data?.formName?.trim() || 'Untitled Form';

      this.formSubmissionService.submitForm(formName, submissionValues).subscribe({
        next: (response) => {
          console.log('Submission saved to database:', response);

          // Also save a copy locally
          const submission = {
            submittedAt: new Date().toISOString(),
            values: submissionValues,
          };
          this.saveSubmission(submission);

          this.successMessage = 'Your data is successfully saved!';

          // Clear form setup configuration, builder fields, and user values
          this.formSetupService.clearFormSetupData();
          this.formBuilderStateService.clearFields();
          try {
            localStorage.removeItem(PREVIEW_VALUES_KEY);
          } catch { }
          this.formValues = {};

          // Redirect to the setup page after 1.5 seconds
          setTimeout(() => {
            this.router.navigate(['/form-builder/setup']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error saving submission to database:', error);
          this.successMessage = 'Failed to submit form to database. Please ensure the backend server is running.';
        }
      });
    });
  }

  private buildSubmissionValues(): Record<string, unknown> {
    const values: Record<string, unknown> = {};

    for (const field of this.fields) {
      const key = field.label?.trim() || field.placeholder?.trim() || field.id;
      const value = this.formValues[field.id];

      if (field.type === FieldType.CHECKBOX && Array.isArray(value)) {
        const selectedOptions = field.options
          .filter((option) => (value as string[]).includes(option.id))
          .map((option) => option.label);
        values[key] = selectedOptions;
      } else if (field.type === FieldType.RADIO && typeof value === 'string') {
        values[key] = value;
      } else if (field.type === FieldType.DROPDOWN && typeof value === 'string') {
        values[key] = value;
      } else {
        values[key] = value ?? '';
      }
    }

    return values;
  }

  private initializeFieldValues(): void {
    const savedValues = this.loadSavedValues();
    this.formValues = this.fields.reduce((values, field) => {
      if (savedValues[field.id] !== undefined) {
        values[field.id] = savedValues[field.id];
      } else if (field.type === FieldType.CHECKBOX) {
        values[field.id] = [];
      } else if (field.type === FieldType.TERMS_CONDITION) {
        values[field.id] = false;
      } else {
        values[field.id] = '';
      }
      return values;
    }, {} as Record<string, unknown>);
    this.saveValues();
  }

  private saveValues(): void {
    try {
      localStorage.setItem(PREVIEW_VALUES_KEY, JSON.stringify(this.formValues));
    } catch { }
  }

  private loadSavedValues(): Record<string, unknown> {
    if (typeof window === 'undefined') {
      return {};
    }
    try {
      const raw = localStorage.getItem(PREVIEW_VALUES_KEY);
      if (!raw) {
        return {};
      }
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      localStorage.removeItem(PREVIEW_VALUES_KEY);
      return {};
    }
  }

  private saveSubmission(submission: unknown): void {
    try {
      const raw = localStorage.getItem(PREVIEW_SUBMISSIONS_KEY);
      const submissions = raw ? (JSON.parse(raw) as unknown[]) : [];
      localStorage.setItem(
        PREVIEW_SUBMISSIONS_KEY,
        JSON.stringify([...submissions, submission])
      );
    } catch { }
  }
}
