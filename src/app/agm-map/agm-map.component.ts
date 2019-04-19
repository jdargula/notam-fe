import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import {LatLng, MapsAPILoader} from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { SearchFormComponent } from '../search-form/search-form.component';
import {GoogleMap, InfoWindow, MapOptions, MapTypeId, Marker} from '@agm/core/services/google-maps-types';

declare var google: any;
const icao = require('icao');

@Component({
  selector: 'app-agm-map',
  templateUrl: './agm-map.component.html',
  styleUrls: ['./agm-map.component.css']
})

export class AgmMapComponent implements OnInit {
  private apiRoot: string;
  private displayResponse: boolean;
  private marker: Marker;
  private airportCoords: Object;
  private latitude: number;
  private longitude: number;
  private radius: number;
  private color: string;
  private m: any;
  private airportLatLng: LatLng;
  private airportLatLngArray: Array<LatLng> = [];
  private airportCode: string;
  private type: string;
  private infoWindow: InfoWindow;
  private infoWindowArray: Array<InfoWindow> = [];
  private markers: Array<Marker> = [];
  private latitude_infoWindow: number;
  private longitude_infoWindow: number;
  private icaoConversion: string;
  private coordsArray: Array<object> = [];
  private coordsArray_lat: object;
  private coordsArray_lng: object;
  private maxWidth: number;
  private typeOfNotamArrayOnInit: Array<string> = [];
  private notams: any;
  private airportCodesArrayOnInit: Array<string> = [];
  private contentString: string;
  private center: LatLng;
  private zoom: number;
  private mapTypeId: MapTypeId;
  private mapOptions: MapOptions;
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
  @ViewChild('AgmMap') map: GoogleMap;

  ngOnInit() {
    this.API_Loader.load().then(() => {
      this.http.post(this.apiRoot + '/GetAllNotams', 'IATA/ICAO').subscribe(
        res => {
          console.log(res);
          console.log(JSON.stringify(res));
          this.notams = res;
          this.displayNotams(this.notams);
        });
        this.displayResponse = true;
      }, err => {
        console.error(err);
      }
    );
  }

  displayNotams(notams) {
    this.API_Loader.load().then(() => {
      this.notams = notams;
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
      while (this.airportCodesArrayOnInit.length > 0) {
        this.airportCode = this.airportCodesArrayOnInit.pop();
        if (this.airportCode === '!FDC') {
          this.airportCode = '!IAD';
        }
        this.type = this.typeOfNotamArrayOnInit.pop();
        this.icaoConversion = 'K'
          + this.airportCode[1]
          + this.airportCode[2]
          + this.airportCode[3];
        this.coordsArray = icao[this.icaoConversion];
        this.coordsArray_lat = this.coordsArray[0];
        this.coordsArray_lng = this.coordsArray[1];
        this.airportCoords = {lat: this.coordsArray_lat, lng: this.coordsArray_lng};
        console.log(this.airportCoords);
        this.m = JSON.parse(JSON.stringify(this.airportCoords));
        console.log(this.m);
        this.latitude = parseFloat(this.m.lat);
        this.longitude = parseFloat(this.m.lng);
        this.latitude_infoWindow = Math.round(parseFloat(this.m.lat) * 10000) / 10000;
        this.longitude_infoWindow = Math.round(parseFloat(this.m.lng) * 10000) / 10000;
        this.airportLatLng = new google.maps.LatLng({
          lat: this.latitude,
          lng: this.longitude
        });
        this.maxWidth = 500;
        this.contentString = '[Type]: ' + this.type + '\n'
          + '[IATA/ICAO]: ' + this.airportCode + '/' + this.icaoConversion + '\n'
          + '[Coordinates]: ' + this.latitude_infoWindow + ', ' + this.longitude_infoWindow;
        this.infoWindow = new google.maps.InfoWindow({
          maxWidth: this.maxWidth,
          content: this.contentString,
          lat: this.airportLatLng.lat(),
          lng: this.airportLatLng.lng()
        });
        this.airportLatLngArray.push(this.airportLatLng);
        this.infoWindowArray.push(this.infoWindow);
      }
      this.API_Loader.load().then(() => {
        this.center = new google.maps.LatLng(39.8333333, -98.585522);
        this.mapOptions = {
          center: this.center,
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          zoom: 3
        };
        this.map = new google.maps.Map(document.getElementById('map'),
          this.mapOptions);
      });
      this.setMarkers(this.map, this.airportLatLngArray, this.infoWindowArray);
    });
  }

