import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDataModalComponent } from './daily-data-modal.component';

describe('DailyDataModalComponent', () => {
  let component: DailyDataModalComponent;
  let fixture: ComponentFixture<DailyDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyDataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
