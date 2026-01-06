import { useState } from 'react';
import { Send, Check, X, MessageCircle } from 'lucide-react';

interface ProposalMessage {
  id: string;
  from: 'agent' | 'client';
  type: 'message' | 'proposal' | 'counter' | 'acceptance' | 'rejection';
  text?: string;
  amount?: number;
  reason?: string;
  timestamp: Date;
}

interface PriceNegotiationChatProps {
  agentName: string;
  clientName: string;
  initialProposal: number;
  onAccept: (amount: number) => void;
  onReject: () => void;
  isAgent: boolean;
  isLoading?: boolean;
}

export const PriceNegotiationChat = ({
  agentName,
  clientName,
  initialProposal,
  onAccept,
  onReject,
  isAgent,
  isLoading = false,
}: PriceNegotiationChatProps) => {
  const [messages, setMessages] = useState<ProposalMessage[]>([
    {
      id: '1',
      from: 'agent',
      type: 'proposal',
      amount: initialProposal,
      timestamp: new Date(),
    },
  ]);
  const [counterAmount, setCounterAmount] = useState('');
  const [reason, setReason] = useState('');

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleCounterOffer = () => {
    if (!counterAmount) return;

    const amount = Math.round(parseFloat(counterAmount) * 100);
    setMessages([...messages, {
      id: Date.now().toString(),
      from: isAgent ? 'agent' : 'client',
      type: 'counter',
      amount,
      reason: reason || undefined,
      timestamp: new Date(),
    }]);

    setCounterAmount('');
    setReason('');
  };

  const handleAccept = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.amount) {
      setMessages([...messages, {
        id: Date.now().toString(),
        from: isAgent ? 'agent' : 'client',
        type: 'acceptance',
        amount: message.amount,
        timestamp: new Date(),
      }]);
      onAccept(message.amount);
    }
  };

  const lastProposal = [...messages].reverse().find(m =>
    m.type === 'proposal' || m.type === 'counter'
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Price Negotiation
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {agentName} <span className="text-gray-400">↔</span> {clientName}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isFromMe = (isAgent && msg.from === 'agent') || (!isAgent && msg.from === 'client');
          const sender = msg.from === 'agent' ? agentName : clientName;

          return (
            <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm ${isFromMe ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'} rounded-lg p-4 border ${!isFromMe ? 'border-gray-200 dark:border-gray-700' : ''}`}>
                {msg.type === 'proposal' || msg.type === 'counter' ? (
                  <div className="space-y-3">
                    <div className="text-sm font-medium">
                      {msg.type === 'proposal' ? 'Proposed Price:' : 'Counter Offer:'}
                    </div>
                    <div className="text-3xl font-bold">
                      {formatPrice(msg.amount || 0)}
                    </div>
                    {msg.reason && (
                      <div className={`text-sm ${isFromMe ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        "{msg.reason}"
                      </div>
                    )}

                    {msg.from === 'agent' ? (
                      !isAgent && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAccept(msg.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => setMessages([...messages, {
                              id: Date.now().toString(),
                              from: 'client',
                              type: 'counter',
                              amount: undefined,
                              timestamp: new Date(),
                            }])}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                          >
                            <X className="w-4 h-4" />
                            Counter
                          </button>
                        </div>
                      )
                    ) : (
                      isAgent && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAccept(msg.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => setMessages([...messages, {
                              id: Date.now().toString(),
                              from: 'agent',
                              type: 'counter',
                              amount: undefined,
                              timestamp: new Date(),
                            }])}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                          >
                            <X className="w-4 h-4" />
                            Counter
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ) : msg.type === 'acceptance' ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Accepted {formatPrice(msg.amount || 0)}</span>
                  </div>
                ) : (
                  <div className="text-sm">{msg.text}</div>
                )}

                <div className={`text-xs mt-2 ${isFromMe ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lastProposal && lastProposal.from !== (isAgent ? 'agent' : 'client') && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Counter Offer
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why this price?"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <button
            onClick={handleCounterOffer}
            disabled={!counterAmount || isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            <Send className="w-4 h-4" />
            Send Counter Offer
          </button>
        </div>
      )}

      {lastProposal?.from === (isAgent ? 'agent' : 'client') && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex gap-2">
          <button
            onClick={() => handleAccept(lastProposal.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={onReject}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
};
