'use client';

import { useState } from 'react';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Procedure Steps Builder ─────────────────────────────────────
export type ProcedureStep = { step: number; title: string; desc: string };

export function ProcedureStepsBuilder({
  steps,
  onChange,
}: {
  steps: ProcedureStep[];
  onChange: (steps: ProcedureStep[]) => void;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function addStep() {
    const newStep: ProcedureStep = {
      step: steps.length + 1,
      title: '',
      desc: '',
    };
    onChange([...steps, newStep]);
    setExpandedIndex(steps.length);
  }

  function removeStep(index: number) {
    const updated = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step: i + 1 }));
    onChange(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  }

  function updateStep(index: number, field: 'title' | 'desc', value: string) {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function moveStep(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    const updated = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    onChange(updated.map((s, i) => ({ ...s, step: i + 1 })));
    setExpandedIndex(swapIndex);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Procedure Steps
        </label>
        <span className="text-xs text-slate-400">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>
      </div>

      {steps.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-3">No procedure steps added yet</p>
          <AdminButton type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" /> Add First Step
          </AdminButton>
        </div>
      ) : (
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden transition-all"
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <GripVertical className="h-4 w-4 text-slate-300 flex-shrink-0" />
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold flex-shrink-0">
                  {step.step}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">
                  {step.title || 'Untitled Step'}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button type="button" onClick={(e) => { e.stopPropagation(); moveStep(index, 'up'); }} disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); moveStep(index, 'down'); }} disabled={index === steps.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeStep(index); }}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {expandedIndex === index && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <AdminInput
                    label="Step Title"
                    value={step.title}
                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                    placeholder="e.g. Initial Consultation"
                  />
                  <AdminTextarea
                    label="Description"
                    value={step.desc}
                    onChange={(e) => updateStep(index, 'desc', e.target.value)}
                    placeholder="Describe what happens in this step..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AdminButton type="button" variant="outline" size="sm" onClick={addStep}>
        <Plus className="h-4 w-4 mr-1" /> Add Step
      </AdminButton>
    </div>
  );
}

// ─── FAQ Builder ─────────────────────────────────────
export type FaqItem = { q: string; a: string };

export function FaqBuilder({
  faqs,
  onChange,
}: {
  faqs: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function addFaq() {
    onChange([...faqs, { q: '', a: '' }]);
    setExpandedIndex(faqs.length);
  }

  function removeFaq(index: number) {
    onChange(faqs.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  }

  function updateFaq(index: number, field: 'q' | 'a', value: string) {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Frequently Asked Questions
        </label>
        <span className="text-xs text-slate-400">{faqs.length} FAQ{faqs.length !== 1 ? 's' : ''}</span>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-3">No FAQs added yet</p>
          <AdminButton type="button" variant="outline" size="sm" onClick={addFaq}>
            <Plus className="h-4 w-4 mr-1" /> Add First FAQ
          </AdminButton>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden transition-all"
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex-shrink-0">
                  Q{index + 1}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">
                  {faq.q || 'Untitled Question'}
                </span>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeFaq(index); }}
                  className="p-1 text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Expanded content */}
              {expandedIndex === index && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <AdminInput
                    label="Question"
                    value={faq.q}
                    onChange={(e) => updateFaq(index, 'q', e.target.value)}
                    placeholder="e.g. How long does the treatment take?"
                  />
                  <AdminTextarea
                    label="Answer"
                    value={faq.a}
                    onChange={(e) => updateFaq(index, 'a', e.target.value)}
                    placeholder="Provide a clear and helpful answer..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AdminButton type="button" variant="outline" size="sm" onClick={addFaq}>
        <Plus className="h-4 w-4 mr-1" /> Add FAQ
      </AdminButton>
    </div>
  );
}

// ─── Relation Picker (multi-select checkboxes) ─────────────────
export type RelationItem = { id: string; name: string };

export function RelationPicker({
  label,
  description,
  items,
  selectedIds,
  onChange,
  emptyMessage,
}: {
  label: string;
  description?: string;
  items: RelationItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  emptyMessage?: string;
}) {
  const [search, setSearch] = useState('');
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400">{emptyMessage || 'No items available'}</p>
        </div>
      ) : (
        <>
          {items.length > 5 && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          )}

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-sm text-slate-400">No results found</div>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.name}</span>
                  </label>
                );
              })
            )}
          </div>

          {selectedIds.length > 0 && (
            <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
              {selectedIds.length} selected
            </p>
          )}
        </>
      )}
    </div>
  );
}
