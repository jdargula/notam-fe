import { FormGroup, FormControl } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

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
  private airportCode: string;
  private type: string;
  private airportAndType: Array<any> = [];
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


        this.notams = res;
        // const airportCodesOnInit = [];

        // this.notams.forEach(function(notam) {

        //   airportCodesOnInit.push(notam.col2);
        // });
        // this.airportCodesArrayOnInit = airportCodesOnInit;
        
    this.clean()

        this.displayResponse = true;
      }, err => {
        console.error(err);
      }
      
    );

  }

  clean() {
    for (let i of this.notams) {
      if (i.col4 == "" || i.col4 == null) {
        i.col4 = "N/A"
      }
      if (i.col5 == "" || i.col5 == null) {
        i.col5 = "N/A"
      }
      if (i.col6 == "" || i.col6 == null) {
        i.col6 = "N/A"
      }
      if (i.col7 == "" || i.col7 == null) {
        i.col7 = "N/A"
      }
    }
    console.log(this.notams)
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
          this.notams = res;
          this.clean()

          this.displayResponse = true;
        }, err => {
          console.error(err);
        }
      );
    }
    moreDetails(key: string) {
      this.http.post(this.apiRoot + '/RawNotamFromKey', key, {responseType: 'text'}).subscribe(
        res => {
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
