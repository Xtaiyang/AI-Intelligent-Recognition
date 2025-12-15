'use client';

import { z } from 'zod';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { McpServiceDto } from '@/types/McpServiceDto';

type ServicesResponse = { services: McpServiceDto[] };

type ServiceResponse = { service: McpServiceDto };

type ErrorResponse = {
  error: string;
  issues?: Record<string, string[] | undefined>;
};

type FormState = {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string;
  pricing: string;
  status: McpServiceDto['status'];
  contactInfo: string;
};

const statusOptions: Array<McpServiceDto['status']> = ['active', 'draft', 'archived'];

const formSchema = z.object({
  id: z.string().trim(),
  title: z.string().trim().min(1, 'Title is required'),
  summary: z.string().trim().min(1, 'Summary is required'),
  category: z.string().trim().min(1, 'Category is required'),
  tags: z.string().trim(),
  pricing: z.string().trim().min(1, 'Pricing is required'),
  status: z.enum(['active', 'draft', 'archived']),
  contactInfo: z.string().trim(),
});

function emptyForm(): FormState {
  return {
    id: '',
    title: '',
    summary: '',
    category: '',
    tags: '',
    pricing: 'Free',
    status: 'draft',
    contactInfo: '',
  };
}

function tagsToString(tags: string[]) {
  return tags.join(', ');
}

