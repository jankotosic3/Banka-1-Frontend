import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';

function createToken(payload: Record<string, unknown>): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: {} as any },
          { path: 'employees', component: {} as any }
        ])
      ],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getToken', () => {
    it('should return null if no token in localStorage', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return token if it exists in localStorage', () => {
      localStorage.setItem('authToken', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });
  });

  describe('getJwtRoles', () => {
    it('should return empty array when token does not exist', () => {
      expect(service.getJwtRoles()).toEqual([]);
    });

    it('should parse string role from token', () => {
      localStorage.setItem('authToken', createToken({ roles: 'CLIENT_TRADING' }));

      expect(service.getJwtRoles()).toEqual(['CLIENT_TRADING']);
    });

    it('should parse array roles from token', () => {
      localStorage.setItem('authToken', createToken({ roles: ['agent', 'SUPERVISOR'] }));

      expect(service.getJwtRoles()).toEqual(['AGENT', 'SUPERVISOR']);
    });

    it('should return empty array for malformed token', () => {
      localStorage.setItem('authToken', 'invalid.token');

      expect(service.getJwtRoles()).toEqual([]);
    });
  });

  describe('isClient', () => {
    it('should use JWT roles when available', () => {
      localStorage.setItem('authToken', createToken({ roles: ['CLIENT_BASIC'] }));
      localStorage.setItem('loggedUser', JSON.stringify({ email: 'test@test.com', role: 'Basic', permissions: [] }));

      expect(service.isClient()).toBeTrue();
    });

    it('should fallback to logged user role when JWT roles are unavailable', () => {
      localStorage.setItem('loggedUser', JSON.stringify({ email: 'test@test.com', role: 'CLIENT', permissions: [] }));

      expect(service.isClient()).toBeTrue();
    });
  });

  describe('isActuary', () => {
    it('should return true for AGENT JWT role', () => {
      localStorage.setItem('authToken', createToken({ roles: ['AGENT'] }));

      expect(service.isActuary()).toBeTrue();
    });

    it('should return true for SUPERVISOR fallback role', () => {
      localStorage.setItem('loggedUser', JSON.stringify({ email: 'test@test.com', role: 'SUPERVISOR', permissions: [] }));

      expect(service.isActuary()).toBeTrue();
    });

    it('should return false when neither token nor stored role is actuary-like', () => {
      localStorage.setItem('loggedUser', JSON.stringify({ email: 'test@test.com', role: 'BASIC', permissions: [] }));

      expect(service.isActuary()).toBeFalse();
    });
  });

  describe('canAccessPortfolio', () => {
    it('should return true for client users', () => {
      localStorage.setItem('authToken', createToken({ roles: ['CLIENT_TRADING'] }));

      expect(service.canAccessPortfolio()).toBeTrue();
    });

    it('should return true for actuary users', () => {
      localStorage.setItem('authToken', createToken({ roles: ['AGENT'] }));

      expect(service.canAccessPortfolio()).toBeTrue();
    });

    it('should return false for unrelated roles', () => {
      localStorage.setItem('authToken', createToken({ roles: ['EMPLOYEE'] }));
      localStorage.setItem('loggedUser', JSON.stringify({ email: 'test@test.com', role: 'BASIC', permissions: [] }));

      expect(service.canAccessPortfolio()).toBeFalse();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false if no token', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return false if token is expired', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) - 3600 };
      const token = createToken(payload);
      localStorage.setItem('authToken', token);
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true if token is valid', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
      const token = createToken(payload);
      localStorage.setItem('authToken', token);
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false if token is malformed', () => {
      localStorage.setItem('authToken', 'invalid.token');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('hasPermission', () => {
    it('should return false if no user in localStorage', () => {
      expect(service.hasPermission('EMPLOYEE_MANAGE_ALL')).toBeFalse();
    });

    it('should return true if user has permission', () => {
      localStorage.setItem('loggedUser', JSON.stringify({
        email: 'test@test.com',
        permissions: ['EMPLOYEE_MANAGE_ALL', 'BANKING_BASIC']
      }));
      expect(service.hasPermission('EMPLOYEE_MANAGE_ALL')).toBeTrue();
    });

    it('should return false if user does not have permission', () => {
      localStorage.setItem('loggedUser', JSON.stringify({
        email: 'test@test.com',
        permissions: ['BANKING_BASIC']
      }));
      expect(service.hasPermission('EMPLOYEE_MANAGE_ALL')).toBeFalse();
    });
  });

  describe('getUserIdFromToken', () => {
    it('should return null if no token', () => {
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should return user id from token', () => {
      localStorage.setItem('authToken', createToken({ id: 42 }));
      expect(service.getUserIdFromToken()).toBe(42);
    });

    it('should return null if token has no id field', () => {
      localStorage.setItem('authToken', createToken({ email: 'test@test.com' }));
      expect(service.getUserIdFromToken()).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear all auth data from localStorage', () => {
      localStorage.setItem('authToken', 'token');
      localStorage.setItem('loggedUser', JSON.stringify({ email: 'test@test.com' }));
      localStorage.setItem('refreshToken', 'refresh');

      service.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('loggedUser')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });
});
