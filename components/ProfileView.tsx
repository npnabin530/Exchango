import React, { useState } from 'react';
import { User } from '../types';
import { 
  User as UserIcon, Shield, Key, Bell, CreditCard, LogOut, 
  Camera, Edit2, CheckCircle, Smartphone, Mail, ChevronRight 
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onNotify }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'billing'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const handleSaveProfile = () => {
    setIsEditing(false);
    onNotify("Profile updated successfully", "success");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header Card */}
      <div className="glass-panel rounded-3xl p-8 mb-8 border border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-exchango-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="relative group cursor-pointer">
               <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden">
                  {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : user.name.charAt(0)}
               </div>
               <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-exchango-accent text-black border-2 border-[#0B0E14] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={14} />
               </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
               <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
               <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm">
                  <Mail size={14} /> {user.email}
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span className="text-exchango-success flex items-center gap-1"><CheckCircle size={12} /> Verified</span>
               </div>
               <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-gray-300">
                     UID: <span className="font-mono text-white">{user.id}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-gray-300">
                     Member Since: <span className="text-white">{user.memberSince}</span>
                  </div>
               </div>
            </div>

            <div className="flex gap-3">
                <button 
                  onClick={onLogout}
                  className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-colors flex items-center gap-2 font-medium"
                >
                  <LogOut size={18} /> Logout
                </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1 space-y-2">
            {[
               { id: 'overview', icon: UserIcon, label: 'Overview' },
               { id: 'security', icon: Shield, label: 'Security' },
               { id: 'billing', icon: CreditCard, label: 'Billing & Plans' },
               { id: 'notifications', icon: Bell, label: 'Notifications' },
            ].map((item) => (
               <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left px-5 py-3 rounded-xl flex items-center gap-3 transition-all ${
                     activeTab === item.id 
                     ? 'bg-exchango-accent text-black font-bold shadow-[0_0_15px_rgba(0,209,255,0.3)]' 
                     : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
               >
                  <item.icon size={18} /> {item.label}
               </button>
            ))}
         </div>

         {/* Main Content Area */}
         <div className="lg:col-span-3">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 min-h-[500px]">
               
               {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Personal Information</h2>
                        <button 
                           onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                           className="text-sm text-exchango-accent hover:text-white transition-colors flex items-center gap-1"
                        >
                           {isEditing ? 'Save Changes' : <><Edit2 size={14} /> Edit</>}
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs text-gray-500 uppercase font-bold">Full Name</label>
                           {isEditing ? (
                              <input 
                                 type="text" 
                                 value={name} 
                                 onChange={(e) => setName(e.target.value)}
                                 className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-exchango-accent outline-none"
                              />
                           ) : (
                              <div className="text-white text-lg font-medium">{name}</div>
                           )}
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs text-gray-500 uppercase font-bold">Email Address</label>
                           <div className="text-white text-lg font-medium opacity-70 cursor-not-allowed">{user.email}</div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs text-gray-500 uppercase font-bold">Phone Number</label>
                           <div className="text-white text-lg font-medium flex items-center justify-between">
                              +1 (555) 019-2834 
                              <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">Verified</span>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs text-gray-500 uppercase font-bold">Country</label>
                           <div className="text-white text-lg font-medium">United States</div>
                        </div>
                     </div>

                     <div className="border-t border-white/5 pt-8">
                        <h3 className="text-lg font-bold text-white mb-4">Account Stats</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="text-gray-400 text-xs mb-1">Total Trades</div>
                              <div className="text-2xl font-bold text-white">1,248</div>
                           </div>
                           <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="text-gray-400 text-xs mb-1">Trading Volume</div>
                              <div className="text-2xl font-bold text-white">$4.2M</div>
                           </div>
                           <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="text-gray-400 text-xs mb-1">Win Rate</div>
                              <div className="text-2xl font-bold text-exchango-success">68.4%</div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'security' && (
                  <div className="space-y-6 animate-fade-in">
                     <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                     
                     <div className="bg-white/5 rounded-xl p-5 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-exchango-accent/10 rounded-full text-exchango-accent">
                              <Key size={24} />
                           </div>
                           <div>
                              <div className="font-bold text-white">Password</div>
                              <div className="text-sm text-gray-400">Last changed 3 months ago</div>
                           </div>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
                           Change
                        </button>
                     </div>

                     <div className="bg-white/5 rounded-xl p-5 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-green-500/10 rounded-full text-green-400">
                              <Smartphone size={24} />
                           </div>
                           <div>
                              <div className="font-bold text-white">2-Factor Authentication</div>
                              <div className="text-sm text-gray-400">Enabled via Authenticator App</div>
                           </div>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer translate-x-6 border-green-400"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-green-400 cursor-pointer"></label>
                        </div>
                     </div>

                     <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                        <h3 className="font-bold text-white mb-4">Active Sessions</h3>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between pb-4 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                 <div className="text-gray-400"><CreditCard size={20} /></div> {/* Generic device icon */}
                                 <div>
                                    <div className="text-white text-sm font-medium">Chrome on Windows (Current)</div>
                                    <div className="text-xs text-gray-500">New York, USA • 192.168.1.1</div>
                                 </div>
                              </div>
                              <span className="text-green-400 text-xs font-bold px-2 py-1 bg-green-500/10 rounded">Active</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="text-gray-400"><Smartphone size={20} /></div>
                                 <div>
                                    <div className="text-white text-sm font-medium">Safari on iPhone 15 Pro</div>
                                    <div className="text-xs text-gray-500">New York, USA • 2 days ago</div>
                                 </div>
                              </div>
                              <button className="text-red-400 text-xs hover:text-red-300">Revoke</button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'billing' && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-fade-in">
                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-500 mb-6">
                        <CreditCard size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Payment Methods</h3>
                     <p className="text-gray-400 max-w-md mb-8">
                        Manage your connected bank accounts, credit cards, and crypto wallet addresses for withdrawals.
                     </p>
                     <button onClick={() => onNotify("Feature coming in next update", "info")} className="px-6 py-3 bg-exchango-accent text-black font-bold rounded-xl hover:bg-cyan-300 transition-colors">
                        Add Payment Method
                     </button>
                  </div>
               )}

            </div>
         </div>
      </div>
    </div>
  );
};