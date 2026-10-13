import { useState } from 'react';
import AdminSidebar from '../../components/sidebar/AdminSidebar';
import AdminNavbar from '../../components/navbar/AdminNavbar';

const AdminLayout = ({ children, title = 'Admin Console' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout-container">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="admin-main-content">
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <main style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
