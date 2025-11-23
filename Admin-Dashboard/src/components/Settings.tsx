import { Card } from './Card';
import { Users, Settings as SettingsIcon, Mail, Bell, Save } from 'lucide-react';

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Settings & Configuration</h1>
          <p className="text-slate-400 mt-1">Manage system settings and configurations</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => onNavigate('users')}
          className="group"
        >
          <Card className="hover:border-red-500 transition-colors">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-600 p-4 rounded-lg mb-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white mb-2">User Management</h3>
              <p className="text-slate-400">Manage users, roles, and permissions</p>
            </div>
          </Card>
        </button>

        <Card className="hover:border-red-500 transition-colors cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-600 p-4 rounded-lg mb-3">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white mb-2">System Config</h3>
            <p className="text-slate-400">General system settings</p>
          </div>
        </Card>

        <Card className="hover:border-red-500 transition-colors cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-600 p-4 rounded-lg mb-3">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white mb-2">Email Templates</h3>
            <p className="text-slate-400">Customize email/SMS templates</p>
          </div>
        </Card>

        <Card className="hover:border-red-500 transition-colors cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-600 p-4 rounded-lg mb-3">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white mb-2">Notifications</h3>
            <p className="text-slate-400">Notification preferences</p>
          </div>
        </Card>
      </div>

      {/* System Configuration */}
      <Card>
        <h3 className="text-white mb-4">System Configuration</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-2">System Name</label>
              <input
                type="text"
                defaultValue="Valenzuela Survey System"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-2">Organization</label>
              <input
                type="text"
                defaultValue="City Government of Valenzuela"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="admin@valenzuela.gov.ph"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-2">Timezone</label>
              <select className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors">
                <option>Asia/Manila (GMT+8)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Email Template Editor */}
      <Card>
        <h3 className="text-white mb-4">Email/SMS Template Editor</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-2">Template Type</label>
            <select className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors">
              <option>Survey Invitation</option>
              <option>Survey Reminder</option>
              <option>Thank You Message</option>
              <option>Survey Completion</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Subject Line</label>
            <input
              type="text"
              defaultValue="You're invited to participate in our community survey"
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Message Body</label>
            <textarea
              rows={6}
              defaultValue="Dear Resident,&#10;&#10;We value your feedback! Please take a few minutes to complete our community survey. Your responses will help us improve our services.&#10;&#10;Click here to start: [SURVEY_LINK]&#10;&#10;Thank you for your participation!&#10;City Government of Valenzuela"
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg">[SURVEY_LINK]</span>
            <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg">[RECIPIENT_NAME]</span>
            <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg">[SURVEY_TITLE]</span>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <h3 className="text-white mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white">Email Notifications</p>
              <p className="text-slate-400">Receive email updates for new responses</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white">SMS Notifications</p>
              <p className="text-slate-400">Send SMS reminders to respondents</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white">Daily Reports</p>
              <p className="text-slate-400">Receive daily analytics summary</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white">Response Threshold Alerts</p>
              <p className="text-slate-400">Alert when response count reaches target</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save All Changes
        </button>
      </div>
    </div>
  );
}
