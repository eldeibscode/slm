import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Register AG Grid modules before application bootstrap
import './app/components/ag-grid/ag-grid.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
