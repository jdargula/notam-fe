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

  apiRoot = "http://localhost:8080" 
  displayResponse: boolean = false
  response;

  searchForm = new FormGroup({
    airport: new FormControl(''),
    type: new FormControl('')
  })

  submitSearch() {
     this.http.post(this.apiRoot + '/AirportCode', this.searchForm.value.airport).subscribe(
       res => {
         console.log('res')
         console.log(JSON.stringify(res))
         this.response = res;
         this.displayResponse = true;
       }, err => {
         console.error(err)
       }
     )
  }

  ngOnInit() {}

}
