import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardlistDropdownComponent } from './boardlist-dropdown.component';

describe('BoardlistDropdownComponent', () => {
  let component: BoardlistDropdownComponent;
  let fixture: ComponentFixture<BoardlistDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardlistDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardlistDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
