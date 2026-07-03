type ModulePlaceholderPageProps = {
  title: string;
};

export default function ModulePlaceholderPage({ title }: ModulePlaceholderPageProps) {
  return (
    <div className="dashboard-page">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">This module is under development.</p>
    </div>
  );
}
