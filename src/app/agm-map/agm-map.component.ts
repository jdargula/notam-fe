import {AfterViewInit, Component, NgModule, NgZone, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ViewChild } from '@angular/core';
import {AgmMap, LatLng, MapsAPILoader} from '@agm/core';
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
  private testRes: Object;
  private latitude: number;
  private longitude: number;
  private zoom: number;
  private m: any;
  private airportLatLng: LatLng;
  constructor(private API_Loader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper,
              private http: HttpClient,
              private searchForm: SearchFormComponent) {
    this.apiRoot = 'http://localhost:8080';
    this.displayResponse = false;
    this.displayMoreDetails = false;
    this.zone = zone;
    this.wrapper = wrapper;
    this.zone = zone;
    this.wrapper = wrapper;
    this.zone = zone;
    this.wrapper = wrapper;
    this.API_Loader.load().then(() => {
      this.map = new google.maps.Map();
    });
  }
  @ViewChild(AgmMap) map: AgmMap;

  ngOnInit() {
    this.testRes = {lat: 33.3333, lng: 84.4444};
    this.setAirportCoordinates();

  }

  setAirportCoordinates() {

    /*this.http.post(this.apiRoot + '/LongandLatfromCoords', this.searchForm.searchForm.value.airport).subscribe(
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
  }*/
  // Code above will replace code below...
  // Code below is to test "google not defined error" before backend coords data in db is updated to a JSON "parse"-able format.
  // Debug in browser for error with rest api call intact.

    this.m = JSON.parse(JSON.stringify(this.testRes));
    // ***Note***
    // We want the coordinate data passed into this method in formatted as a JSON String:
    // let j = JSON.stringify(this.testRes) = "{"lat": 33.3333, "lng": -84.4444}" <<<< like this
    // let k = JSON.parse(j) = Object { lat: 33.3333, lng: -84.4444 }; <<<< So we just parse it with JSON.parse,
    // no "JSON.stringify"-cation required, and get the lat and lng values as follows:
    this.latitude = this.m.lat;
    this.longitude = this.m.lng;
    this.airportLatLng = new google.maps.LatLng({lat: this.m.lat, lng: this.m.lng});
    this.marker = new google.maps.Marker({position: {lat: this.m.lat, lng: this.m.lng}, map: this.map});
    this.displayResponse = true;
    this.map = new google.maps.Map();
  }
}
