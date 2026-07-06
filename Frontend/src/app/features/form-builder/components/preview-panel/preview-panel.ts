import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';
import { FieldType, FormField } from '../../models/form-field.model';
import { FormSetupService } from '../../services/form-setup.service';
import { FormSubmissionService } from '../../services/form-submission.service';
import { FormBuilderStateService } from '../../services/form-builder';

const PREVIEW_VALUES_KEY = 'form-builder-preview-values'; // local storage key for form values
const PREVIEW_SUBMISSIONS_KEY = 'form-builder-preview-submissions';// local storage key for form submissions

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
  successMessage = '';  //success message inital empty
  errorMessage = '';//error message inital empty
  errors: Record<string, string> = {}; //errors inital empty 

  //A constructor is a special method that runs automatically when the component is created. 
  //Here we are injecting services that we need to use in our component.
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

  //it helps to track the changes in the fields and update the fields only when the changes are detected.
  trackByFieldId(_index: number, field: FormField): string {
    return field.id;
  }

  //rating array.
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
      this.onValueChange({ id: fieldId } as FormField, {
        name: file.name,
        size: file.size
      });
      // Clear error once file is selected
      if (this.errors[fieldId]) {
        delete this.errors[fieldId];
      }
    }
  }

  getUploadedFileName(val: unknown): string {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null && 'name' in val) {
      return (val as { name: string }).name;
    }
    return '';
  }

  validateForm(): boolean {
    this.errors = {};
    return true;
  }

  submitForm(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.validateForm()) {
      this.errorMessage = 'Please resolve the validation errors before submitting.';
      return;
    }

    this.saveValues();
    const submissionValues = this.buildSubmissionValues();

    // Get current form name to label the submission in the DB
    this.formSetupService.getFormSetupData().pipe(take(1)).subscribe((data) => {
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
          this.errorMessage = '';

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
          if (error.status === 422 && error.error && error.error.errors) {
            // Backend validation errors! Map them back to fields.
            const beErrors = error.error.errors as Record<string, string>;
            this.errorMessage = 'Validation failed on the server.';
            // Map keys back to field IDs
            for (const field of this.fields) {
              const key = field.label?.trim() || field.placeholder?.trim() || field.id;
              if (beErrors[key]) {
                this.errors[field.id] = beErrors[key];
              }
            }
          } else {
            this.errorMessage = 'Failed to submit form to database. Please ensure the backend server is running.';
          }
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
      } else if (field.type === FieldType.UPLOAD_FILE && value && typeof value === 'object') {
        values[key] = (value as { name: string }).name || '';
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

  //save the value store the data into local storage.

  private saveValues(): void {
    try {
      //Converts a JavaScript object to a JSON string
      localStorage.setItem(PREVIEW_VALUES_KEY, JSON.stringify(this.formValues));
    } catch { }
  }

  private loadSavedValues(): Record<string, unknown> {
    if (typeof window === 'undefined') {
      return {};
    }
    try {
      const raw = localStorage.getItem(PREVIEW_VALUES_KEY); // retrieve form values from local storage
      if (!raw) {
        return {};
      }
      //convert a JSON string into a JavaScript object.
      return JSON.parse(raw) as Record<string, unknown>; // parse form values from local storage
    } catch {
      localStorage.removeItem(PREVIEW_VALUES_KEY); // remove form values from local storage
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
