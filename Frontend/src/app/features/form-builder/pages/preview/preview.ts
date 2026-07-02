import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PreviewPanel } from '../../components/preview-panel/preview-panel';
import { FormField } from '../../models/form-field.model';
import { FormBuilderStateService } from '../../services/form-builder';

@Component({
  selector: 'app-preview',
  imports: [CommonModule, PreviewPanel],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
})
export class Preview implements OnInit, OnDestroy {
  fields: FormField[] = [];
  private sub?: Subscription;

  constructor(private readonly formBuilderState: FormBuilderStateService) {}

  ngOnInit(): void {
    this.sub = this.formBuilderState.fields$.subscribe((fields) => {
      this.fields = fields;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
