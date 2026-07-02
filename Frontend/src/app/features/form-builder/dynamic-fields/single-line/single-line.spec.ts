import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLine } from './single-line';

describe('SingleLine', () => {
  let component: SingleLine;
  let fixture: ComponentFixture<SingleLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleLine],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleLine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
