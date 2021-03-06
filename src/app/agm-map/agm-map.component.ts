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
  private airportAndType: Array<any> = [];
  private notamKeyArrayOnInit: Array<any> = [];
  private key: any;

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
            this.displayResponse = false;
            this.displayNotams(this.notams);
          });
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
      let initNotamKey = '';
      let initAirportCode = '';
      let initNotamType = '';
      /* console.log(this.searchForm.notams); */ // test
      this.notams.forEach(function (notam) {
        initNotamKey = notam.col1;
        notamKeyOnInit.push(initNotamKey);
        initAirportCode = notam.col2;
        airportCodesOnInit.push(initAirportCode);
        initNotamType = notam.col3;
        console.log('initNotamType = ' + initNotamType);
        typeOfNotamOnInit.push(initNotamType);
      });
      this.notamKeyArrayOnInit = notamKeyOnInit;
      /* console.log(this.notamKeyArrayOnInit); */ // testing
      this.airportCodesArrayOnInit = airportCodesOnInit;
      /* console.log(this.airportCodesArrayOnInit); */ // testing
      this.typeOfNotamArrayOnInit = typeOfNotamOnInit;
      /* console.log(this.typeOfNotamArrayOnInit); */ // testing
      while (this.airportCodesArrayOnInit.length > 0) {
        this.airportCode = this.airportCodesArrayOnInit.pop();
        if (this.airportCode === '!FDC') {
          this.airportCode = '!IAD';
        }
        this.type = this.typeOfNotamArrayOnInit.pop();
        this.key = this.notamKeyArrayOnInit.pop();
        this.icaoConversion = 'K'
          + this.airportCode[1]
          + this.airportCode[2]
          + this.airportCode[3];
        this.coordsArray = icao[this.icaoConversion];
        this.coordsArray_lat = this.coordsArray[0];
        this.coordsArray_lng = this.coordsArray[1];
        this.airportCoords = {lat: this.coordsArray_lat, lng: this.coordsArray_lng};
        /* console.log(this.airportCoords); */ //testing
        this.m = JSON.parse(JSON.stringify(this.airportCoords));
        /* console.log(this.m); */ // testing
        this.latitude = parseFloat(this.m.lat);
        this.longitude = parseFloat(this.m.lng);
        this.latitude_infoWindow = Math.round(parseFloat(this.m.lat) * 10000) / 10000;
        this.longitude_infoWindow = Math.round(parseFloat(this.m.lng) * 10000) / 10000;
        this.airportLatLng = new google.maps.LatLng({
          lat: this.latitude,
          lng: this.longitude
        });
        this.maxWidth = 500;
        this.contentString = '[Key]: ' + this.key + '\n'
          + '[Type]: ' + this.type + '\n'
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
      // default map center: central us geo coords
      this.center = new google.maps.LatLng(39.8283, -98.5795);
      this.zoom = 4;
      this.mapOptions = {
        center: this.center,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoom: this.zoom,
        scrollwheel: true,
        draggable: true,
        zoomControl: true
      };
      this.map = new google.maps.Map(document.getElementById('map'),
        this.mapOptions);
      this.setMarkers(this.map, this.airportLatLngArray, this.infoWindowArray);
    });
  }

  setMarkers(map, airportLatLngArray, infoWindowArray) {
    this.API_Loader.load().then(() => {
      this.airportLatLngArray = airportLatLngArray;
      this.infoWindowArray = infoWindowArray;
      const infoWindow = new google.maps.InfoWindow();
      while (this.airportLatLngArray.length > 0) {
        /* console.log('this.airportLatLngArray: ' + this.airportLatLngArray); */ // testing
        this.airportLatLng = this.airportLatLngArray.pop();
        /* console.log('this.airportLatLng = ' + this.airportLatLng);
        console.log('this.airportLatLngArray = ' + this.airportLatLngArray); */ // testing
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
        /* console.log(this.markers); */ // testing
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(this.airportLatLng);
        this.map.setCenter(bounds.getCenter());
        this.zoom = 3;
        this.map.fitBounds(bounds);
        google.maps.event.addListenerOnce(this.map, 'bounds_changed', (
          function (_map, _zoom) {
            return function () {
              _map.setZoom(_zoom);
            };
          }
        )(this.map, this.zoom));
      }
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
      if (this.searchForm.searchForm.value.airport.length === 4) {
        this.searchForm.searchForm.value.airport = '!'
          + this.searchForm.searchForm.value.airport[1]
          + this.searchForm.searchForm.value.airport[2]
          + this.searchForm.searchForm.value.airport[3];
      }
      this.icaoConversion = 'K'
        + this.searchForm.searchForm.value.airport[1]
        + this.searchForm.searchForm.value.airport[2]
        + this.searchForm.searchForm.value.airport[3];
      this.searchForm.searchForm.value.airport = this.searchForm.searchForm.value.airport.toUpperCase();
      this.airportCode = this.searchForm.searchForm.value.airport;
      this.type = this.searchForm.searchForm.value.type;
      this.icaoConversion = this.icaoConversion.toUpperCase();
      this.http.post(this.apiRoot + '/populateMapByAirportCode', this.searchForm.searchForm.value.airport).subscribe(
        res => {
          console.log('res');
          console.log(JSON.stringify(res));
          this.notams = res;
          /* console.log(this.notams); */ // testing
          this.displayNotams(this.notams);
        }, err => {
          console.error(err);
        }
      );
    });
  }

  searchByKey() {
    this.http.post(
      this.apiRoot + '/populateMapByKey', this.searchForm.searchForm.value.key).subscribe(
      res => {
        console.log('res');
        console.log(res);
        console.log(JSON.stringify(res));
        this.notams = res;
        console.log(this.notams);
        this.displayNotams(this.notams);
      }, err => {
        console.error(err);
      }
    );
  }

  searchByType() {
    let capType = this.searchForm.searchForm.value.type;
    capType = capType.toUpperCase();
    this.http.post(
      this.apiRoot + '/populateMapByType', capType).subscribe(
      res => {
        console.log('res');
        console.log(res);
        console.log(JSON.stringify(res));
        this.notams = res;
        console.log(this.notams);
        this.displayNotams(this.notams);
      }, err => {
        console.error(err);
      }
    );
  }

  searchByEffectiveDate() {
    this.http.post(
      this.apiRoot + '/populateMapByEffectiveDate', this.searchForm.searchForm.value.effectiveDate).subscribe(
      res => {
        console.log('res');
        console.log(res);
        console.log(JSON.stringify(res));
        this.notams = res;
        console.log(this.notams);
        this.displayNotams(this.notams);
      }, err => {
        console.error(err);
      }
    );
  }

  searchByCreatedDate() {
    this.http.post(
      this.apiRoot + '/populateMapByCreatedDate', this.searchForm.searchForm.value.createdDate).subscribe(
      res => {
        console.log('res');
        console.log(res);
        console.log(JSON.stringify(res));
        this.notams = res;
        console.log(this.notams);
        this.displayNotams(this.notams);
      }, err => {
        console.error(err);
      }
    );
  }

  searchBySource() {
    this.http.post(
      this.apiRoot + '/populateMapBySource', this.searchForm.searchForm.value.source).subscribe(
      res => {
        console.log('res');
        console.log(res);
        console.log(JSON.stringify(res));
        this.notams = res;
        console.log(this.notams);
        this.displayNotams(this.notams);
      }, err => {
        console.error(err);
      }
    );
  }
}
