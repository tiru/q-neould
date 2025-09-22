import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1JFaF5cXGRCf1NpR2NGfV5ycUVCalhSTnJfUiweQnxTdEBjUH1ecHBRRWRfVkB+WUleYg==');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
