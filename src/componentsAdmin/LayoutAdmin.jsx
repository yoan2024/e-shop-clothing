// Importing the Dashboard component that serves as the main content of the admin layout
import Dashboard from "../page/admin/Dashboard";

// LayoutAdmin is a wrapper component for admin pages.
// It renders the main admin dashboard.
const LayoutAdmin = () => {
  return (
    <>
      {/* Rendering the main admin dashboard */}
      <Dashboard />
    </>
  );
};

export default LayoutAdmin;
