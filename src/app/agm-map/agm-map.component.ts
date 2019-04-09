import {Component, NgModule, NgZone, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ViewChild } from '@angular/core';
import {AgmFitBounds, AgmMap, FitBoundsDetails, LatLng, LatLngBounds, LatLngBoundsLiteral, LatLngLiteral, MapsAPILoader} from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import {AgmMarker} from '@agm/core';
import {AgmCoreModule} from '@agm/core';
import {SearchFormComponent} from '../search-form/search-form.component';

import {GoogleMap, MapOptions} from '@agm/core/services/google-maps-types';
import {FitBoundsService} from '@agm/core/services/fit-bounds';

declare var google: any;
const icao = require('icao');

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
  private radius: number;
  private color: string;
  private m: any;
  private airportLatLng: LatLng;
  private airportCode: string;
  private type: string;
  /**
   * If we wanted to update the default fitBounds,
   * we could do so by changing the values of
   * the 4 'readonly' variables below.
   */
  private readonly top_DEFAULT: 24.7433195; // north lat
  private readonly bottom_DEFAULT: 49.3457868; // south lat
  private readonly left_DEFAULT: -124.7844079; // west long
  private readonly right_DEFAULT: -66.9513812; // east long
  private latLngBounds_DEFAULT: LatLngBoundsLiteral = {
    north: this.top_DEFAULT,
    south: this.bottom_DEFAULT,
    west: this.left_DEFAULT,
    east: this.right_DEFAULT
  };
  private bottom: number;
  private left: number;
  private top: number;
  private right: number;
  /*private latLngBounds: LatLngBounds = {

  };*/
  private icaoConversion: string;
  private coordsArray: Array<object>;
  private coordsArray_lat: object;
  private coordsArray_lng: object;
  private maxWidth: number;
  constructor(private API_Loader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper,
              private http: HttpClient,
              private searchForm: SearchFormComponent) {
    this.apiRoot = 'http://localhost:8080';
    this.zone = zone;
    this.displayResponse = false;
    this.testRes = {lat: 41.4925, lng: -99.9018};
    this.color = 'red';
    this.radius = 5000;
    this.wrapper = wrapper;
    this.m = JSON.parse(JSON.stringify(this.testRes));
    this.API_Loader.load().then(() => {
      this.latitude = Math.round(parseFloat(this.m.lat) * 10000) / 10000;
      this.longitude = Math.round(parseFloat(this.m.lng) * 10000) / 10000;
      this.airportLatLng = new google.maps.LatLng({lat: this.latitude, lng: this.longitude});
      this.zoom = 3;
    });
  }
  @ViewChild(AgmMap) map: AgmMap;

  ngOnInit() {
  }

  initialize(m) {
    this.API_Loader.load().then(() => {
      this.m = m;
      console.log(m);
      this.latitude = Math.round(parseFloat(this.m.lat) * 10000) / 10000;
      this.longitude = Math.round(parseFloat(this.m.lng) * 10000) / 10000;
      console.log('this.latitude = ' + this.latitude);
      console.log('this.longitude = ' + this.longitude);
      this.airportLatLng = new google.maps.LatLng({lat: this.latitude, lng: this.longitude});
      this.zoom = 3;
      this.maxWidth = 500;
      this.marker = new google.maps.Marker({position: this.m, map: this.map});
    });
  }

  setAirportCoordinates() {
    if (this.searchForm.searchForm.value.airport.length === 3) {
      this.searchForm.searchForm.value.airport = '!'
        + this.searchForm.searchForm.value.airport[0]
        + this.searchForm.searchForm.value.airport[1]
        + this.searchForm.searchForm.value.airport[2];
    }
    this.icaoConversion = 'K'
      + this.searchForm.searchForm.value.airport[1]
      + this.searchForm.searchForm.value.airport[2]
      + this.searchForm.searchForm.value.airport[3];
    this.searchForm.searchForm.value.airport = this.searchForm.searchForm.value.airport.toUpperCase();
    this.airportCode = this.searchForm.searchForm.value.airport;
    this.type = this.searchForm.searchForm.value.type;
    // marker colors will be coded according to type.Two additional
    // types will populate the map when user conducts a query search:
    // (1) "no notams found," and (2) Type not specified by user.
    this.icaoConversion = this.icaoConversion.toUpperCase();
    // Info from http post call below is not being used at this time, due to current formatting of lat and lng values in our db.
    // Workaround discovered is the "icao" npm imported node package module. Although this limits functionality
    // of our app to some extent, the icao package works great for our needs at this time.
    this.http.post(this.apiRoot + '/LongandLatfromCoords', this.searchForm.searchForm.value.airport).subscribe(
       res => {
        this.displayResponse = true;
        this.coordsArray = icao[this.icaoConversion];
        this.coordsArray_lat = this.coordsArray[0];
        this.coordsArray_lng = this.coordsArray[1];
        this.testRes = {lat: this.coordsArray_lat, lng: this.coordsArray_lng};
        console.log(this.testRes);
        res = this.testRes;
        console.log(this.testRes);
        this.m = JSON.parse(JSON.stringify(res));
        console.log(this.m);
        this.zoom = 2;
        this.initialize(this.m);
      }, err => {
         console.error(err);
      }
    );
  }
}
