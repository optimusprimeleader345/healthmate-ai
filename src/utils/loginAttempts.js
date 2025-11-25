// Account protection and login attempt tracking for enterprise security

const LoginAttemptTracker = {
  // Storage key for attempts
  ATTEMPTS_KEY: 'healthmate_login_attempts',
  LOCKOUT_KEY: 'healthmate_account_lockout',

  // Configuration
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  WINDOW_DURATION: 15 * 60 * 1000, // 15 minutes window

  // Track login attempt (success or failure)
  trackAttempt: (email, success) => {
    const now = Date.now();
    const attempts = LoginAttemptTracker.getAttempts(email);

    attempts.push({
      timestamp: now,
      success,
      email: email.toLowerCase()
    });

    // Clean old attempts outside window
    const recentAttempts = attempts.filter(
      attempt => now - attempt.timestamp < LoginAttemptTracker.WINDOW_DURATION
    );

    // Store updated attempts
    localStorage.setItem(
      `${LoginAttemptTracker.ATTEMPTS_KEY}_${email.toLowerCase()}`,
      JSON.stringify(recentAttempts)
    );

    // If failed, check for lockout
    if (!success) {
      const failedAttempts = recentAttempts.filter(a => !a.success).length;

      if (failedAttempts >= LoginAttemptTracker.MAX_ATTEMPTS) {
        LoginAttemptTracker.lockAccount(email);
      }

      return {
        attemptsRemaining: Math.max(0, LoginAttemptTracker.MAX_ATTEMPTS - failedAttempts),
        isLocked: failedAttempts >= LoginAttemptTracker.MAX_ATTEMPTS
      };
    }

    return { attemptsRemaining: LoginAttemptTracker.MAX_ATTEMPTS, isLocked: false };
  },

  // Get attempts for email
  getAttempts: (email) => {
    try {
      const stored = localStorage.getItem(
        `${LoginAttemptTracker.ATTEMPTS_KEY}_${email.toLowerCase()}`
      );
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Check if account is locked
  isAccountLocked: (email) => {
    try {
      const lockoutData = localStorage.getItem(
        `${LoginAttemptTracker.LOCKOUT_KEY}_${email.toLowerCase()}`
      );

      if (!lockoutData) return false;

      const lockout = JSON.parse(lockoutData);
      const now = Date.now();

      // Check if lockout expired
      if (now >= lockout.unlockTime) {
        LoginAttemptTracker.unlockAccount(email);
        return false;
      }

      return {
        isLocked: true,
        remainingTime: lockout.unlockTime - now,
        unlockTime: lockout.unlockTime
      };
    } catch {
      return false;
    }
  },

  // Lock account
  lockAccount: (email) => {
    const unlockTime = Date.now() + LoginAttemptTracker.LOCKOUT_DURATION;

    localStorage.setItem(
      `${LoginAttemptTracker.LOCKOUT_KEY}_${email.toLowerCase()}`,
      JSON.stringify({
        email: email.toLowerCase(),
        lockedAt: Date.now(),
        unlockTime,
        reason: 'Too many failed login attempts'
      })
    );

    // Notify admin/security team (simulated)
    console.warn(`🔒 ACCOUNT LOCKED: ${email} - Too many failed login attempts`);

    // Send alert email (simulated)
    LoginAttemptTracker.sendSecurityAlert(email, 'account_locked');
  },

  // Unlock account
  unlockAccount: (email) => {
    localStorage.removeItem(
      `${LoginAttemptTracker.LOCKOUT_KEY}_${email.toLowerCase()}`
    );

    // Send unlock notification (simulated)
    LoginAttemptTracker.sendSecurityAlert(email, 'account_unlocked');
  },

  // Get lockout status with human-readable time
  getLockoutStatus: (email) => {
    const lockoutInfo = LoginAttemptTracker.isAccountLocked(email);

    if (!lockoutInfo.isLocked) {
      return null;
    }

    const remainingMs = lockoutInfo.remainingTime;
    const minutes = Math.ceil(remainingMs / (60 * 1000));

    return {
      isLocked: true,
      message: `Account locked due to too many failed attempts.`,
      timeRemaining: `${minutes} minute${minutes !== 1 ? 's' : ''}`,
      remainingMinutes: minutes
    };
  },

  // Reset attempts on successful login
  resetAttempts: (email) => {
    localStorage.removeItem(
      `${LoginAttemptTracker.ATTEMPTS_KEY}_${email.toLowerCase()}`
    );
  },

  // Get failed attempt count in current window
  getFailedAttemptCount: (email) => {
    const attempts = LoginAttemptTracker.getAttempts(email);
    const now = Date.now();
    const recentAttempts = attempts.filter(
      attempt => now - attempt.timestamp < LoginAttemptTracker.WINDOW_DURATION
    );
    return recentAttempts.filter(attempt => !attempt.success).length;
  },

  // Security alert simulation
  sendSecurityAlert: (email, type) => {
    const alerts = {
      account_locked: {
        subject: '⚠️ Account Security Alert',
        message: `Your account has been locked due to suspicious activity. Multiple failed login attempts detected.`
      },
      account_unlocked: {
        subject: '✅ Account Unlocked',
        message: `Your account has been automatically unlocked.`
      },
      suspicious_activity: {
        subject: '🚨 Suspicious Activity Detected',
        message: `Unusual login activity detected on your account.`
      }
    };

    // Simulate email sending (in real app, this would call an API)
    console.log(`📧 EMAIL ALERT SENT to ${email}:`, alerts[type]);

    // Store in localStorage for demo purposes
    const securityEvents = JSON.parse(
      localStorage.getItem('healthmate_security_events') || '[]'
    );
    securityEvents.push({
      id: Date.now(),
      email,
      type,
      timestamp: new Date().toISOString(),
      ...alerts[type]
    });
    localStorage.setItem('healthmate_security_events', JSON.stringify(securityEvents));
  },

  // Get security events for user
  getSecurityEvents: (email) => {
    const events = JSON.parse(
      localStorage.getItem('healthmate_security_events') || '[]'
    );
    return events.filter(event => event.email.toLowerCase() === email.toLowerCase());
  },

  // Progressive delay calculation (for future enhancement)
  getProgressiveDelay: (attemptNumber) => {
    const baseDelay = 30000; // 30 seconds
    if (attemptNumber <= 3) return 0;
    if (attemptNumber === 4) return baseDelay; // 30s
    if (attemptNumber === 5) return baseDelay * 2; // 1min
    return baseDelay * 4; // 2min for subsequent attempts
  }
};

export default LoginAttemptTracker;
