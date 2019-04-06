import {Component, NgModule, NgZone, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ViewChild } from '@angular/core';
import {AgmMap, LatLng, MapsAPILoader} from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import {AgmMarker} from '@agm/core';
import {AgmCoreModule} from '@agm/core';
import {SearchFormComponent} from '../search-form/search-form.component';
import {GoogleMap, MapOptions} from '@agm/core/services/google-maps-types';

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
  private mapProp: MapOptions;
  constructor(private API_Loader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper,
              private http: HttpClient,
              private searchForm: SearchFormComponent) {
    this.apiRoot = 'http://localhost:8080';
    this.zone = zone;
    this.wrapper = wrapper;
    this.displayResponse = false;
    this.testRes = {lat: 0, lng: 0}; // <<<<<<<<<---------we need coords in this format
    this.m = JSON.parse(JSON.stringify(this.testRes));
    //
    // ***Note***
    //////////////////// START
    // We want the coordinate data passed into this method in pre-formatted as an object that is simple to JSON.stringify:
    // {lat: 33.3333, lng: 84.4444}; // <<<<<<<<<---------we need coords to be in this format, when passed into frontend
    // code from backend. Could be coming directly from db, or we could include code to extend the parser's functionality, so that
    // the coords appear in the necessary format before backend's response to front end's http post request.
    /////////////////// END
    this.initialize(this.m);
  }
  @ViewChild(AgmMap) map: AgmMap;

  ngOnInit() {

  }

  initialize(m) {
    this.API_Loader.load().then(() => {
      this.m = m;
      // ***Note***
      // We want the coordinate data passed into this method
      // pre-formatted to accommodate the JS-Object-to-JS
      // ON-string-serialization method "stringify":
      //
      // Don't worry about spaces,
      // just make sure chars are the same and in the same order ------------>>>>> {lat: 33.3333, lng: 84.4444}
      const j = JSON.stringify(this.testRes);
      console.log('line 80: agm-map.component.ts: j = ' + j + ' ,and should = "{ "lat": number, "lng": number }"');
      const k = JSON.parse(j);
      console.log('line 82: agm-map.component.ts: k = ' + k + ' ,and should = {object, Object] === Object { lat: number, lng: number }');
      console.log('line 83: agm-map.component.ts: k.lat = ' + k.lat);
      console.log('line 84: agm-map.component.ts: k.lng = ' + k.lng);
      this.latitude = this.m.lat;
      this.longitude = this.m.lng;
      console.log('line 88: agm-map.component.ts: this.latitude ' + this.latitude);
      console.log('line 89: agm-map.component.ts: this.longitude ' + this.longitude);
      this.zoom = 2;
      this.airportLatLng = new google.maps.LatLng({lat: this.m.lat, lng: this.m.lng});
      console.log('line 92: agm-map.component.ts: JSON.stringify(this.airportLatLng)) ' + JSON.stringify(this.airportLatLng));
      this.zoom = 10;
      this.marker = new google.maps.Marker({position: this.m, map: this.map});
    });
  }

  setAirportCoordinates() {
    // this.http.post(this.apiRoot + '/LongandLatfromCoords', this.searchForm.searchForm.value.airport).subscribe(
      // res => {
        this.displayResponse = true;
        this.testRes = {lat: 33.3333, lng: -84.4444};
        console.log(this.testRes);
        // res = this.testRes;
        console.log(this.testRes);
        this.m = JSON.parse(JSON.stringify(this.testRes));
        this.initialize(this.m);
      // }, err => {
       // console.error(err);
      // }
    // );
  }
}
