import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileCompletion } from './company-profile-completion';

describe('CompanyProfileCompletion', () => {
  let component: CompanyProfileCompletion;
  let fixture: ComponentFixture<CompanyProfileCompletion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyProfileCompletion],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyProfileCompletion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
