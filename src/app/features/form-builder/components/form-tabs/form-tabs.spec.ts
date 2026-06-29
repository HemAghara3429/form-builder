import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTabs } from './form-tabs';

describe('FormTabs', () => {
  let component: FormTabs;
  let fixture: ComponentFixture<FormTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
