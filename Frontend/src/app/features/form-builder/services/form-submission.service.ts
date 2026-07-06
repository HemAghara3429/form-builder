import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FormSubmissionPayload {
  form_name: string;
  submitted_data: Record<string, any>;
}

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
  private readonly API_URL = 'http://localhost:8000/api/form-submissions';

  constructor(private readonly http: HttpClient) { }

  submitForm(formName: string, submittedData: Record<string, any>): Observable<FormSubmissionResponse> {
    const payload: FormSubmissionPayload = {
      form_name: formName,
      submitted_data: submittedData,
    };
    return this.http.post<FormSubmissionResponse>(this.API_URL, payload);
  }
}
