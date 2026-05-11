import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/DashboardPage';
import { CreateCampaignPage } from './components/CreateCampaignPage';
import { DiscoverCreatorsPage } from './components/DiscoverCreatorsPage';
import { ApplicationsPage } from './components/ApplicationsPage';
import { CampaignsPage } from './components/CampaignsPage';
import { MessagesPage } from './components/MessagesPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { PaymentsPage } from './components/PaymentsPage';
import { SettingsPage } from './components/SettingsPage';
import { EventsPage } from './components/EventsPage';

export default function SharedDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'create-campaign':
        return <CreateCampaignPage />;
      case 'discover':
        return <DiscoverCreatorsPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'events':
        return <EventsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AppProvider navigate={setCurrentPage}>
      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-gradient-to-br from-[#5A7684] via-[#729297] to-[#D5C2B2] font-sans overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 overflow-y-auto flex flex-col">
          {renderPage()}
        </main>
      </div>
    </AppProvider>
  );
}