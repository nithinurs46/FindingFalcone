import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { JourneyComponent } from './journey.component';

@NgModule({
  declarations: [JourneyComponent],
  imports: [
    SharedModule,
  ],
  exports: [
    JourneyComponent
  ]
})
export class JourneyModule { }
