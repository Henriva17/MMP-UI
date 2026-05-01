import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { chooseRoleGuard } from './chose-role-guard';

describe('choseRoleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => chooseRoleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
