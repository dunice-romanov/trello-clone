import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWindowComponent } from './card-window.component';

describe('CardWindowComponent', () => {
  let component: CardWindowComponent;
  let fixture: ComponentFixture<CardWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
