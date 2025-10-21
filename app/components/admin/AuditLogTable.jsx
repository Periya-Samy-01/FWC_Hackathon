
"use client";

const AuditLogTable = ({ logs }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {logs.map((log) => (
            <tr key={log._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.actorId?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.actionType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{JSON.stringify(log.details)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
