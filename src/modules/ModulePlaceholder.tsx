type ModulePlaceholderProps = {
  title: string;
};

export default function ModulePlaceholder({ title }: ModulePlaceholderProps) {
  return (
    <div className="dashboard-page">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">This module is under development.</p>
    </div>
  );
}
