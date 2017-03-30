import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardlistDropdownBagComponent } from './boardlist-dropdown-bag.component';

describe('BoardlistDropdownBagComponent', () => {
  let component: BoardlistDropdownBagComponent;
  let fixture: ComponentFixture<BoardlistDropdownBagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardlistDropdownBagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardlistDropdownBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