  setMarkers(map, airportLatLngArray, infoWindowArray) {
    this.API_Loader.load().then(() => {
      this.airportLatLngArray = airportLatLngArray;
      this.infoWindowArray = infoWindowArray;
      const infoWindow = new google.maps.InfoWindow();
      while (this.airportLatLngArray.length > 0) {
        console.log('this.airportLatLngArray: ' + this.airportLatLngArray);
        this.airportLatLng = this.airportLatLngArray.pop();
        console.log('this.airportLatLng = ' + this.airportLatLng);
        console.log('this.airportLatLngArray = ' + this.airportLatLngArray);
        this.infoWindow = this.infoWindowArray.pop();
        this.marker = new google.maps.Marker({
          map: this.map,
          lat: this.airportLatLng.lat(),
          lng: this.airportLatLng.lng()
        });
        this.marker.setPosition(this.airportLatLng);
        google.maps.event.addListener(this.marker, 'click', (
          function (marker, currentContent, currentInfoWindow) {
            return function () {
              currentInfoWindow.setContent(currentContent);
              currentInfoWindow.open(map, marker);
            };
          }
        )(this.marker, this.infoWindow.getContent(), infoWindow));
        this.markers.push(this.marker);
      }
      console.log(this.markers);
      const bounds = new google.maps.LatLngBounds();
      const markerLatLng = new google.maps.LatLng({lat: this.airportLatLng.lat(), lng: this.airportLatLng.lng()});
      bounds.extend(markerLatLng);
      this.map.setCenter(this.center);
      this.map.setCenter(bounds.getCenter());
      this.zoom = 3;
      this.map.fitBounds(bounds);
      google.maps.event.addListenerOnce(this.map, 'bounds_changed', (
        function(_map, _zoom) {
          return function () {
            _map.setZoom(_zoom);
          };
        }
      )(this.map, this.zoom));
    });
  }

  deleteMarkers() {
    this.clearMarkers();
  }

  clearMarkers() {
    this.resetMarkers(this.map, null, null);
    this.markers = [];
  }

  resetMarkers(map, airportLatLngArray, infoWindowArray) {
    this.map = map;
    this.airportLatLngArray = airportLatLngArray;
    this.infoWindowArray = infoWindowArray;
  }

  setAirportCoordinates() {
    this.API_Loader.load().then(() => {
      this.deleteMarkers();
      this.airportLatLngArray = new Array<LatLng>();
      this.infoWindowArray = new Array<InfoWindow>();
      this.markers = new Array<Marker>();
      this.airportLatLng = new google.maps.LatLng();
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
      /**
       * marker colors will be coded according to type.Two additional
       * types will populate the map when user conducts a query search:
       * (1) "no notams found," and (2) Type not specified by user.
       */
      this.icaoConversion = this.icaoConversion.toUpperCase();
      /**
       * Info from http post call below is not being used at this time, due to current formatting of lat and lng values in our db.
       * Workaround discovered is the "icao" npm imported node package module. Although this limits functionality
       * of our app to some extent, the icao package works great for our needs at this time.
       */
      this.http.post(this.apiRoot + '/AirportCodeMultiple', this.searchForm.searchForm.value.airport).subscribe(
         res => {
           console.log(res);
           console.log(JSON.stringify(res));
           this.notams = res;
           this.displayNotams(this.notams);
           this.displayResponse = true;
        }, err => {
           console.error(err);
        }
      );
    });
  }
}
