import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';  //DragDropModule is an Angular module that provides all the drag-and-drop functionality.
import { FIELD_PALETTE, PaletteItem } from '../../models/form-field.model';
import { FormBuilderStateService } from '../../services/form-builder';
@Component({
  selector: 'app-builder-sidebar',
  imports: [CommonModule, FormsModule, MatIconModule, DragDropModule],  //imports the modules that are needed for the builder sidebar.
  templateUrl: './builder-sidebar.html',
  styleUrl: './builder-sidebar.scss',
})
export class BuilderSidebar {
  @Input() connectedDropListId = 'canvas-drop-list';

  searchQuery = ''; //search for the sidebar here initailize the search query.
  readonly palette = FIELD_PALETTE;    // only read cannot be modified.

  constructor(private formBuilderState: FormBuilderStateService) {}

  get filteredPalette(): PaletteItem[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.palette;
    return this.palette.filter((item) => item.label.toLowerCase().includes(q));
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  onPaletteDrop(_event: CdkDragDrop<PaletteItem[]>): void {
    // Drops back onto palette are ignored; canvas handles new field creation.
  }

  addFieldByClick(item: PaletteItem, event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('.cdk-drag-dragging')) return;
    this.formBuilderState.addField(item.type);
  }
}
