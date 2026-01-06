import { useState } from 'react';
import { X, Plus, Trash2, Calendar } from 'lucide-react';

interface PriceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PriceProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (proposal: {
    title: string;
    description: string;
    items: PriceItem[];
    totalPrice: number;
    discount: number;
    paymentTerms: string;
    expiresIn: number;
  }) => void;
  agentName: string;
  isLoading?: boolean;
}

export const PriceProposalModal = ({
  isOpen,
  onClose,
  onSend,
  agentName,
  isLoading = false,
}: PriceProposalModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<PriceItem[]>([
    { id: '1', description: 'Diagnostic & Assessment', quantity: 1, unitPrice: 2500, total: 2500 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('Due before service');
  const [expiresIn, setExpiresIn] = useState(24);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      if (field === 'unitPrice' || field === 'quantity') {
        const newItem = { ...item, [field]: value };
        newItem.total = newItem.quantity * newItem.unitPrice;
        return newItem;
      }
      return { ...item, [field]: value };
    }));
  };

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalPrice = Math.max(0, subtotal - discount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Send Price Proposal
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To: <span className="text-blue-600 dark:text-blue-400 font-semibold">{agentName}</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Proposal Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Windows 10 Virus Removal & Optimization"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Problem Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue the client reported..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Breakdown
              </label>
              <button
                onClick={addItem}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    placeholder="Qty"
                  />
                  <input
                    type="number"
                    value={item.unitPrice / 100}
                    onChange={(e) => updateItem(item.id, 'unitPrice', Math.round(parseFloat(e.target.value) * 100) || 0)}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    placeholder="Price"
                  />
                  <span className="w-24 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(item.total)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Discount
              </label>
              <input
                type="number"
                value={discount / 100}
                onChange={(e) => setDiscount(Math.round(parseFloat(e.target.value) * 100) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Valid for (hours)
              </label>
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>72 hours</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Terms
            </label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Due before service">Due before service</option>
              <option value="50% deposit, 50% after">50% deposit, 50% after</option>
              <option value="Due after service">Due after service (on invoice)</option>
              <option value="Payment plan available">Payment plan available</option>
            </select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 dark:text-gray-300">Discount:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-blue-200 dark:border-blue-700">
              <span className="font-semibold text-gray-900 dark:text-white">Total Estimate:</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onSend({
                title,
                description,
                items,
                totalPrice,
                discount,
                paymentTerms,
                expiresIn,
              })}
              disabled={!title || items.length === 0 || isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {isLoading ? 'Sending...' : 'Send Proposal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
