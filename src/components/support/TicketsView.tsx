import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Ticket, Clock, CheckCircle, AlertCircle, MessageCircle, Plus } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];

interface TicketsViewProps {
  onTicketSelect: (ticket: SupportTicket) => void;
  onCreateTicket: () => void;
}

export const TicketsView = ({ onTicketSelect, onCreateTicket }: TicketsViewProps) => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>(
    'all'
  );

  const isAgent = profile?.roles.includes('support_agent');

  useEffect(() => {
    loadTickets();
  }, [user, profile]);

  const loadTickets = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (isAgent) {
        query = query.or(`assigned_agent_id.eq.${user.id},assigned_agent_id.is.null`);
      } else {
        query = query.eq('customer_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets =
    filter === 'all' ? tickets : tickets.filter((ticket) => ticket.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
      case 'waiting_customer':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return Clock;
      case 'in_progress':
        return MessageCircle;
      case 'resolved':
        return CheckCircle;
      case 'closed':
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isAgent ? 'Support Tickets' : 'My Support Tickets'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isAgent
              ? 'Manage and respond to customer support requests'
              : 'Track your support requests and get help'}
          </p>
        </div>
        {!isAgent && (
          <button
            onClick={onCreateTicket}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Ticket
          </button>
        )}
      </div>

      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => {
          const count = status === 'all' ? tickets.length : tickets.filter((t) => t.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              <span className="ml-2 text-sm opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {filteredTickets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
          <Ticket className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tickets found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {!isAgent &&
              (filter === 'all'
                ? "You haven't created any support tickets yet"
                : `You don't have any ${filter.replace('_', ' ')} tickets`)}
            {isAgent && 'No tickets match this filter'}
          </p>
          {!isAgent && filter === 'all' && (
            <button
              onClick={onCreateTicket}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Your First Ticket
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const StatusIcon = getStatusIcon(ticket.status);
            return (
              <div
                key={ticket.id}
                onClick={() => onTicketSelect(ticket)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                        {ticket.ticket_number}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {ticket.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <StatusIcon className="w-6 h-6 text-gray-400 ml-4" />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(ticket.created_at)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {ticket.category}
                    </span>
                  </div>
                  {ticket.assigned_agent_id && (
                    <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                      Assigned to agent
                    </span>
                  )}
                  {!ticket.assigned_agent_id && isAgent && (
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                      Available to claim
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
