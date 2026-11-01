# SDK Integration Guide

This guide covers advanced usage of `@authspherejs/sdk`, including error handling, token refresh lifecycle, and custom UI integration.

## Token Lifecycle & Refresh

The `@authspherejs/sdk` handles token acquisition and silent refreshes automatically.
- **Access Tokens**: Short-lived (e.g., 15 minutes). Stored in memory to prevent XSS exfiltration.
- **Refresh Tokens**: Long-lived. Stored in `httpOnly` secure cookies.

When an Access Token expires, the SDK intercepts failed API requests and attempts a silent refresh using the `httpOnly` cookie before retrying the original request.

## Error Handling

The SDK throws structured errors that you can catch to handle specific scenarios:

```javascript
try {
  await AuthSphere.redirectToLogin("google");
} catch (error) {
  if (error.code === 'popup_closed_by_user') {
    console.log("User cancelled the login flow.");
  } else if (error.code === 'network_error') {
    console.error("Failed to reach AuthSphere engine.");
  }
}
```

## Custom UI Integration

While AuthSphere provides hosted login pages, you can build a fully custom UI by interacting directly with the underlying methods:

```javascript
// Example: Custom Email/Password Login
const handleLogin = async (email, password) => {
  const result = await AuthSphere.loginWithCredentials({ email, password });
  if (result.requiresMfa) {
    // Prompt user for OTP
    showMfaScreen();
  } else {
    // User is logged in
    window.location.href = '/dashboard';
  }
};
```
