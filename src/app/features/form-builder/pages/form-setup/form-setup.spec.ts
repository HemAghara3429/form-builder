import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSetup } from './form-setup';

describe('FormSetup', () => {
  let component: FormSetup;
  let fixture: ComponentFixture<FormSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSetup],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSetup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
