import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAssignmentComponent } from './work-order-assignment.component';

describe('WorkOrderAssignmentComponent', () => {
  let component: WorkOrderAssignmentComponent;
  let fixture: ComponentFixture<WorkOrderAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
