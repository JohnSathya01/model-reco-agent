import React, { useState } from 'react';
import { X, Link as LinkIcon, Mail, Copy, Check, Users, Eye, Edit3, Shield } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, projectName = 'ML Recommendation Project' }) => {
  const [shareLink] = useState('https://ml-reco.app/project/abc123xyz');
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit' | 'admin'>('edit');
  const [sharedWith, setSharedWith] = useState([
    { email: 'sarah@company.com', name: 'Sarah Chen', permission: 'edit', status: 'active' },
    { email: 'john@company.com', name: 'John Doe', permission: 'view', status: 'active' },
  ]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (email) {
      setSharedWith([...sharedWith, { 
        email, 
        name: email.split('@')[0], 
        permission, 
        status: 'pending' 
      }]);
      setEmail('');
    }
  };

  const handleRemoveAccess = (emailToRemove: string) => {
    setSharedWith(sharedWith.filter(user => user.email !== emailToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Share Project</h2>
              <p className="text-sm text-blue-100">{projectName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Invite Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite people
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
                />
              </div>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleInvite}
                disabled={!email}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Invite
              </button>
            </div>
          </div>

          {/* Share Link Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Share link</label>
              <span className="text-xs text-gray-500">Anyone with the link can access</span>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* People with Access */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              People with access ({sharedWith.length})
            </h3>
            <div className="space-y-2">
              {sharedWith.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    {user.status === 'pending' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={user.permission}
                      onChange={(e) => {
                        const updated = [...sharedWith];
                        updated[index].permission = e.target.value as any;
                        setSharedWith(updated);
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="view">Can view</option>
                      <option value="edit">Can edit</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleRemoveAccess(user.email)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Permission levels</h4>
            <div className="space-y-2 text-xs text-blue-800">
              <div className="flex items-start space-x-2">
                <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Can view:</span> Can see all project details and recommendations
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Edit3 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Can edit:</span> Can modify project settings and generate new recommendations
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Admin:</span> Full access including sharing and deleting the project
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
