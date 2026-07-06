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
  errors: Record<string, string> = {};

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
    if (this.errors[fieldId]) {
      delete this.errors[fieldId];
    }
  }

  onFileSelected(fieldId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.formValues[fieldId] = {
        name: file.name,
        size: file.size
      };
      if (this.errors[fieldId]) {
        delete this.errors[fieldId];
      }
    }
  }

  getUploadedFileName(val: any): string {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null && 'name' in val) {
      return val.name;
    }
    return '';
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    for (const field of this.fields) {
      const value = this.formValues[field.id];
      
      // Required Validation
      if (field.required) {
        let isEmpty = false;
        if (value === undefined || value === null) {
          isEmpty = true;
        } else if (typeof value === 'string' && value.trim() === '') {
          isEmpty = true;
        } else if (Array.isArray(value) && value.length === 0) {
          isEmpty = true;
        } else if (typeof value === 'boolean' && !value) {
          isEmpty = true;
        } else if (typeof value === 'object' && value !== null) {
          isEmpty = Object.values(value).every(v => !v);
        }

        if (isEmpty) {
          this.errors[field.id] = 'This field is required.';
          isValid = false;
          continue;
        }
      }

      // Format & Value Validation
      if (value !== undefined && value !== null && value !== '') {
        const rules = field.validationRules;
        if (rules) {
          // Text rules
          if (field.type === FieldType.SINGLE_LINE || field.type === FieldType.PARAGRAPH) {
            const strVal = String(value);
            if (rules.minLength && strVal.length < rules.minLength) {
              this.errors[field.id] = `Must be at least ${rules.minLength} characters.`;
              isValid = false;
            }
            if (rules.maxLength && strVal.length > rules.maxLength) {
              this.errors[field.id] = `Must not exceed ${rules.maxLength} characters.`;
              isValid = false;
            }
            
            if (rules.patternType && rules.patternType !== 'none') {
              if (rules.patternType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
                this.errors[field.id] = 'Please enter a valid email address.';
                isValid = false;
              } else if (rules.patternType === 'url') {
                let validUrl = false;
                try {
                  new URL(strVal);
                  validUrl = true;
                } catch {}
                if (!validUrl) {
                  this.errors[field.id] = 'Please enter a valid URL.';
                  isValid = false;
                }
              } else if (rules.patternType === 'phone' && !/^\+?[0-9\s\-()]{7,15}$/.test(strVal)) {
                this.errors[field.id] = 'Please enter a valid phone number.';
                isValid = false;
              } else if (rules.patternType === 'custom' && rules.customRegex) {
                try {
                  const regex = new RegExp(rules.customRegex);
                  if (!regex.test(strVal)) {
                    this.errors[field.id] = rules.customErrorMessage || 'Invalid format.';
                    isValid = false;
                  }
                } catch {
                  console.warn('Invalid custom regex pattern:', rules.customRegex);
                }
              }
            }
          }

          // File upload rules
          if (field.type === FieldType.UPLOAD_FILE && typeof value === 'object' && value !== null) {
            const fileObj = value as { name?: string; size?: number };
            if (fileObj.name) {
              if (rules.allowedExtensions) {
                const parts = fileObj.name.split('.');
                const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
                const allowed = rules.allowedExtensions.split(',').map(x => x.trim().toLowerCase());
                if (!allowed.includes(ext)) {
                  this.errors[field.id] = `Allowed extensions are: ${rules.allowedExtensions}`;
                  isValid = false;
                }
              }
              if (rules.maxFileSize && fileObj.size) {
                const maxBytes = rules.maxFileSize * 1024 * 1024;
                if (fileObj.size > maxBytes) {
                  this.errors[field.id] = `File size must not exceed ${rules.maxFileSize} MB.`;
                  isValid = false;
                }
              }
            }
          }
        }
      }
    }

    return isValid;
  }

  //submit the form to the backend.
  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.validateForm()) {
      this.errorMessage = 'Please resolve the validation errors before submitting.';
      return;
    }

    this.isSubmitting = true;

    //build the submission data with field labels as keys for readability.
    const submittedData: Record<string, any> = {};
    for (const field of this.fields) {
      const key = field.label || field.id;
      const value = this.formValues[field.id];
      if (field.type === FieldType.UPLOAD_FILE && value && typeof value === 'object') {
        submittedData[key] = (value as { name: string }).name || '';
      } else {
        submittedData[key] = value;
      }
    }

    this.formSubmissionService.submitForm(this.currentFormName, submittedData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Form submitted successfully!';
        this.errors = {};
        //auto-dismiss success message after 5 seconds.
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 422 && err.error && err.error.errors) {
          const beErrors = err.error.errors as Record<string, string>;
          this.errorMessage = 'Validation failed on the server.';
          for (const field of this.fields) {
            const key = field.label || field.id;
            if (beErrors[key]) {
              this.errors[field.id] = beErrors[key];
            }
          }
        } else {
          this.errorMessage = 'Failed to submit form. Please try again.';
        }
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
