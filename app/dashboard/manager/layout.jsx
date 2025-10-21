import AIAssistant from '../../components/AIAssistant';

export default function ManagerLayout({ children }) {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div>
        <main>{children}</main>
        <AIAssistant />
      </div>
    </div>
  );
}