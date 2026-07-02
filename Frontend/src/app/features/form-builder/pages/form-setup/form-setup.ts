import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; //this is the form builder module for the reactive forms.
import { Router } from '@angular/router';

import { InputComponent } from '../../../../shared/components/input/input';             //input component import for the input fields.
import { Select, SelectOption } from '../../../../shared/components/select/select';    //select component import for the dropdown menu.
import { Textarea } from '../../../../shared/components/textarea/textarea';            //textarea component import for the text area.
import { IconComponent } from '../../../../shared/components/icon/icon';               //icon component import for the icons.

import { FormSetupService } from '../../services/form-setup.service';

//here interface add using FormSetupData.
import { FormSetupData, BranchOption, SectionOption, AcademicYearOption, FormStatus } from '../../models/form-setup.model';

@Component({
  selector: 'app-form-setup',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,      //this is the input component for the form
    Select,             //this is the select component for the form
    Textarea,          //this is the textarea component for the form
    IconComponent,    //this is the icon component for the form
  ],
  templateUrl: './form-setup.html',
  styleUrl: './form-setup.scss',
})
export class FormSetup implements OnInit {
  formSetupForm!: FormGroup;
  isSubmitting: boolean = false;    //inital value false for the submit button
  successMessage: string = '';      //inital value empty for the success message
  errorMessage: string = '';        //inital value empty for the error message

  branches: SelectOption[] = [];
  sections: SelectOption[] = [];
  academicYears: SelectOption[] = [];
  responsibleUsers: SelectOption[] = [];
  submittedButtonOptions: SelectOption[] = [];

  formStatuses = [
    { id: FormStatus.UNPUBLISHED, label: 'Unpublished' },
    { id: FormStatus.PUBLISHED, label: 'Published' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private formSetupService: FormSetupService,
    private router: Router
  ) {}

  //this is the ngOnInit method for the form setup page.
  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();
    this.loadSavedFormData();
  }
  //this is the initializeForm method for the form setup page.
  private initializeForm(): void {
    this.formSetupForm = this.formBuilder.group({
      formName: ['', [Validators.required, Validators.minLength(3)]],
      branch: ['', Validators.required],
      logoUrl: [''],
      section: ['', Validators.required],
      responsibleUser: ['principal', Validators.required],
      formStatus: [FormStatus.UNPUBLISHED, Validators.required],
      submittedButtonName: ['submit', Validators.required],
      defaultAcademicYear: ['', Validators.required],
      description: [''],
      successMessage: [
        'Your Inquiry Has Been Submitted Successfully!',
        Validators.required,
      ],
      confirmationMessage: [
        'Are you sure you want to submit your inquiry? Please review your details before proceeding.',
        Validators.required,
      ],
    });
  }

  private loadSavedFormData(): void {
    this.formSetupService.getFormSetupData().subscribe({
      next: (savedData) => {
        if (savedData) {
          const normalizedData = {
            ...savedData,
            branch: this.getOptionIdByValue(this.branches, savedData.branch),
            section: this.getOptionIdByValue(this.sections, savedData.section),
            defaultAcademicYear: this.getOptionIdByValue(this.academicYears, savedData.defaultAcademicYear),
          };
          this.formSetupForm.patchValue(normalizedData, { emitEvent: false });
        }
      },
    });
  }

  //this is the dropdown data loading method for the form setup page.
  private loadDropdownData(): void {
    this.formSetupService.getBranches().subscribe({
      next: (branches: BranchOption[]) => {
        this.branches = branches.map((b) => ({
          id: b.id,
          label: b.name,
        }));
      },
      error: (error) => {
        console.error('Error loading branches:', error);
      },
    });

    //this is the section data loading method for the form setup page.
    this.formSetupService.getSections().subscribe({
      next: (sections: SectionOption[]) => {
        this.sections = sections.map((s) => ({
          id: s.id,
          label: s.name,
        }));
      },
      error: (error) => {
        console.error('Error loading sections:', error);
      },
    });

    //this is the academic year data loading method for the form setup page.
    this.formSetupService.getAcademicYears().subscribe({
      next: (years: AcademicYearOption[]) => {
        this.academicYears = years.map((y) => ({
          id: y.id,
          label: y.year,
        }));
      },
      error: (error) => {
        console.error('Error loading academic years:', error);
      },
    });

//responsible user data .
    this.responsibleUsers = [
      { id: 'pricipal', label: 'Principal' },
      { id: 'teacher', label: 'Teacher' },
      { id: 'student', label: 'Student' },
    ];

//submit button data.
    this.submittedButtonOptions = [
      { id: 'submit', label: 'submit' },
      { id: 'submit_inquiry', label: 'Submit Inquiry' },
      { id: 'apply_now', label: 'Apply Now' },
      { id: 'send_application', label: 'Send Application' },
    ];
  }

  //when click on the submit button the this method call

  onSubmit(): void {
    //please require the all filed fill before the submit the form. (all filed are required)
    if (this.formSetupForm.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.isSubmitting = true;  //submit then change value as true.
    this.successMessage = '';
    this.errorMessage = '';//inital provide the empty message.

    //FormSetupData  use the interface for the form data.
    //getrawvalue:built in method for the form
    const formData: FormSetupData = {
      ...this.formSetupForm.getRawValue(),
      branch: this.getOptionLabel(this.branches, this.formSetupForm.get('branch')?.value ?? ''),
      section: this.getOptionLabel(this.sections, this.formSetupForm.get('section')?.value ?? ''),
      defaultAcademicYear: this.getOptionLabel(this.academicYears, this.formSetupForm.get('defaultAcademicYear')?.value ?? ''),
    } as FormSetupData;

    this.formSetupService.saveFormSetup(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Form setup saved successfully!';   //after form fill show the successs message...
        console.log('Form saved:', response);
        setTimeout(() => {
          this.router.navigate(['/form-builder/builder']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to save form setup. Please try again.'; //if the form not fill proper then show the error
        console.error('Error saving form:', error);
      },
    });
  }

  //when cancel button click then this method will be called
  //formSetupService:clearFormsetupData() method called and clean the form data from the local storage.
  //reset is the built in method for the form group.
  //sucessmessage and error message will be empty.
  //navigate to the home page.
  onCancel(): void {
    this.formSetupService.clearFormSetupData();
    this.formSetupForm.reset(); //when click on the cancel button here all filed will be empty..
    this.successMessage = '';
    this.errorMessage = '';
    this.router.navigate(['/']);
  }

  //when success message show then this method will be called
  //here when click on the close button then success message will be empty.
  dismissSuccess(): void {
    this.successMessage = '';
  }

  private getOptionLabel(options: SelectOption[], value: string): string {
    const normalizedValue = value?.toString().trim() ?? '';
    if (!normalizedValue) {
      return '';
    }

    const matchedOption = options.find((option) => option.id === normalizedValue);
    return matchedOption ? matchedOption.label : normalizedValue;
  }

  private getOptionIdByValue(options: SelectOption[], value: string | undefined): string {
    const normalizedValue = value?.toString().trim() ?? '';
    if (!normalizedValue) {
      return '';
    }

    const matchedOption = options.find((option) => option.label.toLowerCase() === normalizedValue.toLowerCase());
    return matchedOption ? matchedOption.id : normalizedValue;
  }

  getFormControl(controlName: string) {
    return this.formSetupForm.get(controlName);
  }

  //when the field is invalid then this method will be called
  isFieldInvalid(controlName: string): boolean {
    const field = this.getFormControl(controlName);
    return !!(field && field.invalid && field.touched);
  }
}
