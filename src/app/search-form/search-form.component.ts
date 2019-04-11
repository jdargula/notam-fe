import { FormGroup, FormControl } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  airportCodesArrayOnInit: any[];
  notams: any;
  searchForm = new FormGroup({
    airport: new FormControl(''),
    type: new FormControl('')
  });
  constructor(private http: HttpClient) {
    this.apiRoot = 'http://localhost:8080';
    this.displayResponse = false;
    this.displayMoreDetails = false;
  }

  ngOnInit() {
    this.http.post(this.apiRoot + '/GetAllNotams', 'IATA/ICAO').subscribe(
      res => {
        console.log('res');
        console.log(JSON.stringify(res));
        this.notams = res;
        const airportCodesOnInit = [];
        console.log(this.notams);
        this.notams.forEach(function(notam) {
          console.log(notam.col2);
          airportCodesOnInit.push(notam.col2);
        });
        this.airportCodesArrayOnInit = airportCodesOnInit;
        console.log(this.airportCodesArrayOnInit);
        this.displayResponse = true;
      }, err => {
        console.error(err);
      }
    );
  }

  submitSearch() {
    if (this.searchForm.value.airport.length === 3) {
      this.searchForm.value.airport = '!'
        + this.searchForm.value.airport[0]
        + this.searchForm.value.airport[1]
        + this.searchForm.value.airport[2];
    }
    this.searchForm.value.airport = this.searchForm.value.airport.toUpperCase();
     this.http.post(this.apiRoot + '/AirportCodeMultiple', this.searchForm.value.airport).subscribe(
       res => {
         console.log(res);
         console.log(JSON.stringify(res));
         this.notams = res;
         this.displayResponse = true;
       }, err => {
         console.error(err);
       }
     );
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
