/**
 * Maps Supabase auth error messages to user-friendly strings.
 */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (m.includes("email not confirmed")) {
    return "Please check your inbox and confirm your email before signing in.";
  }
  if (m.includes("user not found") || m.includes("no user found")) {
    return "No account found with that email. Would you like to sign up?";
  }
  if (m.includes("email rate limit") || m.includes("rate limit")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  if (m.includes("user already registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (m.includes("password") && m.includes("weak")) {
    return "Password is too weak. Use at least 6 characters with a mix of letters and numbers.";
  }
  if (m.includes("signup is disabled") || m.includes("signups not allowed")) {
    return "Sign-ups are currently closed. Please check back later.";
  }
  if (m.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  if (m.includes("network") || m.includes("fetch")) {
    return "Network error. Please check your internet connection and try again.";
  }

  // Fallback: return original but capitalize first letter
  return message.charAt(0).toUpperCase() + message.slice(1);
}
