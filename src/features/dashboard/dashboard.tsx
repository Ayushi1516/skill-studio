import { useState, useEffect, useCallback } from 'react';
// @ts-ignore: CSS module declarations not available in this project
import './Dashboard.css';
import HelpTab from './tabs/HelpTab';
import { useAuth } from '../../context/AuthContext';

import { User } from '../../types/interfaces';
import { API_URL } from '../../constants';
import toast from 'react-hot-toast';
import MyCoursesTab from './tabs/MyCoursesTab';
import SettingsTab from './tabs/SettingsTab';
import UserListTab from './tabs/UserListTab';

export default function Dashboard() {
  const {currentUser} = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'users' | 'instructor' | 'help' | 'settings'>(
    currentUser?.role === 'admin' ? 'users' : 'courses'
  );
  
  // Shared state for users to prevent multiple API calls
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchUserList = useCallback(async () => {
    if (allUsers.length > 0 || usersLoading) return; // Prevent call if data exists
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setAllUsers(data);
    } catch (error) {
      toast.error("Unable to fetch user list");
    } finally {
      setUsersLoading(false);
    }
  }, [allUsers.length, usersLoading]);

  useEffect(() => {
    // Automatically fetch user data if the active tab requires it
    if (activeTab === 'users' || activeTab === 'instructor') {
      fetchUserList();
    }
  }, [activeTab, fetchUserList]);

  return (
    <div className="dashboard-layout">
      <aside className="sidenav">
        <nav>
          {currentUser?.role !=='admin' ? (<><button
            className={`sidenav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            My Courses
          </button>
          <button
            className={`sidenav-item ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            Help
          </button></>) : (<>
          <button
            className={`sidenav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); fetchUserList(); }}
          >
            Users
          </button>
          <button
            className={`sidenav-item ${activeTab === 'instructor' ? 'active' : ''}`}
            onClick={() => { setActiveTab('instructor'); fetchUserList(); }}
          >
            Instructor
          </button>
          </>)}

          <button
            className={`sidenav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </aside>

      <main className="dashboard-container">
        {activeTab === 'courses' && (<MyCoursesTab />)}
        {activeTab === 'users' && (<UserListTab role="user" data={allUsers} loading={usersLoading}/>)}
        {activeTab === 'instructor' && (<UserListTab role='instructor' data={allUsers} loading={usersLoading}/>)}
         {activeTab === 'help' && (<HelpTab />)}
         {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </main>
    </div>
  );
}