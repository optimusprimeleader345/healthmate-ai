import React, { useState, useEffect } from 'react';
import { Video, Calendar, MessageSquare, Clock, Filter, Star, Shield, Search, Phone, MapPin, Activity } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { telemedicineService } from '../services/telemedicineService';

const Telemedicine = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const specialties = [
    { id: 'all', name: 'All Specialties' },
    { id: 'primary', name: 'Primary Care' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'mental-health', name: 'Mental Health' },
    { id: 'dermatology', name: 'Dermatology' },
    { id: 'women', name: 'Women\'s Health' }
  ];

  // Load providers on component mount
  useEffect(() => {
    loadProviders();
    loadAppointments();
  }, []);

  const loadProviders = async () => {
    try {
      const result = await telemedicineService.getAvailableProviders();
      if (result.success) {
        setProviders(result.providers);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading providers:', error);
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const result = await telemedicineService.getUpcomingAppointments('current-user');
      if (result.success) {
        setUpcomingAppointments(result.appointments.slice(0, 3)); // Show next 3
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleBookAppointment = async (providerId) => {
    // Mock booking - in real app would show date/time picker
    const appointmentData = {
      patientId: 'current-user',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      reason: 'General consultation'
    };

    try {
      const result = await telemedicineService.scheduleAppointment(providerId, appointmentData);
      if (result.success) {
        alert(`Appointment booked successfully! Meeting link: ${result.appointment.meetingLink}`);
        loadAppointments(); // Refresh appointments
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const handleStartCall = async (appointmentId) => {
    try {
      const result = await telemedicineService.startVideoCall(appointmentId);
      if (result.success) {
        alert(`Video call started! Visit: ${result.callData.meetingLink}`);
      }
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  // Filter providers based on search and specialty
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' ||
                           provider.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading healthcare providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Video className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Telemedicine Platform</h1>
          <p className="text-gray-600">Connect with healthcare providers virtually • $45B market opportunity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-500" />
              Emergency Care
            </h3>
            <Button className="w-full bg-red-500 hover:bg-red-600 mb-3">
              <Phone className="h-4 w-4 mr-2" />
              Emergency Call
            </Button>

            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Secure Messaging
            </h3>
            <Button variant="outline" className="w-full mb-4">
              <MessageSquare className="h-4 w-4 mr-2" />
              Provider Inbox
            </Button>

            {/* Platform Stats */}
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Active Doctors</span>
                <span className="font-semibold text-green-600">{providers.filter(p => p.onlineNow).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Response</span>
                <span className="font-semibold">2.3 hrs</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate</span>
                <span className="font-semibold text-green-600">98.7%</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Your Appointments
            </h3>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                No upcoming appointments
                <p className="text-xs mt-2">Book with any provider below</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appt, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-blue-900">
                      Virtual Consultation
                    </div>
                    <div className="text-xs text-blue-700">
                      {new Date(appt.dateTime).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-blue-600">
                      {appt.reason}
                    </div>
                    <Button
                      onClick={() => handleStartCall(appt.id)}
                      className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-xs py-1"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Join Call
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Specialty Filter */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Specialty Filter
            </h3>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {specialties.map(specialty => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search doctors by name, specialty, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{filteredProviders.length} doctors available</span>
              <span>📞 24/7 Emergency: Available</span>
            </div>
          </Card>

          {/* Provider Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProviders.map(provider => (
              <Card key={provider.id} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    {provider.photo}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{provider.rating}</span>
                        <span className="text-xs text-gray-600">({provider.reviews})</span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {provider.specialty}
                      </span>
                      {provider.onlineNow && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🔴 Online Now
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <span>{provider.education} • {provider.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{provider.location.city}, {provider.location.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-green-500" />
                        <span>Average response: {provider.averageResponse}</span>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">${provider.consultationFee}/consultation</div>
                      <div className="text-xs text-gray-600">
                        Insurance: {provider.insurance.slice(0, 2).join(', ')} {provider.insurance.length > 2 ? `+${provider.insurance.length - 2} more` : ''}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBookAppointment(provider.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                      {provider.onlineNow && (
                        <Button
                          onClick={() => handleStartCall(`appt-${provider.id}`)}
                          className="px-4 bg-blue-500 hover:bg-blue-600"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredProviders.length === 0 && !loading && (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                <p>Try adjusting your search criteria or specialty filter</p>
              </div>
            </Card>
          )}

          {/* How Telemedicine Works */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">🚀 How Telemedicine Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Find Your Doctor</h3>
                <p className="text-sm text-gray-600">Browse available providers by specialty, rating, and availability. Check insurance coverage and languages spoken.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Book Your Visit</h3>
                <p className="text-sm text-gray-600">Schedule your appointment instantly. Get insurance verification and preparation instructions. No waiting rooms required.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Connect Virtually</h3>
                <p className="text-sm text-gray-600">Join your secure video call from home. Get personalized care from board-certified physicians. Follow-up care via secure messaging.</p>
              </div>
            </div>
          </Card>

          {/* Market Opportunity Banner */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Activity className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-blue-900">$45B Market Opportunity</span>
              </div>
              <p className="text-gray-700 mb-4">
                The telemedicine market is projected to reach $45 billion by 2026. You're building the platform that will serve millions of patients and generate significant revenue through virtual consultations, provider networks, and healthcare partnerships.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600 text-lg">22%</div>
                  <div className="text-gray-600">Annual Growth</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600 text-lg">$89-150</div>
                  <div className="text-gray-600">Per Consultation</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600 text-lg">50%</div>
                  <div className="text-gray-600">Insurance Covered</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-600 text-lg">1M+</div>
                  <div className="text-gray-600">Monthly Visits</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Telemedicine;
