import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderEditComponent } from './work-order-edit.component';

describe('WorkOrderEditComponent', () => {
  let component: WorkOrderEditComponent;
  let fixture: ComponentFixture<WorkOrderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
