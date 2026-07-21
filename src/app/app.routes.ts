import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard',
  },
  {
    path: 'data-grid',
    loadComponent: () => import('./features/data-grid/data-grid').then((m) => m.DataGrid),
    title: 'Data Grid',
  },
  {
    path: 'forms',
    loadComponent: () =>
      import('./features/forms-showcase/forms-showcase').then((m) => m.FormsShowcase),
    title: 'Forms',
  },
  {
    path: 'components',
    loadComponent: () =>
      import('./features/components-gallery/components-gallery').then(
        (m) => m.ComponentsGallery,
      ),
    title: 'Components',
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
