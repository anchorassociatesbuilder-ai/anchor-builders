'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toSlug } from '../../../utils/slug';
import { createProject, updateProject, deleteProject } from './actions';

function emptyForm(defaults = {}) {
  return {
    title: '',
    client: '',
    category_name: defaults.category_name || '',
    description: '',
    location: '',
    year_completed: '',
    is_featured: false,
    is_active: true,
    sort_order: 0,
  };
}

export default function ProjectsClient({ initialProjects, categories, clientOptions = [], filterCat }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const filterCatName = (categories.find((c) => c.id === filterCat) || {}).name || '';

  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(emptyForm({ category_name: filterCatName }));
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  function onCatFilter(val) {
    const sp = new URLSearchParams(searchParams.toString());
    if (val) sp.set('cat', val); else sp.delete('cat');
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  function startAdd() {
    setEditingId(null);
    setShowAdd(true);
    setError('');
    setDraft(emptyForm({ category_name: filterCatName }));
  }

  function startEdit(p) {
    setEditingId(p.id);
    setShowAdd(false);
    setError('');
    setDraft({
      title: p.title || '',
      client: p.client || '',
      category_name: p.category?.name || '',
      description: p.description || '',
      location: p.location || '',
      year_completed: p.year_completed ?? '',
      is_featured: !!p.is_featured,
      is_active: !!p.is_active,
      sort_order: p.sort_order ?? 0,
      is_new_for_client: false,
    });
  }

  function cancel() {
    setEditingId(null);
    setShowAdd(false);
    setError('');
  }

  function build(extra = {}) {
    const fd = new FormData();
    fd.set('title', draft.title);
    fd.set('client', draft.client || '');
    fd.set('category_name', draft.category_name || '');
    fd.set('description', draft.description || '');
    fd.set('location', draft.location || '');
    if (draft.year_completed !== '' && draft.year_completed !== null) {
      fd.set('year_completed', String(draft.year_completed));
    }
    if (draft.is_featured) fd.set('is_featured', 'on');
    if (draft.is_active) fd.set('is_active', 'on');
    if (draft.is_new_for_client) fd.set('is_new_for_client', 'on');
    fd.set('sort_order', String(draft.sort_order || 0));
    Object.entries(extra).forEach(([k, v]) => fd.set(k, v));
    return fd;
  }

  function run(action, fd, options = {}) {
    setError('');
    setFlash('');
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) { setError(res.error); return; }
      cancel();
      const projectId = options.projectId || res?.id;
      if (options.goToImages && projectId) {
        router.push(`/admin/projects/${projectId}/images`);
        return;
      }
      setFlash('Saved.');
      router.refresh();
    });
  }

  function onAddSubmit(e) {
    e.preventDefault();
    if (!draft.title.trim()) return setError('Title is required.');
    if (!draft.category_name.trim()) return setError('Category is required.');
    const goToImages = e.nativeEvent.submitter?.dataset?.afterSave === 'images';
    run(createProject, build(), { goToImages });
  }

  function onEditSubmit(e) {
    e.preventDefault();
    if (!draft.title.trim()) return setError('Title is required.');
    if (!draft.category_name.trim()) return setError('Category is required.');
    const goToImages = e.nativeEvent.submitter?.dataset?.afterSave === 'images';
    run(updateProject, build({ id: editingId }), { goToImages, projectId: editingId });
  }

  function onDelete(p) {
    const sure = confirm(`Delete "${p.title}"?\n\nAll images for this project will also be deleted from storage. This cannot be undone.`);
    if (!sure) return;
    const fd = new FormData();
    fd.set('id', p.id);
    run(deleteProject, fd);
  }

  const isEditing = (id) => editingId === id;

  return (
    <div className="admin-card-wrap">
      {flash && <div className="form-flash">{flash}</div>}

      <div className="admin-toolbar two">
        <button className="btn btn-primary" onClick={startAdd} disabled={pending}>
          <span>New project</span>
        </button>
        <div className="filter-inline">
          <label className="mono">FILTER · CATEGORY</label>
          <select value={filterCat || ''} onChange={(e) => onCatFilter(e.target.value)} disabled={pending}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {showAdd && (
        <form className="admin-form" onSubmit={onAddSubmit}>
          <ProjectFields draft={draft} setDraft={setDraft} categories={categories} clientOptions={clientOptions} disabled={pending} />
          {error && <div className="form-error">{error}</div>}
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              <span>{pending ? 'Saving…' : 'Create'}</span>
            </button>
            <button type="submit" className="btn btn-ghost" data-after-save="images" disabled={pending}>
              <span>Create and add images</span>
            </button>
            <button type="button" className="btn btn-ghost" onClick={cancel} disabled={pending}>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Order</th>
              <th>Project</th>
              <th>Category</th>
              <th>Year</th>
              <th>Status</th>
              <th style={{ width: 260 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialProjects.length === 0 && (
              <tr><td colSpan={6} className="admin-empty">No projects {filterCat ? 'in this category' : 'yet'}. Add one above.</td></tr>
            )}
            {initialProjects.map((p) => (
              isEditing(p.id) ? (
                <tr key={p.id} className="editing">
                  <td colSpan={6}>
                    <form className="admin-form inline" onSubmit={onEditSubmit}>
                      <ProjectFields draft={draft} setDraft={setDraft} categories={categories} clientOptions={clientOptions} disabled={pending} />
                      {error && <div className="form-error">{error}</div>}
                      <div className="admin-form-actions">
                        <button type="submit" className="btn btn-primary" disabled={pending}>
                          <span>{pending ? 'Saving…' : 'Save'}</span>
                        </button>
                        <button type="submit" className="btn btn-ghost" data-after-save="images" disabled={pending}>
                          <span>Save and manage images</span>
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={cancel} disabled={pending}>
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td className="mono">{p.sort_order}</td>
                  <td>
                    <div className="strong">{p.title}</div>
                    <div className="muted small mono">{p.slug}{p.location ? ` · ${p.location}` : ''}</div>
                  </td>
                  <td>{p.category?.name || <em className="muted">—</em>}</td>
                  <td className="mono small">{p.year_completed ?? '—'}</td>
                  <td>
                    <span className={`pill ${p.is_active ? 'on' : 'off'}`}>{p.is_active ? 'Active' : 'Hidden'}</span>
                    {p.is_featured && <span className="pill warm" style={{ marginLeft: 6 }}>Featured</span>}
                  </td>
                  <td>
                    <Link className="link-btn" href={`/admin/projects/${p.id}/images`}>Images</Link>
                    <button className="link-btn" onClick={() => startEdit(p)} disabled={pending}>Edit</button>
                    <button className="link-btn danger" onClick={() => onDelete(p)} disabled={pending}>Delete</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectFields({ draft, setDraft, categories, clientOptions = [], disabled }) {
  return (
    <div className="admin-fields">
      <div className="field">
        <label>Title</label>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          disabled={disabled}
          required
        />
        {draft.title.trim() && (
          <span className="field-hint mono">URL slug: /{toSlug(draft.title) || '—'}</span>
        )}
      </div>
      <ClientSelect
        value={draft.client}
        onChange={(v) => setDraft({ ...draft, client: v })}
        options={clientOptions}
        disabled={disabled}
      />
      <div className="field">
        <label>Category</label>
        <input
          type="text"
          list="admin-category-options"
          value={draft.category_name}
          onChange={(e) => setDraft({ ...draft, category_name: e.target.value })}
          placeholder="Type a category — matched or created"
          disabled={disabled}
          required
        />
        <datalist id="admin-category-options">
          {categories.map((c) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>
        <span className="field-hint mono">Matches an existing category (any case) or creates a new one.</span>
      </div>
      <div className="field">
        <label>Year completed</label>
        <input
          type="number"
          value={draft.year_completed}
          onChange={(e) => setDraft({ ...draft, year_completed: e.target.value === '' ? '' : Number(e.target.value) })}
          disabled={disabled}
        />
      </div>
      <div className="field">
        <label>Location</label>
        <input
          type="text"
          value={draft.location}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="field">
        <label>Sort order</label>
        <input
          type="number"
          value={draft.sort_order}
          onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
          disabled={disabled}
        />
      </div>
      <div className="field full">
        <label>Description</label>
        <textarea
          rows={3}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="field check">
        <label>
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
            disabled={disabled}
          /> Active (publicly visible)
        </label>
      </div>
      <div className="field check">
        <label>
          <input
            type="checkbox"
            checked={draft.is_featured}
            onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
            disabled={disabled}
          /> Featured (homepage)
        </label>
      </div>
    </div>
  );
}

const CUSTOM_CLIENT = '__custom__';

/**
 * Client picker: a dropdown of the admin clients list, plus a "Custom client"
 * option that reveals a free-text box. On edit, an existing client that matches
 * an option preselects it; one that doesn't selects "Custom client" and shows
 * the existing name in the text box. The chosen value is stored in draft.client.
 */
function ClientSelect({ value, onChange, options, disabled }) {
  const matched = !!value && options.some((o) => o.name === value);
  // Sticky once chosen, so the text box stays open while the admin types.
  const [custom, setCustom] = useState(!!value && !matched);
  const selectValue = custom ? CUSTOM_CLIENT : matched ? value : '';

  return (
    <div className="field">
      <label>Client</label>
      <select
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === CUSTOM_CLIENT) {
            setCustom(true);
            onChange('');
          } else {
            setCustom(false);
            onChange(v);
          }
        }}
        disabled={disabled}
      >
        <option value="">— Select client —</option>
        {options.map((o) => (
          <option key={o.name} value={o.name}>
            {o.fullName && o.fullName !== o.name ? `${o.name} — ${o.fullName}` : o.name}
          </option>
        ))}
        <option value={CUSTOM_CLIENT}>Custom client…</option>
      </select>
      {custom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type custom client name"
          disabled={disabled}
          style={{ marginTop: 8 }}
        />
      )}
      <span className="field-hint mono">Pick a client, or choose “Custom client” to type a new one.</span>
    </div>
  );
}
