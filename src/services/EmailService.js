// Email service for password resets and OTP delivery
// This is a mock service that simulates email sending

const EmailService = {
  // Generate OTP
  generateOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  },

  // Send password reset email
  sendPasswordReset: async (email) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          // Validate email exists (simulate database check)
          const validEmails = [
            'admin@healthmate.com',
            'patient@example.com',
            'demo.patient@healthmate.com',
            'user123@example.com',
            'doctor.wang@clinic.cn'
          ];

          if (!validEmails.includes(email.toLowerCase())) {
            resolve({
              success: false,
              error: 'Email not found in our system'
            });
            return;
          }

          // Generate OTP/token
          const otp = EmailService.generateOTP();
          const resetToken = btoa(`${email}:${Date.now()}:${otp}`); // Simple encoding

          // Store reset data (in real app, this would be in database with expiration)
          const resetData = {
            email: email.toLowerCase(),
            otp,
            token: resetToken,
            expires: Date.now() + (15 * 60 * 1000), // 15 minutes
            used: false
          };

          // Store in localStorage (simulate database)
          localStorage.setItem(`reset_${email.toLowerCase()}`, JSON.stringify(resetData));

          // Simulate sending email
          console.log(`📧 PASSWORD RESET EMAIL SENT to ${email}:`);
          console.log(`Subject: Reset Your HealthMate Password`);
          console.log(`OTP: ${otp}`);
          console.log(`Reset Link: https://healthmate.company/reset?token=${resetToken}`);
          console.log(`Expires: ${new Date(resetData.expires).toLocaleTimeString()}`);

          // Send notification to developer console
          EmailService.logEmailSent('password_reset', email, otp);

          resolve({
            success: true,
            message: 'Password reset email sent successfully',
            otp, // In real app, this wouldn't be returned
            token: resetToken,
            expiresIn: '15 minutes'
          });

        } catch (error) {
          console.error('Email sending failed:', error);
          resolve({
            success: false,
            error: 'Failed to send reset email. Please try again.'
          });
        }
      }, 1500); // Simulate network delay
    });
  },

  // Verify OTP token
  verifyOTP: async (email, otp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const resetData = JSON.parse(localStorage.getItem(`reset_${email.toLowerCase()}`) || 'null');

          if (!resetData) {
            resolve({
              success: false,
              error: 'No reset request found. Please request a new password reset.'
            });
            return;
          }

          if (Date.now() > resetData.expires) {
            // Clean up expired token
            localStorage.removeItem(`reset_${email.toLowerCase()}`);
            resolve({
              success: false,
              error: 'Reset link has expired. Please request a new one.'
            });
            return;
          }

          if (resetData.otp !== otp) {
            resolve({
              success: false,
              error: 'Invalid OTP. Please check and try again.'
            });
            return;
          }

          if (resetData.used) {
            resolve({
              success: false,
              error: 'This reset link has already been used.'
            });
            return;
          }

          // Mark token as verified (not used yet)
          resetData.verified = true;
          localStorage.setItem(`reset_${email.toLowerCase()}`, JSON.stringify(resetData));

          console.log(`✅ OTP VERIFIED for ${email}`);

          resolve({
            success: true,
            message: 'OTP verified successfully',
            token: resetData.token,
            email: resetData.email
          });

        } catch (error) {
          console.error('OTP verification failed:', error);
          resolve({
            success: false,
            error: 'Failed to verify OTP. Please try again.'
          });
        }
      }, 800);
    });
  },

  // Reset password using token
  resetPassword: async (token, newPassword) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Decode token to get email
          const tokenData = atob(token);
          const [email, timestamp] = tokenData.split(':');

          if (!email) {
            resolve({
              success: false,
              error: 'Invalid reset token.'
            });
            return;
          }

          const resetData = JSON.parse(localStorage.getItem(`reset_${email.toLowerCase()}`) || 'null');

          if (!resetData || resetData.token !== token) {
            resolve({
              success: false,
              error: 'Invalid or expired reset token.'
            });
            return;
          }

          if (!resetData.verified) {
            resolve({
              success: false,
              error: 'Token not verified. Please verify OTP first.'
            });
            return;
          }

          if (resetData.used) {
            resolve({
              success: false,
              error: 'This reset link has already been used.'
            });
            return;
          }

          // Simulate password update (in real app, this would update database)
          console.log(`🔄 PASSWORD RESET SUCCESSFUL for ${email}`);

          // Mark token as used
          resetData.used = true;
          resetData.completedAt = Date.now();
          localStorage.setItem(`reset_${email.toLowerCase()}`, JSON.stringify(resetData));

          // Send confirmation email (simulate)
          EmailService.sendPasswordChangeConfirmation(email);

          resolve({
            success: true,
            message: 'Password reset successfully. You can now log in with your new password.'
          });

        } catch (error) {
          console.error('Password reset failed:', error);
          resolve({
            success: false,
            error: 'Failed to reset password. Please try again.'
          });
        }
      }, 1000);
    });
  },

  // Send security notifications
  sendSecurityAlert: async (email, type, details = {}) => {
    const alerts = {
      password_changed: {
        subject: 'Password Changed Successfully',
        message: 'Your HealthMate password has been changed successfully.'
      },
      suspicious_activity: {
        subject: 'Security Alert - Suspicious Activity',
        message: 'We detected unusual login activity on your account.'
      },
      new_device: {
        subject: 'New Device Login',
        message: `Your account was accessed from a new device: ${details.device || 'Unknown Device'}`
      }
    };

    console.log(`🔔 SECURITY ALERT SENT to ${email}: ${alerts[type]?.subject}`);
    return { success: true };
  },

  // Send password change confirmation
  sendPasswordChangeConfirmation: async (email) => {
    console.log(`📧 PASSWORD CHANGE CONFIRMATION SENT to ${email}`);
    console.log('Subject: Your Password Has Been Changed');
    console.log('Message: Your HealthMate password was successfully changed.');
    return { success: true };
  },

  // Validate reset token
  validateResetToken: async (token) => {
    try {
      const tokenData = atob(token);
      const [email, timestamp] = tokenData.split(':');

      if (!email) return { valid: false };

      const resetData = JSON.parse(localStorage.getItem(`reset_${email.toLowerCase()}`) || 'null');

      if (!resetData || resetData.token !== token) {
        return { valid: false };
      }

      if (Date.now() > resetData.expires) {
        localStorage.removeItem(`reset_${email.toLowerCase()}`);
        return { valid: false, expired: true };
      }

      return {
        valid: true,
        email: resetData.email,
        verified: resetData.verified || false,
        used: resetData.used || false
      };

    } catch {
      return { valid: false };
    }
  },

  // Clean up expired tokens (utility function)
  cleanupExpiredTokens: () => {
    const keys = Object.keys(localStorage);
    const resetKeys = keys.filter(key => key.startsWith('reset_'));

    resetKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (Date.now() > data.expires) {
          localStorage.removeItem(key);
          console.log(`🧹 Cleaned up expired reset token for ${key.replace('reset_', '')}`);
        }
      } catch {
        // Invalid data, remove
        localStorage.removeItem(key);
      }
    });
  },

  // Log email activities (for development monitoring)
  logEmailSent: (type, email, otp) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      email,
      otp, // Only for development
      ip: '192.168.1.100', // Mock IP
      userAgent: navigator.userAgent
    };

    const logs = JSON.parse(localStorage.getItem('email_logs') || '[]');
    logs.push(logEntry);

    // Keep only last 50 logs
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50);
    }

    localStorage.setItem('email_logs', JSON.stringify(logs));
    console.log('📋 Email log:', logEntry);
  },

  // Get email logs (development/debugging)
  getEmailLogs: () => {
    return JSON.parse(localStorage.getItem('email_logs') || '[]');
  }
};

// Auto-cleanup expired tokens every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    EmailService.cleanupExpiredTokens();
  }, 5 * 60 * 1000);
}

export default EmailService;
