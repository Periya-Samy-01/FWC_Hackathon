import Link from 'next/link';

const AdminSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-30 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed top-0 left-0 w-64 bg-gray-800 text-white h-full p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 md:h-auto`}>
        <h2 className="text-2xl font-bold mb-8 text-white">Admin Menu</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/dashboard/admin" className="block py-2 px-4 rounded hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/dashboard/admin/company-settings" className="block py-2 px-4 rounded hover:bg-gray-700">
                Company Settings
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/dashboard/admin/audit-log" className="block py-2 px-4 rounded hover:bg-gray-700">
                Audit Logs
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
