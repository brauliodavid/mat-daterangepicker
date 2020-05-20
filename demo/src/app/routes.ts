import {Routes} from '@angular/router';

export const MATERIAL_DOCS_ROUTES: Routes = [
  {
    path: '', pathMatch: 'full',
    loadChildren: () => import('./pages/homepage').then(m => m.HomepageModule)
  },
  {path: '**', redirectTo: ''},
];
