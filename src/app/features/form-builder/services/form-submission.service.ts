import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//Interface for the submission payload sent to the backend.
export interface FormSubmissionPayload {
  form_name: string;
  submitted_data: Record<string, any>;
}

//Interface for the response received from the backend after saving.
export interface FormSubmissionResponse {
  message: string;
  data: {
    id: number;
    form_name: string;
    submitted_data: Record<string, any>;
    created_at: string;
    updated_at: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FormSubmissionService {
  //backend API base URL (Laravel server running on port 8000).
  private readonly API_URL = 'http://localhost:8000/api/form-submissions';

  constructor(private readonly http: HttpClient) {}

  //Submit the form data to the backend.
  //formName: the name of the form being submitted.
  //submittedData: key-value pairs of field id to user-entered value.
  submitForm(formName: string, submittedData: Record<string, any>): Observable<FormSubmissionResponse> {
    const payload: FormSubmissionPayload = {
      form_name: formName,
      submitted_data: submittedData,
    };
    return this.http.post<FormSubmissionResponse>(this.API_URL, payload);
  }
}
