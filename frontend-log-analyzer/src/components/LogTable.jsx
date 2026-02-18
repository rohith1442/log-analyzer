import React from "react";

const LogTable = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <p style={{ textAlign: "center" }}>No logs found.</p>;
  }

  return (
    <table className="log-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Level</th>
          <th>Service</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log._id}>
            <td>
              {new Date(log.timestamp).toLocaleString()}
            </td>

            <td
              className={
                log.level === "ERROR"
                  ? "level-error"
                  : log.level === "WARN"
                  ? "level-warn"
                  : "level-info"
              }
            >
              {log.level}
            </td>

            <td>{log.service}</td>

            <td>{log.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LogTable;
