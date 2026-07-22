import { useQuery } from "@tanstack/react-query";
import { resources, type ApiRecord } from "../../../../services/api/resources";

const text = (item: ApiRecord, field: string) => String(item[field] ?? "—");

export default function AnnouncementsTrainingPage() {
  const announcements = useQuery({ queryKey: ["announcements"], queryFn: () => resources.announcements.list() });
  const trainings = useQuery({ queryKey: ["trainings"], queryFn: () => resources.trainings.list() });
  const error = announcements.error ?? trainings.error;
  return <div className="dashboard-page" style={{ display: "grid", gap: 18 }}>
    <div><h1 className="page-title">Announcements & Training</h1><p className="page-subtitle">Live messages and training sessions from HR Operations.</p></div>
    {error && <div className="alert alert-error">{error.message}</div>}
    <section className="panel"><div className="panel-header"><h2 className="panel-title">Announcements</h2></div><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Title</th><th>Audience</th><th>Published</th><th>Expires</th><th>Posted by</th></tr></thead><tbody>{announcements.isLoading ? <tr><td colSpan={5}>Loading announcements…</td></tr> : announcements.data?.length ? announcements.data.map((item) => <tr key={item.id}><td><strong>{text(item, "title")}</strong><div style={{ color: "var(--text-secondary)", fontSize: ".8rem" }}>{text(item, "body")}</div></td><td>{text(item, "audience")}</td><td>{text(item, "publish_at")}</td><td>{text(item, "expires_at")}</td><td>{text(item, "posted_by_name")}</td></tr>) : <tr><td colSpan={5}>No announcements published.</td></tr>}</tbody></table></div></section>
    <section className="panel"><div className="panel-header"><h2 className="panel-title">Training sessions</h2></div><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Training</th><th>Trainer</th><th>Schedule</th><th>Location</th><th>Enrollments</th><th>Status</th></tr></thead><tbody>{trainings.isLoading ? <tr><td colSpan={6}>Loading training sessions…</td></tr> : trainings.data?.length ? trainings.data.map((item) => <tr key={item.id}><td>{text(item, "title")}</td><td>{text(item, "trainer_name")}</td><td>{text(item, "start_date")} – {text(item, "end_date")}</td><td>{text(item, "location")}</td><td>{text(item, "enrolled_count")}</td><td>{text(item, "status")}</td></tr>) : <tr><td colSpan={6}>No training sessions found.</td></tr>}</tbody></table></div></section>
  </div>;
}
