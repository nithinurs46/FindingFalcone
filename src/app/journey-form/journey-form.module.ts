import { NgModule } from '@angular/core';
import { JourneyFormComponent } from './journey-form.component';
import { SharedModule } from '../shared/shared.module';
import { JourneyModule } from '../journey/journey.module';

@NgModule({
  declarations: [JourneyFormComponent],
  imports: [
    SharedModule,
    JourneyModule
  ],
  exports: [
    JourneyFormComponent,
  ]
})
export class JourneyFormModule { }
