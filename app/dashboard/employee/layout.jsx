import AIAssistant from '../../components/AIAssistant';

export default function EmployeeLayout({ children }) {
  return (
    <div>
      <div>
        <main>{children}</main>
        <AIAssistant />
      </div>
    </div>
  );
}