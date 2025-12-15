import { Card } from '@/components/ui/Card';

export default function BrowseLoading() {
  return (
    <div aria-busy="true" aria-label="Loading services">
      <h1 className="h1">Browse services</h1>
      <p className="lead">Loading services…</p>

      <div className="toolbar">
        <div className="input skeleton" style={{ width: 320 }} />
        <div className="chips">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="chip skeleton" style={{ width: 90 }} />
          ))}
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="grid" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="skeleton" style={{ minHeight: 128 }} />
        ))}
      </div>
    </div>
  );
}
