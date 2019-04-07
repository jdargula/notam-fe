import { FormGroup, FormControl } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {StringFormatDefinition} from 'ajv';

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
  }

  submitSearch() {
     if (this.searchForm.value.airport.length === 3) {
       this.searchForm.value.airport = '!'
         + this.searchForm.value.airport[0]
         + this.searchForm.value.airport[1]
         + this.searchForm.value.airport[2];
     }
     this.http.post(this.apiRoot + '/AirportCodeMultiple', this.searchForm.value.airport).subscribe(
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
