import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileCompletion } from './student-profile-completion';

describe('StudentProfileCompletion', () => {
  let component: StudentProfileCompletion;
  let fixture: ComponentFixture<StudentProfileCompletion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentProfileCompletion],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentProfileCompletion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
