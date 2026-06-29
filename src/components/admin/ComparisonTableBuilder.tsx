'use client';

import { useState } from 'react';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminToggle } from '@/components/admin/ui/AdminToggle';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Columns } from 'lucide-react';
import { clsx } from 'clsx';

export type ComparisonColumn = {
  key: string;
  label: string;
  enabled: boolean;
};

export type ComparisonRow = {
  id: string;
  feature: string;
  values: Record<string, string>;
};

export type ComparisonData = {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  enabled: boolean;
};

export function ComparisonTableBuilder({
  data,
  onChange,
}: {
  data: ComparisonData;
  onChange: (data: ComparisonData) => void;
}) {
  function addColumn() {
    const key = `col_${Date.now().toString(36)}`;
    onChange({
      ...data,
      columns: [...data.columns, { key, label: '', enabled: true }],
    });
  }

  function removeColumn(key: string) {
    onChange({
      ...data,
      columns: data.columns.filter((c) => c.key !== key),
      rows: data.rows.map((r) => {
        const { [key]: _, ...rest } = r.values;
        return { ...r, values: rest };
      }),
    });
  }

  function updateColumn(key: string, label: string) {
    onChange({
      ...data,
      columns: data.columns.map((c) => (c.key === key ? { ...c, label } : c)),
    });
  }

  function toggleColumn(key: string) {
    onChange({
      ...data,
      columns: data.columns.map((c) => (c.key === key ? { ...c, enabled: !c.enabled } : c)),
    });
  }

  function addRow() {
    onChange({
      ...data,
      rows: [...data.rows, { id: Date.now().toString(36), feature: '', values: {} }],
    });
  }

  function removeRow(id: string) {
    onChange({ ...data, rows: data.rows.filter((r) => r.id !== id) });
  }

  function updateRowFeature(id: string, feature: string) {
    onChange({ ...data, rows: data.rows.map((r) => (r.id === id ? { ...r, feature } : r)) });
  }

  function updateCellValue(rowId: string, colKey: string, value: string) {
    onChange({
      ...data,
      rows: data.rows.map((r) =>
        r.id === rowId ? { ...r, values: { ...r.values, [colKey]: value } } : r
      ),
    });
  }

  function moveRow(index: number, direction: 'up' | 'down') {
    const newRows = [...data.rows];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newRows.length) return;
    [newRows[index], newRows[target]] = [newRows[target], newRows[index]];
    onChange({ ...data, rows: newRows });
  }

  const enabledColumns = data.columns.filter((c) => c.enabled);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Columns className="h-4 w-4 text-brand-500" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Comparison Table</p>
        </div>
        <AdminToggle
          label="Enable Table"
          checked={data.enabled}
          onChange={(checked) => onChange({ ...data, enabled: checked })}
        />
      </div>

      {/* Hidden input for form serialization */}
      <input type="hidden" name="comparisonTable" value={JSON.stringify(data)} />

      {!data.enabled ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 py-4">
          Enable the comparison table to start adding columns and rows.
        </p>
      ) : (
        <>
          {/* Column Management */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Columns ({data.columns.length})
              </p>
              <AdminButton type="button" variant="ghost" size="sm" icon={<Plus className="h-3 w-3" />} onClick={addColumn}>
                Add Column
              </AdminButton>
            </div>
            <div className="space-y-2">
              {data.columns.map((col) => (
                <div key={col.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={col.enabled}
                    onChange={() => toggleColumn(col.key)}
                    className="rounded text-brand-500"
                  />
                  <input
                    type="text"
                    value={col.label}
                    onChange={(e) => updateColumn(col.key, e.target.value)}
                    placeholder="Column name (e.g. Veneers)"
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                  <button type="button" onClick={() => removeColumn(col.key)} className="p-1 text-slate-400 hover:text-red-500 transition">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {data.columns.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-2">
                  Add columns to compare treatments (e.g. Veneers, Crowns, Implants)
                </p>
              )}
            </div>
          </div>

          {/* Table Builder */}
          {enabledColumns.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 w-8" />
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[140px]">
                        Feature
                      </th>
                      {enabledColumns.map((col) => (
                        <th key={col.key} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[120px]">
                          {col.label || '—'}
                        </th>
                      ))}
                      <th className="px-3 py-2.5 w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {data.rows.map((row, idx) => (
                      <tr key={row.id} className="bg-white dark:bg-slate-800">
                        <td className="px-2 py-2">
                          <div className="flex flex-col items-center gap-0.5">
                            <button type="button" onClick={() => moveRow(idx, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-30">
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <GripVertical className="h-3 w-3 text-slate-300" />
                            <button type="button" onClick={() => moveRow(idx, 'down')} disabled={idx === data.rows.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-30">
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.feature}
                            onChange={(e) => updateRowFeature(row.id, e.target.value)}
                            placeholder="Feature name"
                            className="w-full rounded border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </td>
                        {enabledColumns.map((col) => (
                          <td key={col.key} className="px-2 py-2">
                            <input
                              type="text"
                              value={row.values[col.key] || ''}
                              onChange={(e) => updateCellValue(row.id, col.key, e.target.value)}
                              placeholder="—"
                              className="w-full rounded border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                            />
                          </td>
                        ))}
                        <td className="px-2 py-2 text-right">
                          <button type="button" onClick={() => removeRow(row.id)} className="text-slate-400 hover:text-red-500 transition">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2">
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-medium"
                >
                  <Plus className="h-3 w-3" /> Add Row
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
