import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resources, actions, type ApiRecord } from "../../../../services/api/resources";
import { getCurrentUserRole } from "../../../../services/permissions";

const text = (item: ApiRecord, field: string) => String(item[field] ?? "—");
const publishers = new Set(["System Admin", "Executive", "HR", "Manager"]);

function PriorityBadge({ priority }: { priority: string }) {
  const color = {
    Urgent: "bg-red-100 text-red-700 border-red-300",
    High: "bg-amber-100 text-amber-800 border-amber-300",
    Normal: "bg-blue-100 text-blue-700 border-blue-300",
    Low: "bg-slate-100 text-slate-600 border-slate-300",
  }[priority] ?? "bg-slate-100 text-slate-600 border-slate-300";
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${color}`}>{priority}</span>;
}

function AudienceBadge({ audience }: { audience: string }) {
  const color = {
    All: "bg-purple-100 text-purple-700",
    Employees: "bg-emerald-100 text-emerald-700",
    Managers: "bg-indigo-100 text-indigo-700",
    HR: "bg-pink-100 text-pink-700",
    "Department Heads": "bg-cyan-100 text-cyan-700",
  }[audience] ?? "bg-gray-100 text-gray-600";
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${color}`}>{audience}</span>;
}

function formatDate(iso: string) {
  if (!iso || iso === "—") return "—";
  try { return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); } catch { return iso; }
}

export default function AnnouncementsTrainingPage({ employeeOnly = false }: { employeeOnly?: boolean }) {
  const client = useQueryClient();
  const role = getCurrentUserRole() ?? "Employee";
  const canPublish = !employeeOnly && publishers.has(role);

  const [form, setForm] = useState({ title: "", content: "", target_audience: "All", priority: "Normal" });
  const [message, setMessage] = useState("");

  const announcements = useQuery({ queryKey: ["announcements"], queryFn: () => resources.announcements.list() });
  const trainings = useQuery({ queryKey: ["trainings"], queryFn: () => resources.trainings.list() });

  const publish = useMutation({
    mutationFn: () => resources.announcements.create({ ...form, is_active: true } as never),
    onSuccess: () => {
      setForm({ title: "", content: "", target_audience: "All", priority: "Normal" });
      setMessage("Announcement published successfully.");
      client.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: () => setMessage("Could not publish the announcement."),
  });

  const enroll = useMutation({
    mutationFn: (id: number) => actions.enrollInTraining(id),
    onSuccess: () => {
      setMessage("Training enrollment saved.");
      client.invalidateQueries({ queryKey: ["training-enrollments"] });
    },
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <main className="dashboard-page">
      <header className="mb-6">
        <p className="page-kicker">{employeeOnly ? "Employee self-service" : "HR operations"}</p>
        <h1 className="page-title">Announcements & training</h1>
        <p className="page-subtitle">
          Live organization updates and training sessions.{" "}
          {canPublish
            ? "You can publish updates for the audience you select."
            : "Only Executive, Manager, and HR users can publish announcements."}
        </p>
      </header>

      {message && (
        <div className="alert alert-success mb-5">
          {message}
          <button
            type="button"
            onClick={() => setMessage("")}
            className="ml-2 text-xs opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {canPublish && (
        <section className="panel mb-6">
          <div className="panel-header">
            <h2 className="panel-title">Publish announcement</h2>
          </div>
          <form
            className="panel-body"
            onSubmit={(e) => {
              e.preventDefault();
              publish.mutate();
            }}
          >
            <div className="form-grid">
              <label className="field-group">
                <span className="field-label">Title</span>
                <input
                  required
                  className="field-input"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g., New leave policy effective August"
                />
              </label>
              <label className="field-group">
                <span className="field-label">Audience</span>
                <select
                  className="field-input"
                  value={form.target_audience}
                  onChange={(e) => update("target_audience", e.target.value)}
                >
                  <option>All</option>
                  <option>Employees</option>
                  <option>Managers</option>
                  <option>HR</option>
                  <option>Department Heads</option>
                </select>
              </label>
              <label className="field-group">
                <span className="field-label">Priority</span>
                <select
                  className="field-input"
                  value={form.priority}
                  onChange={(e) => update("priority", e.target.value)}
                >
                  <option>Normal</option>
                  <option>Low</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </label>
            </div>
            <label className="field-group">
              <span className="field-label">Message</span>
              <textarea
                required
                className="field-input"
                rows={4}
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                placeholder="Describe the update and any action required by recipients."
              />
            </label>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="button button-primary"
                disabled={publish.isPending}
              >
                {publish.isPending ? "Publishing…" : "Publish announcement"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel mb-6">
        <div className="panel-header">
          <h2 className="panel-title">Announcements</h2>
          <span className="text-xs text-gray-500">{announcements.data?.length ?? 0} published</span>
        </div>
        <div className="panel-body">
          {announcements.isLoading ? (
            <p className="text-sm text-gray-500">Loading announcements…</p>
          ) : announcements.data?.length ? (
            <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
              {announcements.data.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <PriorityBadge priority={text(item, "priority")} />
                    <AudienceBadge audience={text(item, "target_audience")} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{text(item, "title")}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{text(item, "content")}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Published {formatDate(text(item, "published_at"))}</span>
                    {text(item, "expires_at") !== "—" && (
                      <span className="text-amber-600">Expires {formatDate(text(item, "expires_at"))}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">No announcements published yet.</p>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Training sessions</h2>
          <span className="text-xs text-gray-500">{trainings.data?.length ?? 0} available</span>
        </div>
        <div className="panel-body">
          {trainings.isLoading ? (
            <p className="text-sm text-gray-500">Loading training sessions…</p>
          ) : trainings.data?.length ? (
            <div className="space-y-3">
              {trainings.data.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{text(item, "title")}</h3>
                      {String(item.is_mandatory ?? "").toLowerCase() === "true" && (
                        <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 text-[11px] font-semibold">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-1">{text(item, "description")}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
                      <span>{formatDate(text(item, "start_date"))} – {formatDate(text(item, "end_date"))}</span>
                      {text(item, "venue") !== "—" && <span>📍 {text(item, "venue")}</span>}
                      {text(item, "trainer") !== "—" && <span>👤 {text(item, "trainer")}</span>}
                      <span
                        className={
                          String(item.status ?? "").toLowerCase() === "completed"
                            ? "text-green-600 font-semibold"
                            : String(item.status ?? "").toLowerCase() === "cancelled"
                            ? "text-red-600 font-semibold"
                            : "text-blue-600 font-semibold"
                        }
                      >
                        {text(item, "status")}
                      </span>
                    </div>
                  </div>
                  <div className="sm:ml-4">
                    {employeeOnly ? (
                      <button
                        className="button button-secondary button-sm"
                        onClick={() => enroll.mutate(Number(item.id))}
                        disabled={enroll.isPending}
                      >
                        {enroll.isPending ? "Enrolling…" : "Enroll"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">
                        {String(item.max_participants ?? "—")} seats
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">No training sessions available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
