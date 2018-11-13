import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfigureComponent } from './admin-configure.component';

describe('AdminConfigureComponent', () => {
  let component: AdminConfigureComponent;
  let fixture: ComponentFixture<AdminConfigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminConfigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
