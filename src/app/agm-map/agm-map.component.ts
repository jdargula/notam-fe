import {Component, NgModule, NgZone, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { AgmMap, LatLng} from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import {AgmMarker} from '@agm/core';
import {AgmCoreModule} from '@agm/core';
import {SearchFormComponent} from '../search-form/search-form.component';

declare var google: any;

@Component({
  selector: 'app-agm-map',
  templateUrl: './agm-map.component.html',
  styleUrls: ['./agm-map.component.css']
})

@NgModule({
  imports: [
    AgmCoreModule
  ],
})

export class AgmMapComponent implements OnInit {
  private apiRoot: string;
  private displayResponse: boolean;
  private displayMoreDetails: boolean;
  private marker: AgmMarker;
  private airportLatLng: LatLng;
  private testRes: Object;
  constructor(private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper,
              private http: HttpClient,
              private searchForm: SearchFormComponent) {
    this.apiRoot = 'http://localhost:8080';
    this.displayResponse = false;
    this.displayMoreDetails = false;
    this.zone = zone;
    this.wrapper = wrapper;
  }
  @ViewChild(AgmMap) map: AgmMap;

  ngOnInit() {
  }

  getAirportCoordinates() {
    this.http.post(this.apiRoot + '/LongandLatfromCoords', this.searchForm.searchForm.value.airport).subscribe(
      res => {
        console.log(res);
        this.displayResponse = true;
        this.airportLatLng = new google.maps.LatLng(JSON.stringify(res));
        this.marker = new google.maps.Marker({position: {lat: this.airportLatLng.lat(), lng: this.airportLatLng.lng()}, map: this.map});
        this.displayResponse = true;
      }, err => {
        console.error(err);
      }
    );
  }
  // Code below is to test "google not defined error" before backend coords data in db is updated to JSON format.
  // Debug in browser for error with rest api call intact.
    /*this.testRes = {lat: 33.3333, lng: -84.4444};
    this.airportLatLng = new google.maps.LatLng(JSON.stringify(this.testRes));
    this.marker = new google.maps.Marker({position: {lat: this.airportLatLng.lat(), lng: this.airportLatLng.lng()}, map: this.map});
    this.displayResponse = true;
  }*/
}
