import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  constructor(private http: HttpClient) { }

  apiRoot = 'http://localhost:8080';
  displayResponse = false;
  displayMoreDetails = false;
  rawNotam;
  response;
  notams;

  searchForm = new FormGroup({
    airport: new FormControl(''),
    type: new FormControl('')
  });

  submitSearch() {
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

  multipleSearch() {
    this.http.post(this.apiRoot + '/AirportCodeMultiple', 'ATL').subscribe(
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


  ngOnInit() {}

}
