import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { FieldCard } from '../field-card/field-card';
import { FormField, PaletteItem } from '../../models/form-field.model';
import { FormBuilderStateService } from '../../services/form-builder';

@Component({
  selector: 'app-builder-canvas',
  imports: [CommonModule, DragDropModule, FieldCard],
  templateUrl: './builder-canvas.html',
  styleUrl: './builder-canvas.scss',
})
export class BuilderCanvas implements OnInit, OnDestroy {
  fields: FormField[] = []; //fields is an array that stores all the form fields added to the canvas.
  previewUrl = 'http://localhost:4200/form-builder/preview';
  private sub?: Subscription;

  trackByFieldId(_index: number, field: FormField): string {
    return field.id;
  }

  constructor(private formBuilderState: FormBuilderStateService) {}

  ngOnInit(): void {
    this.sub = this.formBuilderState.fields$.subscribe((fields) => {
      this.fields = fields;
    });
    if (typeof window !== 'undefined') {
      this.previewUrl = `${window.location.origin}/form-builder/preview`;
    }
  }

  openPreview(): void {
    try {
      localStorage.setItem('form-builder-fields', JSON.stringify(this.fields));
    } catch {}
    // open in new tab
    window.open(this.previewUrl, '_blank', 'noopener,noreferrer');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // preview handled via link to separate tab

  onDrop(event: CdkDragDrop<FormField[]>): void {
    const dragEvent = event as CdkDragDrop<FormField[] | PaletteItem[]>;
    if (dragEvent.previousContainer === dragEvent.container) {
      if (dragEvent.previousIndex !== dragEvent.currentIndex) {
        this.formBuilderState.reorderFields(
          dragEvent.previousIndex,
          dragEvent.currentIndex
        );
      }
      return;
    }

    const paletteItem = dragEvent.item.data as PaletteItem;
    if (paletteItem?.type) {
      this.formBuilderState.addField(paletteItem.type, dragEvent.currentIndex);
    }
  }

  //onchange event is used to update the field in the canvas.
  onFieldChange(id: string, changes: Partial<FormField>): void {
    this.formBuilderState.updateField(id, changes);
  }

  //onDuplicate event is used to duplicate the field in the canvas.
  onDuplicate(id: string): void {
    this.formBuilderState.duplicateField(id);
  }

  //onRemove event is used to remove the field in the canvas.
  onRemove(id: string): void {
    this.formBuilderState.removeField(id);
  }

  //onAddOption event is used to add the option in the field in the canvas.
  onAddOption(fieldId: string): void {
    this.formBuilderState.addOption(fieldId);
  }

  //onUpdateOption event is used to update the option in the field in the canvas.
  onUpdateOption(fieldId: string, data: { optionId: string; label: string }): void {
    this.formBuilderState.updateOption(fieldId, data.optionId, data.label);
  }

  //onRemoveOption event is used to remove the option in the field in the canvas.
  onRemoveOption(fieldId: string, optionId: string): void {
    this.formBuilderState.removeOption(fieldId, optionId);
  }
}
