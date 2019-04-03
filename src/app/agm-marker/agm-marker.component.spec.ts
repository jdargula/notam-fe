import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgmMarkerComponent } from './agm-marker.component';

describe('AgmMapComponent', () => {
  let component: AgmMarkerComponent;
  let fixture: ComponentFixture<AgmMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgmMarkerComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgmMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
