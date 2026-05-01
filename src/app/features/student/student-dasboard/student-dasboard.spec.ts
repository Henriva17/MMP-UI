import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDasboard } from './student-dasboard';

describe('StudentDasboard', () => {
  let component: StudentDasboard;
  let fixture: ComponentFixture<StudentDasboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDasboard],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDasboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
