import {Component, NgModule, NgZone, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ViewChild } from '@angular/core';
import {AgmMap, LatLng, MapsAPILoader} from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import {AgmMarker} from '@agm/core';
import {AgmCoreModule} from '@agm/core';
import {SearchFormComponent} from '../search-form/search-form.component';
import {GoogleMap} from '@agm/core/services/google-maps-types';

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
    this.zone = zone;
    this.wrapper = wrapper;
    this.displayResponse = false;
    this.testRes = {lat: 33.3333, lng: -84.4444}; // <<<<<<<<<---------we need coords in this format
    this.API_Loader.load().then(() => {
      this.m = JSON.parse(JSON.stringify(this.testRes));
      // ***Note***
      // We want the coordinate data passed into this method in pre-formatted as an object that is simple to JSON.stringify:
      // let j = JSON.stringify(this.testRes) = "{"lat": 33.3333, "lng": -84.4444}" <<<< like this
      // let k = JSON.parse(j) = Object { lat: 33.3333, lng: -84.4444 }; <<<< So we just parse it with JSON.parse,
      // no "JSON.stringify"-cation required, and get the lat and lng values as follows:
      this.latitude = this.m.lat;
      this.longitude = this.m.lng;
      this.zoom = 10;
      this.airportLatLng = new google.maps.LatLng({lat: this.m.lat, lng: this.m.lng});
      this.marker = new google.maps.Marker({position: {lat: this.m.lat, lng: this.m.lng}, map: this.map});
      this.initialize(this.airportLatLng, this.zoom, this.map);
    });
  }
  @ViewChild(AgmMap) map: GoogleMap;

  ngOnInit() {

  }

  initialize(airportLatLng, zoom, map) {
    this.airportLatLng = airportLatLng;
    this.zoom = zoom;
    this.map = map;
    const mapProp = {
      center: this.airportLatLng,
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapProp);
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
  // Code below is to test "google not defined error" before backend coords data in db is updated to a JSON "stringify"-able format.
  // Debug in browser for error with rest api call intact.
    this.API_Loader.load().then(() => {
      this.testRes = { lat: 33.3333, lng: 84.4444 };
      console.log(this.testRes);
      this.m = JSON.parse(JSON.stringify(this.testRes));
      console.log('line 100: agm-map.component.ts: this.m = ' + JSON.stringify(this.airportLatLng));
      // ***Note***
      // We want the coordinate data passed into this method pre-formatted to accommodate the
      // JS-Object-to-JSON-string-serialization method "stringify":
      // like this. Don't worry about spaces, just make sure chars are the same------------>>>>> { lat: 33.3333, lng: 84.4444 };
      let j = JSON.stringify(this.testRes); // = "{"lat": 33.3333, "lng": -84.4444}" <<<< like this
      console.log('line 103: agm-map.component.ts: j = ' + j + ' ,and should = "{ "lat": 33.3333, "lng": 84.4444 }"');
      let k = JSON.parse(j); // = Object { lat: 33.3333, lng: -84.4444 }; <<<< So we just parse it with JSON.parse,
      console.log('line 105: agm-map.component.ts: k = ' + k + ' ,and should = {object, Object] === Object { lat: 33.3333, lng: 84.4444 }');
      console.log('line 105: agm-map.component.ts: k.lat = ' + k.lat + ' ,and should = 33.3333');
      console.log('line 105: agm-map.component.ts: k.lng = ' + k.lng + ' ,and should = 84.4444');
      // no "JSON.stringify"-cation required, and get the lat and lng values as follows:
      this.latitude = this.m.lat;
      this.longitude = this.m.lng;
      console.log('line 109: agm-map.component.ts: this.latitude ' + this.latitude);
      console.log('line 110: agm-map.component.ts: this.longitude ' + this.longitude);
      this.zoom = 2;
      this.airportLatLng = new google.maps.LatLng({lat: this.m.lat, lng: this.m.lng});
      console.log('line 113: agm-map.component.ts: JSON.stringify(this.airportLatLng)) ' + JSON.stringify(this.airportLatLng));
      this.marker = new google.maps.Marker({position: {lat: this.m.lat, lng: this.longitude}, map: this.m.lng});
      this.initialize(this.airportLatLng, this.zoom, this.map);
    });
  }
}
