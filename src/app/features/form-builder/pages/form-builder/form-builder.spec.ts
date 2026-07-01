import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FormBuilderPage } from './form-builder';

describe('FormBuilderPage', () => {
  let component: FormBuilderPage;
  let fixture: ComponentFixture<FormBuilderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilderPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FormBuilderPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
