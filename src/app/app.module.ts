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
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    MoreInfoComponent,
    MapComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDGapNAE5nKEqgzjy3zjzxqRIZRYNPYRlE'}), // <---
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    GoogleMapsAPIWrapper // <---
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
