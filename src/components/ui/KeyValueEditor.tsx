import React from 'react';
import type { KVPair } from '../../types/workflow';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  value: KVPair[];
  onChange: (pairs: KVPair[]) => void;
  label?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export const KeyValueEditor: React.FC<Props> = ({
  value,
  onChange,
  label = 'Key–Value Pairs',
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}) => {
  const addPair = () => onChange([...value, { key: '', value: '' }]);

  const updatePair = (index: number, field: 'key' | 'value', v: string) => {
    const updated = value.map((pair, i) => (i === index ? { ...pair, [field]: v } : pair));
    onChange(updated);
  };

  const removePair = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="kv-editor">
      <div className="kv-header">
        <span className="field-label">{label}</span>
        <button type="button" className="btn-icon" onClick={addPair} title="Add pair">
          <Plus size={14} />
        </button>
      </div>
      {value.length === 0 && <div className="kv-empty">No entries yet</div>}
      {value.map((pair, i) => (
        <div key={i} className="kv-row">
          <input
            className="form-input kv-key"
            placeholder={keyPlaceholder}
            value={pair.key}
            onChange={(e) => updatePair(i, 'key', e.target.value)}
          />
          <input
            className="form-input kv-val"
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(e) => updatePair(i, 'value', e.target.value)}
          />
          <button type="button" className="btn-icon btn-danger" onClick={() => removePair(i)}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  );
};
