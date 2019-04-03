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
  private coords: any;
  private apiRoot: string;
  private displayResponse: boolean;
  private displayMoreDetails: boolean;
  private notamCoordinates: Object;
  private marker: AgmMarker;
  private airportLatLng: LatLng;
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
    this.getAirportCoordinates();
  }

  getAirportCoordinates() {
    this.http.post(this.apiRoot + '/LongandLatfromCoords', this.searchForm.searchForm.value.airport).subscribe(
      res => {
        console.log(res);
        this.displayResponse = true;
        /*this.coords = [];
        this.notamCoordinates = JSON.parse('res', (key, value) => {
          console.log(key);
          this.coords = value;
          return this.coords;
        });*/
        this.airportLatLng = new google.maps.LatLng(JSON.stringify(res));
        this.marker = new google.maps.Marker({position: {lat: this.airportLatLng.lat(), lng: this.airportLatLng.lng()}, map: this.map});
        this.displayResponse = true;
      }, err => {
        console.error(err);
      }
    );
  }
}
