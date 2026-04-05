import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveBalanceCardComponent } from './leave-balance-card.component';

describe('LeaveBalanceCardComponent', () => {
  let component: LeaveBalanceCardComponent;
  let fixture: ComponentFixture<LeaveBalanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LeaveBalanceCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveBalanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
