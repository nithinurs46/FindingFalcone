import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../model/vehicle';
import { Planet } from '../model/planet';

@Injectable({
  providedIn: 'root'
})
export class FalconeService {

  tokenUrl:string   = "https://findfalcone.herokuapp.com/token";
  planetUrl:string  = "https://findfalcone.herokuapp.com/planets";
  vehicleUrl:string = "https://findfalcone.herokuapp.com/vehicles";
  findUrl:string    = "https://findfalcone.herokuapp.com/find";

  constructor(private http: HttpClient) { }

  getToken(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Accept: "application/json",
      })
    };
    return this.http.post<string>(this.tokenUrl, "", options);
  }

  getPlanets(): Observable<any> {
    return this.http.get<Planet>(this.planetUrl);
  }

  getVehicles(): Observable<any> {
    return this.http.get<Vehicle>(this.vehicleUrl);
  }

  findFalcone(falconeForm, token, sizeOfJourney:number): Observable<any> {
    let selectedPlanets = new Array();
    let selectedVehicles = new Array();
    for(var i:number=1;i<=sizeOfJourney;i++){
      selectedPlanets.push(falconeForm.controls[i].value.planetName);
      selectedVehicles.push(falconeForm.controls[i].value.vehicleName);
    }
    const options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "content-Type": "application/json"
      })
    };
    return this.http.post(`${this.findUrl}` , {
      token: token,
      planet_names: selectedPlanets,
      vehicle_names: selectedVehicles,
    }, options);
  }
}
