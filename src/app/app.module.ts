import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    AgmCoreModule.forRoot({apiKey: 'AIzaSyBksgsMa4KIvu7CCytKzmJ6wuKya7Gdnw0'}),
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
