import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetroExplorerComponent } from './metro-explorer.component';

describe('MetroExplorerComponent', () => {
  let component: MetroExplorerComponent;
  let fixture: ComponentFixture<MetroExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetroExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetroExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