function tagsFromString(tags: string) {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export function AdminServicesClient() {
  const [services, setServices] = useState<McpServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const [saving, setSaving] = useState(false);
  const [deletingIds, setDeletingIds] = useState(() => new Set<string>());

  const sortedServices = useMemo(() => {
    return services.slice().sort((a, b) => a.title.localeCompare(b.title));
  }, [services]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/services', { cache: 'no-store' });
        const json = await parseJson<ServicesResponse | ErrorResponse>(res);
        if (!res.ok) {
          setError('Unable to load services');
          return;
        }
        const data = json as ServicesResponse;
        setServices(data.services);
      } catch {
        setError('Unable to load services');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const openCreate = () => {
    setMode('create');
    setEditingId(null);
    setForm(emptyForm());
    setFieldErrors({});
    setOpen(true);
  };

  const openEdit = (service: McpServiceDto) => {
    setMode('edit');
    setEditingId(service.id);
    setForm({
      id: service.id,
      title: service.title,
      summary: service.summary,
      category: service.category,
      tags: tagsToString(service.tags),
      pricing: service.pricing,
      status: service.status,
      contactInfo: service.contactInfo,
    });
    setFieldErrors({});
    setOpen(true);
  };

  const validate = () => {
    const parsed = formSchema.safeParse(form);
    if (parsed.success) {
      setFieldErrors({});
      return parsed.data;
    }

    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FormState | undefined;
      if (key && !nextErrors[key]) nextErrors[key] = issue.message;
    }

    setFieldErrors(nextErrors);
    return null;
  };

  const onSave = async () => {
    const parsed = validate();
    if (!parsed) return;

    if (mode === 'create' && parsed.id && services.some((s) => s.id === parsed.id)) {
      setFieldErrors((prev) => ({ ...prev, id: 'ID already exists' }));
      return;
    }

    const payload = {
      ...(mode === 'create' && parsed.id ? { id: parsed.id } : {}),
      title: parsed.title,
      summary: parsed.summary,
      category: parsed.category,
      tags: tagsFromString(parsed.tags),
      pricing: parsed.pricing,
      status: parsed.status,
      contactInfo: parsed.contactInfo,
    };

    setSaving(true);
    setError(null);

    if (mode === 'create') {
      const optimisticId = parsed.id || `temp_${Date.now().toString(36)}`;
      const optimistic: McpServiceDto = {
        id: optimisticId,
        title: payload.title,
        summary: payload.summary,
        category: payload.category,
        tags: payload.tags,
        pricing: payload.pricing,
        status: payload.status,
        contactInfo: payload.contactInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setServices((prev) => [...prev, optimistic]);

      try {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const json = await parseJson<ServiceResponse | ErrorResponse>(res);

        if (!res.ok) {
          setServices((prev) => prev.filter((s) => s.id !== optimisticId));
          const err = json as ErrorResponse;
          setError(err.error || 'Unable to create service');
          return;
        }

        const data = json as ServiceResponse;
        setServices((prev) => prev.map((s) => (s.id === optimisticId ? data.service : s)));
        setOpen(false);
      } catch {
        setServices((prev) => prev.filter((s) => s.id !== optimisticId));
        setError('Unable to create service');
      } finally {
        setSaving(false);
      }

      return;
    }

    if (!editingId) return;

    const previous = services;
    setServices((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? {
              ...s,
              ...payload,
              tags: payload.tags,
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );

    try {
      const res = await fetch(`/api/services/${editingId}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await parseJson<ServiceResponse | ErrorResponse>(res);

      if (!res.ok) {
        setServices(previous);
        const err = json as ErrorResponse;
        setError(err.error || 'Unable to update service');
        return;
      }

      const data = json as ServiceResponse;
      setServices((prev) => prev.map((s) => (s.id === editingId ? data.service : s)));
      setOpen(false);
    } catch {
      setServices(previous);
      setError('Unable to update service');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (deletingIds.has(id)) return;

    const snapshot = services;
    setDeletingIds((prev) => new Set(prev).add(id));
    setServices((prev) => prev.filter((s) => s.id !== id));

    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setServices(snapshot);
        setError('Unable to delete service');
      }
    } catch {
      setServices(snapshot);
      setError('Unable to delete service');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardTitle style={{ marginBottom: 8 }}>Loading services…</CardTitle>
        <CardDescription>Fetching the current catalog.</CardDescription>
      </Card>
    );
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="h1">Admin · Services</h1>
          <p className="lead">Create, update, and delete MCP services (demo CRUD + API routes).</p>
        </div>
        <div className="row">
          <Button variant="primary" onClick={openCreate}>
            Create service
          </Button>
          <ButtonLink href="/browse">View public browse</ButtonLink>
        </div>
      </div>

      {error ? (
        <div style={{ height: 12 }}>
          <p className="errorText">{error}</p>
        </div>
      ) : null}

      <div style={{ height: 12 }} />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Pricing</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sortedServices.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.title}</td>
              <td>
                <Badge>{service.category}</Badge>
              </td>
              <td>
                <Badge>{service.status}</Badge>
              </td>
              <td>{service.pricing}</td>
              <td style={{ textAlign: 'right' }}>
                <div className="row" style={{ justifyContent: 'flex-end' }}>
                  <Button onClick={() => openEdit(service)}>Edit</Button>
                  <Button onClick={() => void onDelete(service.id)} disabled={deletingIds.has(service.id)}>
                    {deletingIds.has(service.id) ? 'Deleting…' : 'Delete'}
                  </Button>
                  <ButtonLink href={`/services/${service.id}`}>Preview</ButtonLink>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={mode === 'create' ? 'Create service' : 'Edit service'}
        footer={
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <FormField
            label="ID"
            hint={mode === 'edit' ? 'ID is fixed once created.' : 'Optional. Used in /services/[id] URL.'}
            error={fieldErrors.id}
          >
            <Input
              value={form.id}
              onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
              placeholder="image-recognition"
              disabled={mode === 'edit' || saving}
            />
          </FormField>

          <FormField label="Status" error={fieldErrors.status}>
            <Select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as FormState['status'] }))}
              disabled={saving}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div style={{ height: 12 }} />

        <FormField label="Title" error={fieldErrors.title}>
          <Input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Content Moderation"
            disabled={saving}
          />
        </FormField>

        <div style={{ height: 12 }} />

        <FormField label="Summary" error={fieldErrors.summary}>
          <Textarea
            value={form.summary}
            onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
            placeholder="What does this service do?"
            disabled={saving}
          />
        </FormField>

        <div style={{ height: 12 }} />

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Category" error={fieldErrors.category}>
            <Input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="AI"
              disabled={saving}
            />
          </FormField>

          <FormField label="Pricing" error={fieldErrors.pricing}>
            <Input
              value={form.pricing}
              onChange={(e) => setForm((prev) => ({ ...prev, pricing: e.target.value }))}
              placeholder="Free"
              disabled={saving}
            />
          </FormField>
        </div>

        <div style={{ height: 12 }} />

        <FormField label="Tags" hint="Comma-separated" error={fieldErrors.tags}>
          <Input
            value={form.tags}
            onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="moderation, safety, ai"
            disabled={saving}
          />
        </FormField>

        <div style={{ height: 12 }} />

        <FormField label="Contact info" hint="Email, URL, or any text" error={fieldErrors.contactInfo}>
          <Input
            value={form.contactInfo}
            onChange={(e) => setForm((prev) => ({ ...prev, contactInfo: e.target.value }))}
            placeholder="support@example.com"
            disabled={saving}
          />
        </FormField>
      </Modal>
    </div>
  );
}
