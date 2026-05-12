import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobPosting } from './create-job-posting';

describe('CreateJobPosting', () => {
  let component: CreateJobPosting;
  let fixture: ComponentFixture<CreateJobPosting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateJobPosting],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateJobPosting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
