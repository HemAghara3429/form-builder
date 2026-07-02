import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPanel } from './preview-panel';

describe('PreviewPanel', () => {
  let component: PreviewPanel;
  let fixture: ComponentFixture<PreviewPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
