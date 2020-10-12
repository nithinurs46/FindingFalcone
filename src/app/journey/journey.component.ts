import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Planet } from '../model/planet';
import { Vehicle } from '../model/vehicle';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { JourneyPath } from '../model/journey-path';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent implements OnInit {
  @Input('planet')
  planets: Planet[];

  @Input('allPlanets')
  allPlanets: Planet[];

  @Input('vehicle')
  vehicles: Vehicle[];

  @Input('count')
  count: number;

  @Output()
  private formReady: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  form: FormGroup;
  planetName: '';
  vehicleName: '';
  selectedPlanetName: string;
  disabledValue: boolean = false;
  disableVehicle = false;
  errorMsg: string;
  showVehicleErrMsg: boolean = false;

  @Output() journeyPath = new EventEmitter<JourneyPath>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      "planetName": new FormControl("", Validators.required),
      "vehicleName": new FormControl("", Validators.required),
      selectedPlanetName: [""]
    });
  }

  ngOnInit() {
    this.formReady.emit(this.form);
  }

  onVehicleSelection() {
    this.showVehicleErrMsg = false;
    this.form.controls['selectedPlanetName'].disable();
    this.selectedPlanetName = this.form.value.planetName;
    this.form.patchValue({
      selectedPlanetName: this.selectedPlanetName
    });
    if (this.checkFeasibility()) {
      const journey = new JourneyPath(
        this.count,
        this.form.value.planetName,
        this.form.value.vehicleName
      );
      this.journeyPath.emit(journey);
    }
    return;
  }

  checkFeasibility(): any {
    const planetName = this.form.value.planetName;
    const vehicleName = this.form.value.vehicleName;
    const planet: Planet = this.allPlanets.find(p => p.name === planetName);
    const vehicle: Vehicle = this.vehicles.find(v => v.name === vehicleName);
    if (vehicle.max_distance < planet.distance) {
      this.errorMsg = 'Vehicle cannot travel to ' + planetName + ' , please try with different vehicle.'
      this.showVehicleErrMsg = true;
      return false;
    }
    return true;
  }
}


