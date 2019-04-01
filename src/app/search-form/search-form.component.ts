import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})

export class SearchFormComponent implements OnInit {

  private apiRoot: string;
  private displayResponse: boolean;
  private displayMoreDetails: boolean;
  private rawNotam: Object;
  private notams: Object;
  private AIRPORT: string
  searchForm = new FormGroup({
    airport: new FormControl(''),
    type: new FormControl('')
  });
  constructor(private http: HttpClient,
              private map: MapComponent) {
    this.apiRoot = 'http://localhost:8080';
    this.displayResponse = false;
    this.displayMoreDetails = false;
  }

  ngOnInit() {
  }

  submitSearch() {
     this.AIRPORT = this.searchForm.value.airport;
     this.http.post(this.apiRoot + '/AirportCodeMultiple', this['AIRPORT']).subscribe(
       res => {
         console.log('res');
         console.log(JSON.stringify(res));
         this.notams = res;
         this.displayResponse = true;
         this.map.showMap(this.AIRPORT);
       }, err => {
         console.error(err);
       }
     );
  }

  multipleSearch() {
    this.AIRPORT = this.searchForm.value.airport;
    this.http.post(this.apiRoot + '/AirportCodeMultiple', this['AIRPORT']).subscribe(
      res => {
        console.log('res');
        console.log(JSON.stringify(res));
        this.notams = res;
        this.displayResponse = true;
      }, err => {
        console.error(err);
      }
    );
  }

  testMoreDetails() {
    this.multipleSearch();
  }

  moreDetails(key: string) {
    this.http.post(this.apiRoot + '/RawNotamFromKey', key, { responseType: 'text'}).subscribe(
      res => {
        console.log(res.toString());
        this.rawNotam = res.toString();
        this.displayMoreDetails = true;
      }, err => {
        console.error(err);
      }
    );
  }

  closeDetails() {
    this.displayMoreDetails = false;
  }
}
