import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MaterialDocsApp} from './material-docs-app';
import {MATERIAL_DOCS_ROUTES} from './routes';
import {NavBarModule} from './shared/navbar';
import { MarkdownModule } from 'ngx-markdown';

import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(MATERIAL_DOCS_ROUTES, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'corrected'
    }),
    NavBarModule,
    MarkdownModule.forRoot()
  ],
  declarations: [MaterialDocsApp],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [MaterialDocsApp],
})
export class AppModule {}
