import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './error/http-error-interceptor';
import { ErrorDialogComponent } from './dialog/error-dialog/error-dialog.component';
import { JourneyFormModule } from './journey-form/journey-form.module';
import { WelcomeModule } from './welcome/welcome.module';
import { SharedModule } from './shared/shared.module';
import { ResultModule } from './result/result.module';

@NgModule({
  declarations: [
    AppComponent,
    ErrorDialogComponent
  ],
  imports: [
    SharedModule,
    WelcomeModule,
    JourneyFormModule,
    ResultModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],

  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent]

})
export class AppModule { }
