import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Minimal resources for demonstration.
// In a real app, these would be loaded from JSON files.
const resources = {
  en: {
    translation: {
      "modern.welcome": "Welcome.",
      "modern.enter_email": "Enter your email to get started.",
      "modern.email_placeholder": "name@company.com",
      "modern.invalid_email": "Please enter a valid email.",
      "modern.recognizing": "Recognizing...",
      "modern.continue": "Continue",
      "modern.welcome_back": "Welcome back.",
      "modern.nice_to_meet": "Nice to meet you.",
      "modern.verify_identity": "Please verify your identity.",
      "modern.setup_account": "Let's set up your new account.",
      "modern.name_placeholder": "Your full name",
      "modern.name_required": "Full name is required.",
      "modern.password_error": "Password must be at least 6 characters.",
      "modern.enter_password": "Enter password",
      "modern.create_password": "Create password",
      "modern.processing": "Processing...",
      "modern.sign_in": "Sign in to Dashboard",
      "modern.create_account": "Create my account",
      "modern.all_set": "You're all set.",
      "modern.redirecting": "Redirecting you to your workspace...",
      "animated.start": "START",
      "animated.something": "Something",
      "animated.new": "NEW.",
      "animated.create_account": "Create Account",
      "animated.label_identity": "Identity",
      "animated.placeholder_name": "Your Name",
      "animated.error_name": "Required field",
      "animated.label_contact": "Contact",
      "animated.placeholder_email": "Email Address",
      "animated.error_email": "Invalid email",
      "animated.label_security": "Security",
      "animated.placeholder_password": "Password",
      "animated.error_password": "Min 6 characters",
      "animated.processing": "Processing...",
      "animated.join_now": "Join Now",
      "animated.have_account": "I have an account",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
