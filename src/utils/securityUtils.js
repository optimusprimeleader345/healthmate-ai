export const getMockSessions = () => [
  {
    deviceName: 'Chrome on Windows',
    location: 'Mumbai, India',
    ip: '192.168.1.100',
    lastActive: '2 hours ago'
  },
  {
    deviceName: 'Safari on iPhone',
    location: 'Mumbai, India',
    ip: '192.168.1.101',
    lastActive: '1 day ago'
  },
  {
    deviceName: 'Chrome on MacBook',
    location: 'Mumbai, India',
    ip: '192.168.1.102',
    lastActive: '3 days ago'
  }
];

export const getMockLoginHistory = () => [
  {
    date: '2023-11-22 10:30 AM',
    device: 'Chrome on Windows',
    location: 'Mumbai, India',
    status: 'success'
  },
  {
    date: '2023-11-21 8:15 PM',
    device: 'Safari on iPhone',
    location: 'Mumbai, India',
    status: 'failed'
  },
  {
    date: '2023-11-20 3:45 PM',
    device: 'Chrome on MacBook',
    location: 'Mumbai, India',
    status: 'success'
  }
];

export const getSecurityStatus = () => ({
  riskLevel: 'low',
  lastPasswordChange: '30 days ago',
  mfaEnabled: true
});
