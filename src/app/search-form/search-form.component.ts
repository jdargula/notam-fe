import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  constructor() { }

  searchForm = new FormGroup({
    airport: new FormControl(''),
    type: new FormControl('')
  })

  ngOnInit() {
  }

}
