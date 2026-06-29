import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderSidebar } from './builder-sidebar';

describe('BuilderSidebar', () => {
  let component: BuilderSidebar;
  let fixture: ComponentFixture<BuilderSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
