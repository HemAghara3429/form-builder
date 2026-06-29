import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paragraph } from './paragraph';

describe('Paragraph', () => {
  let component: Paragraph;
  let fixture: ComponentFixture<Paragraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paragraph],
    }).compileComponents();

    fixture = TestBed.createComponent(Paragraph);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
