import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; //Router is used to navigate between the pages and RouterLink is used to create the link to the pages.
import { IconComponent } from '../../../../shared/components/icon/icon';  //IconComponent is used to display the icons.
import { BuilderSidebar } from '../../components/builder-sidebar/builder-sidebar'; //BuilderSidebar is used to display the sidebar.
import { BuilderCanvas } from '../../components/builder-canvas/builder-canvas'; //BuilderCanvas is used to display the canvas.

@Component({
  selector: 'app-form-builder',
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    BuilderSidebar,
    BuilderCanvas,
  ],
  templateUrl: './form-builder.html',
  styleUrl: './form-builder.scss',
})
export class FormBuilderPage {
  constructor(private router: Router) {}

  onCancel(): void {
    this.router.navigate(['/form-builder/setup']);
  }

  onSaveNext(): void {
    this.router.navigate(['/form-builder/integration']);
  }
}
