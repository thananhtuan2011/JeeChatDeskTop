import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMyChatComponent } from './detail-my-chat.component';

describe('DetailMyChatComponent', () => {
  let component: DetailMyChatComponent;
  let fixture: ComponentFixture<DetailMyChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMyChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMyChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
