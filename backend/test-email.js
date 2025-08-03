// Test email configuration
import { sendOTPEmail } from './utils/email.js';

const testEmail = async () => {
  try {
    await sendOTPEmail('your-email@example.com', '123456');
    console.log('✅ Email test successful!');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
};

// Uncomment to test
// testEmail();
