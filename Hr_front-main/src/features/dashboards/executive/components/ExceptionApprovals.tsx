import type { ExecutiveApproval } from "../types/executiveDashboard.types";

export default function ExceptionApprovals({ approvals }: { approvals: ExecutiveApproval[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Exception Approvals</h3>
        <button className="panel-action" type="button">Policy</button>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Branch</th>
              <th>Value</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((approval) => (
              <tr key={approval.id}>
                <td>{approval.title}</td>
                <td>{approval.branchName}</td>
                <td>{approval.value}</td>
                <td>
                  <span className="pill pill-warning">{approval.type}</span>
                </td>
                <td>
                  <button className="button button-secondary" type="button">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
