import { Component, NgModule, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { AgmMap, LatLng, LatLngBoundsLiteral, MapsAPILoader } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { AgmMarker } from '@agm/core';
import { AgmCoreModule } from '@agm/core';
import { SearchFormComponent } from '../search-form/search-form.component';
import {InfoWindow, Marker} from '@agm/core/services/google-maps-types';

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
  private marker: any;
  private airportCoords: Object;
  private latitude: number;
  private longitude: number;
  private zoom: number;
  private radius: number;
  private color: string;
  private m: any;
  private airportLatLng: LatLng;
  private airportCode: string;
  private type: string;
  private markers: Array<any> = [];
  private latitude_infoWindow: number;
  private longitude_infoWindow: number;
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
    east: this.right_DEFAULT,
  };
  private bottom: number;
  private left: number;
  private top: number;
  private right: number;
  private icaoConversion: string;
  private coordsArray: Array<object>;
  private coordsArray_lat: object;
  private coordsArray_lng: object;
  private maxWidth: number;
  private typeOfNotamArrayOnInit: any[];
  private notams: any;
  private airportCodesArrayOnInit: any[];
  constructor(private API_Loader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper,
              private http: HttpClient,
              private searchForm: SearchFormComponent) {
    this.apiRoot = 'http://localhost:8080';
    this.zone = zone;
    this.displayResponse = false;
    this.wrapper = wrapper;
  }
  @ViewChild(AgmMap) map: AgmMap;

  ngOnInit() {
    this.displayAllActiveNOTAMs();
  }

  displayAllActiveNOTAMs() {
    this.API_Loader.load().then(() => {
        this.http.post(this.apiRoot + '/GetAllNotams', 'IATA/ICAO').subscribe(
          res => {
            console.log(res);
            console.log(JSON.stringify(res));
            this.notams = res;
            const notamKeyOnInit = [];
            const airportCodesOnInit = [];
            const typeOfNotamOnInit = [];
            let initAirportCode = '';
            let initNotamType = '';
            console.log(this.searchForm.notams);
            /**
             * ***Note: The fact that the frontend client makes the request by http to post all of the data
             * for rendering at runtime, storing the data locally in multiple arrays, would not be considered
             * good practice in data-intensive cases. In an implementation mindful of a user's resources for
             * storage, old notam data would likely be stored in some separate archival backend that makes
             * only a fraction of the calls to our app's backend compared to requests made by the frontend).
             * With this current implementation, the user's device would be responsible for caching
             * the data and then the app could be set to purge the data when the user log's off,
             * or refreshes the cache when submitting a query for updated NOTAM data.
             */
            this.notams.forEach(function (notam) {
              notamKeyOnInit.push(notam.col1);
              initAirportCode = notam.col2;
              airportCodesOnInit.push(initAirportCode);
              initNotamType = notam.col3;
              typeOfNotamOnInit.push(initNotamType);
            });
            this.airportCodesArrayOnInit = airportCodesOnInit;
            console.log(this.airportCodesArrayOnInit);
            this.typeOfNotamArrayOnInit = typeOfNotamOnInit;
            console.log(this.typeOfNotamArrayOnInit);
            for (let index = 0; index < this.airportCodesArrayOnInit.length; index++) {
              if (this.airportCodesArrayOnInit[index] !== null) {
                this.airportCode = this.airportCodesArrayOnInit[index];
                if (this.airportCode === '!FDC') {
                  this.airportCode = '!IAD';
                }
                this.type = this.typeOfNotamArrayOnInit[index];
                this.icaoConversion = 'K'
                  + this.airportCode[1]
                  + this.airportCode[2]
                  + this.airportCode[3];
                this.coordsArray = icao[this.icaoConversion];
                this.coordsArray_lat = this.coordsArray[0];
                this.coordsArray_lng = this.coordsArray[1];
                this.airportCoords = {lat: this.coordsArray_lat, lng: this.coordsArray_lng};
                console.log(this.airportCoords);
                console.log('index = ' + index);
                this.m = JSON.parse(JSON.stringify(this.airportCoords));
                console.log(this.m);
                this.latitude = parseFloat(this.m.lat);
                this.longitude = parseFloat(this.m.lng);
                this.latitude_infoWindow = Math.round(parseFloat(this.m.lat) * 10000) / 10000;
                this.longitude_infoWindow = Math.round(parseFloat(this.m.lng) * 10000) / 10000;
                this.airportLatLng = new google.maps.LatLng({lat: this.latitude, lng: this.longitude});
                this.maxWidth = 500;
                this.addMarker(this.airportLatLng);
                this.zoom = 4;
                this.color = 'red';
                this.radius = 5000;
                console.log(this.markers);
              }
            }
            this.setMapOnAll(this.map);
          });
        this.displayResponse = true;
      }, err => {
        console.error(err);
      }
    );
  }

  addMarker(location) {
    this.airportLatLng = location;
    this.marker = new google.maps.Marker({
      position: this.airportLatLng,
      lat: this.airportLatLng.lat(),
      lng: this.airportLatLng.lng(),
      map: this.map,
    });
    this.markers.push(this.marker);
  }

  setMapOnAll(map) {
    this.map = map;
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(this.map);
    }
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapOnAll(null);
  }

  initialize(m) {
    this.deleteMarkers();
    this.API_Loader.load().then(() => {
      this.m = m;
      console.log(m);
      this.latitude = parseFloat(this.m.lat);
      this.longitude = parseFloat(this.m.lng);
      this.latitude_infoWindow = Math.round(parseFloat(this.m.lat) * 10000) / 10000;
      this.longitude_infoWindow = Math.round(parseFloat(this.m.lng) * 10000) / 10000;
      this.airportLatLng = new google.maps.LatLng({lat: this.latitude, lng: this.longitude});
      this.addMarker(this.airportLatLng);
      this.maxWidth = 500;
      this.zoom = 4;
      this.color = 'red';
      this.radius = 5000;
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
        this.airportCoords = {lat: this.coordsArray_lat, lng: this.coordsArray_lng};
        console.log(this.airportCoords);
        res = this.airportCoords;
        console.log(this.airportCoords);
        this.m = JSON.parse(JSON.stringify(res));
        console.log(this.m);
        this.initialize(this.m);
      }, err => {
         console.error(err);
      }
    );
  }
}
