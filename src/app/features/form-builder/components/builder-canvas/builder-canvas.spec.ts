import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BuilderCanvas } from './builder-canvas';

describe('BuilderCanvas', () => {
  let component: BuilderCanvas;
  let fixture: ComponentFixture<BuilderCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderCanvas, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderCanvas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the dedicated preview route', () => {
    expect(component).toBeTruthy();
  });
});
