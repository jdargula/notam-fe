/* tslint:disable:prefer-const */
// map/map.component.ts

import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import {HttpClient} from '@angular/common/http';
import {LatLng} from '@agm/core';

declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  private apiRoot: string;
  private displayResponse: boolean;
  private displayMoreDetails: boolean;
  private notams: Object;
  private myLatLng: LatLng;

  constructor(public mapsApiLoader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper,
              private http: HttpClient) {
    this.apiRoot = 'http://localhost:8080';
    this.displayResponse = false;
    this.displayMoreDetails = false;
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }
  geocoder: any;
  public location: Location = {
    lat: 0,
    lng: 0,
    marker: {
      lat: 0,
      lng: 0,
      draggable: true
    },
    zoom: 5
  };
  @ViewChild(AgmMap) map: AgmMap;

  ngOnInit() {
    this.location.marker.draggable = true;
  }

  ngOnChange() {
    this.location.marker.draggable = true;
  }

  showMap() {

    this.http.post(this.apiRoot + '/LongandLatfromCoords', this.myLatLng).subscribe(
      res => {
        console.log('res');
        console.log(JSON.stringify(res));
        this.notams = res;
        this.location.lat = this.notams[0];
        this.location.lng = this.notams[1];
        this.displayResponse = true;
        this.myLatLng = new google.maps.LatLng({lat: res[0], lng: res[1]});
        this.findLocation(this.myLatLng);
        this.ngOnChange();
      }, err => {
        console.error(err);
      }
    );
  }

  findLocation(myLatLng) {
    if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
    this.geocoder.geocode({
      'myLatLng': myLatLng
    }, (res, status) => {
      console.log(res);
      if (status === google.maps.GeocoderStatus.OK) {
        this.updateOnMap(this.myLatLng);
        this.map.triggerResize(true);
        if (res[0].geometry.location) {
          this.location.lat = res[0].geometry.location.lat();
          this.location.lng = res[0].geometry.location.lng();
          this.location.marker.lat = res[0].geometry.location.lat();
          this.location.marker.lng = res[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = res[0].geometry.viewport;
        }
      } else {
        alert('Sorry, this search produced no results.');
      }
    });
  }

  markerDragEnd(m: any, $event: any) {
    this.location.marker.lat = m.coords.lat;
    this.location.marker.lng = m.coords.lng;
    this.findAddressByCoordinates();
  }

  findAddressByCoordinates() {
    this.geocoder.geocode({
      'location': {
        lat: this.location.marker.lat,
        lng: this.location.marker.lng,
      }
    }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.decomposeAddressComponents(results);
      }
    });
  }

  decomposeAddressComponents(addressArray) {
    if (addressArray.length === 0) { return false; }
    let address = addressArray[0].address_components;

    for (let element of address) {
      if (element.length === 0 && !element['types']) { continue; }

      if (element['types'].indexOf('street_number') > -1) {
        this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        this.location.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        this.location.address_level_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        this.location.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        this.location.address_zip = element['long_name'];

      }
    }
  }

  updateOnMap(location) {
    this.markerDragEnd(location, this.showMap());
  }
}
