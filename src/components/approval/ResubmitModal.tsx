import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle } from 'lucide-react';

interface ResubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string, addressedChanges: string[]) => void;
  projectTitle: string;
  changeRequests: Array<{
    id: string;
    reason: string;
    priority: 'low' | 'medium' | 'high';
    requestedBy: {
      name: string;
    };
  }>;
}

export const ResubmitModal: React.FC<ResubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectTitle,
  changeRequests
}) => {
  const [notes, setNotes] = useState('');
  const [addressedChanges, setAddressedChanges] = useState<string[]>(
    changeRequests.map(cr => cr.id)
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (addressedChanges.length === 0) {
      alert('Please select at least one change request that you have addressed.');
      return;
    }
    onSubmit(notes, addressedChanges);
    setNotes('');
    setAddressedChanges(changeRequests.map(cr => cr.id));
  };

  const toggleChange = (changeId: string) => {
    setAddressedChanges(prev =>
      prev.includes(changeId)
        ? prev.filter(id => id !== changeId)
        : [...prev, changeId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Resubmit for Review</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Project Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <p className="text-gray-900 font-medium">{projectTitle}</p>
          </div>

          {/* Change Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Change Requests to Address
            </label>
            <div className="space-y-3">
              {changeRequests.map((change) => (
                <div
                  key={change.id}
                  className={`border rounded-lg p-4 transition-all ${
                    addressedChanges.includes(change.id)
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={addressedChanges.includes(change.id)}
                      onChange={() => toggleChange(change.id)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Requested by {change.requestedBy.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(
                            change.priority
                          )}`}
                        >
                          {change.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{change.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary of Changes Made
              <span className="text-gray-500 font-normal ml-1">(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what changes you made to address the feedback..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Resubmission Process</p>
              <p>
                The recommendation will be sent back to the original reviewer for re-evaluation.
                They will be notified of your changes and can approve or request further modifications.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {addressedChanges.length} of {changeRequests.length} change request(s) addressed
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={addressedChanges.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Resubmit for Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
