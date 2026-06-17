import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedExperiencesComponent } from './saved-experiences.component';

describe('SavedExperiencesComponent', () => {
  let component: SavedExperiencesComponent;
  let fixture: ComponentFixture<SavedExperiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedExperiencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
