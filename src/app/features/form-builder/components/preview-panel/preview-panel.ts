import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { FIELD_TYPE_LABELS, FieldType, FormField } from '../../models/form-field.model';
import { FormSetupService } from '../../services/form-setup.service';
import { FormSubmissionService } from '../../services/form-submission.service';

@Component({
  selector: 'app-preview-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './preview-panel.html',
  styleUrl: './preview-panel.scss',
})
export class PreviewPanel implements OnChanges {
  @Input() fields: FormField[] = [];
  readonly FieldType = FieldType;

  //track user-entered values for each field by field id.
  formValues: Record<string, any> = {};

  //submission state flags.
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  //store the current form name for the submission payload.
  private currentFormName = 'Untitled Form';

  constructor(
    private readonly formSetupService: FormSetupService,
    private readonly formSubmissionService: FormSubmissionService
  ) {}

  get formName$() {
    return this.formSetupService
      .getFormSetupData()
      .pipe(map((data) => {
        this.currentFormName = data?.formName?.trim() || 'Untitled Form';
        return this.currentFormName;
      }));
  }

  //when new fields arrive, initialize values for any new fields.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.initializeFormValues();
    }
  }

  //set up default empty values for each field based on its type.
  private initializeFormValues(): void {
    for (const field of this.fields) {
      if (!(field.id in this.formValues)) {
        switch (field.type) {
          case FieldType.CHECKBOX:
            //checkbox stores an object of option id => boolean.
            this.formValues[field.id] = {};
            for (const opt of field.options) {
              this.formValues[field.id][opt.id] = false;
            }
            break;
          case FieldType.RATING_STAR:
          case FieldType.RATING_NUMBER:
            this.formValues[field.id] = 0;
            break;
          case FieldType.TERMS_CONDITION:
            this.formValues[field.id] = false;
            break;
          default:
            this.formValues[field.id] = '';
            break;
        }
      }
    }
  }

  //handle star rating click.
  setRating(fieldId: string, value: number): void {
    this.formValues[fieldId] = value;
  }

  //handle number rating click.
  setNumberRating(fieldId: string, value: number): void {
    this.formValues[fieldId] = value;
  }

  //toggle a checkbox option value.
  toggleCheckbox(fieldId: string, optionId: string): void {
    if (!this.formValues[fieldId]) {
      this.formValues[fieldId] = {};
    }
    this.formValues[fieldId][optionId] = !this.formValues[fieldId][optionId];
  }

  //submit the form to the backend.
  onSubmit(): void {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    //build the submission data with field labels as keys for readability.
    const submittedData: Record<string, any> = {};
    for (const field of this.fields) {
      const key = field.label || field.id;
      submittedData[key] = this.formValues[field.id];
    }

    this.formSubmissionService.submitForm(this.currentFormName, submittedData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Form submitted successfully!';
        //auto-dismiss success message after 5 seconds.
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to submit form. Please try again.';
        console.error('Form submission error:', err);
        //auto-dismiss error message after 5 seconds.
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      },
    });
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }

  dismissError(): void {
    this.errorMessage = '';
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
