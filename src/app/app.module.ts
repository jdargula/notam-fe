import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MoreInfoComponent } from './more-info/more-info.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import {MatCommonModule, MatListModule} from '@angular/material';
import { AgmMapComponent } from './agm-map/agm-map.component';
import {AgmMarkerComponent} from './agm-marker/agm-marker.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    SearchFormComponent,
    MoreInfoComponent,
    AgmMapComponent,
    AgmMarkerComponent
  ],
  imports: [
    MatCommonModule,
    NgbModule,
    BrowserModule,
    AgmCoreModule.forRoot(
      {apiKey: 'AIzaSyD-UaGW8biRF7tL_noNyiCHYrxj9AwqQas'}),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule
  ],
  providers: [
    GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
