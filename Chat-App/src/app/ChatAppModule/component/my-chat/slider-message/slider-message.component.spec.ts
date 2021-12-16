import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderMessageComponent } from './slider-message.component';

describe('SliderMessageComponent', () => {
  let component: SliderMessageComponent;
  let fixture: ComponentFixture<SliderMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
