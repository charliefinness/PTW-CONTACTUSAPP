import { useState, useEffect } from 'react';
import { supabase, Contact } from '../lib/supabase';
import { Users, Filter, Mail, Phone, MessageSquare, Calendar, LogOut } from 'lucide-react';

export default function CRMDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(contacts.filter((c) => c.status === statusFilter));
    }
  }, [statusFilter, contacts]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', contactId);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const updateContactNotes = async (contactId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', contactId);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryForService = (service: string): string => {
    if (
      [
        'Job Training / Certifications',
        'Paid Work & Job Placement',
        'Reentry Employment Help',
        'Youth Job Readiness',
        'Skilled Trades Training',
      ].includes(service)
    ) {
      return 'Employment & Training';
    } else if (
      [
        'Reentry Support Services',
        'Care Management Support',
        'Help Getting ID / Documents',
        'Mental Health / Recovery Help',
      ].includes(service)
    ) {
      return 'Reentry & Case Support';
    } else if (
      ['Eviction Help / Tenant Rights', 'Emergency Financial Help', 'Transportation Assistance'].includes(
        service
      )
    ) {
      return 'Housing & Stability';
    } else if (['Food Assistance', 'Clothing Assistance', 'General Community Help'].includes(service)) {
      return 'Basic Needs';
    } else if (
      [
        'Justice-Impacted Women',
        'Foster / Transition-Age Youth',
        'DOR Employment Services',
        'Employed Client Emergency Help',
      ].includes(service)
    ) {
      return 'Special Programs';
    } else if (['Not Sure — Need Guidance', 'Referred by Another Agency'].includes(service)) {
      return 'Intake / Routing';
    }
    return 'Other';
  };

  const statuses = ['all', 'new', 'contacted', 'in_progress', 'completed'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Contact Management</h1>
                  <p className="text-emerald-100">Reentry Non-Profit CRM</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">Filter by Status:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      statusFilter === status
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="ml-auto">
                <span className="text-sm font-semibold text-gray-700">
                  Total: {filteredContacts.length} contacts
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-gray-600">Loading contacts...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No contacts found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {contact.first_name} {contact.last_name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${contact.email}`} className="hover:text-emerald-600">
                              {contact.email}
                            </a>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:${contact.phone}`} className="hover:text-emerald-600">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            contact.status
                          )}`}
                        >
                          {contact.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                        Services Requested ({contact.interests?.length || 0})
                      </label>
                      {contact.interests && contact.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {contact.interests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No services selected</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Submitted
                      </label>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(contact.created_at).toLocaleDateString()} at{' '}
                        {new Date(contact.created_at).toLocaleTimeString()}
                      </p>
                    </div>

                    {contact.message && (
                      <div className="mb-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-1">
                          <MessageSquare className="w-3 h-3" />
                          Message
                        </label>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {contact.message}
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                        Internal Notes
                      </label>
                      <textarea
                        value={contact.notes || ''}
                        onChange={(e) => {
                          const updatedContacts = contacts.map((c) =>
                            c.id === contact.id ? { ...c, notes: e.target.value } : c
                          );
                          setContacts(updatedContacts);
                        }}
                        onBlur={(e) => updateContactNotes(contact.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        rows={2}
                        placeholder="Add internal notes..."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                        Update Status
                      </label>
                      <select
                        value={contact.status}
                        onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
