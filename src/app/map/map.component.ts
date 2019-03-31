/* tslint:disable:prefer-const */
// map/map.component.ts

import {Component, NgZone, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { MapsAPILoader, AgmMap, LatLng} from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { SearchFormComponent} from '../search-form/search-form.component';

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
  searchForm: SearchFormComponent;
  geocoder: any;
  public location: Location = {
    // default coordinates
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true
    },
    zoom: 5
  };
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
  @ViewChild(AgmMap) map: AgmMap;

  ngOnInit() {
    this.location.marker.draggable = true;
    this.showMap();
  }

  markerDragEnd($event: any) {
    this.location.marker.lat = this.location.lat;
    this.location.marker.lng = this.location.lng;
    this.location.lat = this.location.marker.lat;
    this.location.lng = this.location.marker.lng;
  }

  showMap() {
    this.http.post(this.apiRoot + '/LongandLatfromCoords', 'ATL').subscribe(
      res => {
        console.log('res');
        console.log(JSON.stringify(res));
        this.notams = res;
        this.displayResponse = true;
        this.location.lat = this.notams[0];
        this.location.lng = this.notams[1];
        this.location.marker.lat = this.location.lat;
        this.location.marker.lng = this.location.lng;
      }, err => {
        console.error(err);
      }
    );
  }
}
