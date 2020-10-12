import { Component, OnInit, Input } from '@angular/core';
import { NavbarService } from '../service/navbar.service';
import { FalconeService } from '../service/falcone.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Planet } from '../model/planet';
import { Vehicle } from '../model/vehicle';
import { JourneyPath } from '../model/journey-path';

@Component({
  selector: 'app-journey-form',
  templateUrl: './journey-form.component.html',
  styleUrls: ['./journey-form.component.css']
})
export class JourneyFormComponent implements OnInit {

  @Input() deviceXs: boolean;

  token: string = "";

  constructor(public nav: NavbarService, private svc: FalconeService, private fb: FormBuilder,
    private router: Router) {
    this.resetForm();
  }
  planets: Planet[] = [];
  vehicles: Vehicle[] = [];
  remainingPlanets: Planet[] = [];
  planetColumns: string[] = ['name', 'distance'];
  vehicleColumns: string[] = ['name', 'total_no', 'max_distance', 'speed'];
  falconeForm: FormGroup;
  timeTaken: number = 0;

  selectedDistance = new Array();
  selectedSpeed = new Array();
  selectedMaxDist = new Array();

  disableFind: boolean = true;

  journeyPaths: JourneyPath[] = [];
  selectedJourneys: JourneyPath[] = [];

  mySubscription: any;

  sizeOfJourney: number = 0;

  ngOnInit() {
    this.falconeForm = this.fb.group({
    });
    this.nav.show();
    this.fetchAPIToken();
    this.fetchPlanets();
    this.fetchVehicles();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  fetchAPIToken() {
    this.svc.getToken().subscribe((response) => {
      this.token = response.token;
    });
  }

  fetchPlanets() {
    this.svc.getPlanets().subscribe((response) => {
      this.planets = response;
      this.remainingPlanets = response;
    });
  }

  fetchVehicles() {
    this.svc.getVehicles().subscribe((response) => {
      this.vehicles = response;
    })
  }

  private addFormControl(name: string, formGroup: FormGroup): void {
    this.falconeForm.addControl(name, formGroup);
    this.sizeOfJourney++;
  }

  updateJourney(journey: JourneyPath) {
    this.arrangeDestinations(journey);
    this.arrangeAvailableVehicles(journey);
    this.arrangeAvailablePlanets(journey);
    this.timeTaken = this.calculateTimeTaken();
    if (this.selectedJourneys.length > 3) {
      this.disableFind = false;
    }
  }

  arrangeDestinations(journey: JourneyPath) {
    if (this.selectedJourneys.find(
      destination =>
        destination.destinationNumber ===
        journey.destinationNumber
    )
    ) {
      this.selectedJourneys = this.selectedJourneys.filter(
        destination =>
          destination.destinationNumber !==
          journey.destinationNumber
      );
    }
    this.selectedJourneys = [
      ...this.selectedJourneys,
      journey
    ];
  }

  arrangeAvailableVehicles(journey: JourneyPath) {
    this.vehicles.map((vehicle: Vehicle) => {
      if (
        vehicle.name === journey.vehicleName &&
        vehicle.total_no > 0
      ) {
        vehicle.total_no--;
      }
    });
  }

  arrangeAvailablePlanets(journey: JourneyPath) {
    this.remainingPlanets = this.remainingPlanets.filter(
      planet => planet.name !== journey.planetName
    );
  }

  calculateTimeTaken() {
    let timeTaken = 0;
    this.selectedJourneys.map((journey: JourneyPath) => {
      const planet = this.planets.find(
        singlePlanet => singlePlanet.name === journey.planetName
      );
      const vehicle = this.vehicles.find(
        singleVehicle => singleVehicle.name === journey.vehicleName
      );
      timeTaken += planet.distance / vehicle.speed;
    });
    return timeTaken;
  }

  findFalcone() {
    this.svc.findFalcone(this.falconeForm, this.token, this.sizeOfJourney).subscribe((response) => {
      if (response.status) {
        this.router.navigate(['/result'], { queryParams: { status: response.status, planet: response.planet_name, time: this.timeTaken } });
      }
    });

  }

  resetForm() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }
}
