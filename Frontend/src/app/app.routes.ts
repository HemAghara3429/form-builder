import { Routes } from '@angular/router';
import { FormSetup } from './features/form-builder/pages/form-setup/form-setup';
import { FormBuilderPage } from './features/form-builder/pages/form-builder/form-builder';
import { Preview } from './features/form-builder/pages/preview/preview';

export const routes: Routes = [
  {
    path: 'form-builder',
    children: [
      {
        path: 'setup',
        component: FormSetup,
      },
      {
        path: 'builder',
        component: FormBuilderPage,
      },
      {
        path: 'preview',
        component: Preview,
      },
      {
        path: '',
        redirectTo: 'setup',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'form-builder/setup',
    pathMatch: 'full',
  },
];
