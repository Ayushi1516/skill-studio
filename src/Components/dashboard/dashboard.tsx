import { useState, useEffect } from 'react';
// @ts-ignore: CSS module declarations not available in this project
import './Dashboard.css';
import SettingsTab from './SettingsTab';
import HelpTab from './HelpTab';
import MyCoursesTab from './MyCoursesTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'courses' | 'help' | 'settings'>('courses');

  return (
    <div className="dashboard-layout">
      <aside className="sidenav">
        <nav>
          <button
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
          </button>
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
         {activeTab === 'help' && (<HelpTab />)}
         {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </main>
    </div>
  );
}