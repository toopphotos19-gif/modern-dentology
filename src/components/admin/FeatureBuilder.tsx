'use client';

import { useState } from 'react';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { Plus, GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export function FeatureBuilder({
  features,
  onChange,
}: {
  features: Feature[];
  onChange: (features: Feature[]) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function addFeature() {
    const newFeature: Feature = {
      id: Date.now().toString(36),
      icon: '✨',
      title: '',
      description: '',
    };
    onChange([...features, newFeature]);
    setExpanded(newFeature.id);
  }

  function removeFeature(id: string) {
    onChange(features.filter((f) => f.id !== id));
  }

  function updateFeature(id: string, key: keyof Feature, value: string) {
    onChange(features.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  }

  function moveFeature(index: number, direction: 'up' | 'down') {
    const newFeatures = [...features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFeatures.length) return;
    [newFeatures[index], newFeatures[targetIndex]] = [newFeatures[targetIndex], newFeatures[index]];
    onChange(newFeatures);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Features ({features.length})
        </p>
        <AdminButton type="button" variant="outline" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={addFeature}>
          Add Feature
        </AdminButton>
      </div>

      {features.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">No features added yet</p>
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            + Add your first feature
          </button>
        </div>
      )}

      {/* Hidden input for form serialization */}
      <input type="hidden" name="features" value={JSON.stringify(features)} />

      <div className="space-y-2">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden transition-all"
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              onClick={() => setExpanded(expanded === feature.id ? null : feature.id)}
            >
              <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
              <span className="text-lg flex-shrink-0">{feature.icon || '✨'}</span>
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                {feature.title || 'Untitled Feature'}
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={(e) => { e.stopPropagation(); moveFeature(index, 'up'); }} disabled={index === 0} className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 transition">
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); moveFeature(index, 'down'); }} disabled={index === features.length - 1} className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 transition">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeFeature(feature.id); }} className="rounded p-1 text-slate-400 hover:text-red-500 transition">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expanded === feature.id && (
              <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <AdminInput
                    label="Icon (Emoji or class)"
                    value={feature.icon}
                    onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                    placeholder="✨ or icon-name"
                  />
                  <div className="sm:col-span-2">
                    <AdminInput
                      label="Title"
                      value={feature.title}
                      onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                      placeholder="Feature title"
                      required
                    />
                  </div>
                </div>
                <AdminTextarea
                  label="Description"
                  value={feature.description}
                  onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                  placeholder="Feature description"
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
