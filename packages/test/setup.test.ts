import { describe, it, expect } from 'vitest';
// import AuthSphere from '../src/index';

describe('AuthSphere SDK', () => {
  it('should pass a basic sanity check', () => {
    expect(true).toBe(true);
  });

  // Example of a real test you could write:
  // it('should initialize with correct config', () => {
  //   AuthSphere.initAuth({
  //     publicKey: 'test-key',
  //     projectId: 'test-id',
  //     redirectUri: 'http://localhost/callback',
  //     baseUrl: 'http://localhost:8000',
  //   });
  //   expect(AuthSphere.getConfig().projectId).toBe('test-id');
  // });
});
