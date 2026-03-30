import { useState, useEffect } from 'react';
import { API_BASE } from '../config';
import './CategorySelector.css';

export default function CategorySelector({ onSave, initialCategories = [] }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] =
    useState(initialCategories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [showSelector, setShowSelector] = useState(false);

  // Load all available categories
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategories(initialCategories);
  }, [initialCategories]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories/all`);
      const data = await res.json();
      setCategories(data.categories || []);

      // Auto-expand groups that have selected items
      const newExpanded = {};
      data.categories.forEach((cat) => {
        if (initialCategories.includes(cat.id)) {
          newExpanded[cat.group] = true;
        }
      });
      setExpandedGroups(newExpanded);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group categories by group
  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {});

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleGroup = (groupName) => {
    const groupCategories = groupedCategories[groupName] || [];
    const allSelected = groupCategories.every((cat) =>
      selectedCategories.includes(cat.id),
    );

    if (allSelected) {
      setSelectedCategories((prev) =>
        prev.filter((id) => !groupCategories.some((cat) => cat.id === id)),
      );
    } else {
      const newCategories = [...selectedCategories];
      groupCategories.forEach((cat) => {
        if (!newCategories.includes(cat.id)) {
          newCategories.push(cat.id);
        }
      });
      setSelectedCategories(newCategories);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/preferences/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedCategories }),
      });
      if (res.ok) {
        if (onSave) onSave(selectedCategories);
        setShowSelector(false);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredGroups = {};
  Object.entries(groupedCategories).forEach(([group, cats]) => {
    const filtered = cats.filter(
      (cat) =>
        cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (filtered.length > 0) {
      filteredGroups[group] = filtered;
    }
  });

  const toggleGroupExpand = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const selectedCount = selectedCategories.length;

  return (
    <div className='category-selector'>
      <button
        className='category-selector-toggle'
        onClick={() => setShowSelector(!showSelector)}
      >
        <span className='category-icon'>🏷️</span>
        <span>Industries ({selectedCount})</span>
        <span className='toggle-arrow'>{showSelector ? '▲' : '▼'}</span>
      </button>

      {showSelector && (
        <div className='category-selector-modal'>
          <div className='category-selector-header'>
            <h3>Select Industries to Target</h3>
            <p>Choose which types of businesses to discover and analyze</p>
            <div className='category-search'>
              <input
                type='text'
                placeholder='Search industries...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className='category-selector-groups'>
            {loading ? (
              <div className='loading-categories'>Loading categories...</div>
            ) : (
              Object.entries(filteredGroups).map(([group, cats]) => {
                const groupSelected = cats.every((cat) =>
                  selectedCategories.includes(cat.id),
                );
                const groupPartial =
                  cats.some((cat) => selectedCategories.includes(cat.id)) &&
                  !groupSelected;
                const isExpanded = expandedGroups[group] !== false;

                return (
                  <div key={group} className='category-group'>
                    <div
                      className='category-group-header'
                      onClick={() => toggleGroupExpand(group)}
                    >
                      <div className='group-select'>
                        <input
                          type='checkbox'
                          checked={groupSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = groupPartial;
                          }}
                          onChange={() => toggleGroup(group)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <span className='group-name'>{group}</span>
                      <span className='group-count'>({cats.length})</span>
                      <span className='group-expand'>
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className='category-group-items'>
                        {cats.map((cat) => (
                          <label key={cat.id} className='category-item'>
                            <input
                              type='checkbox'
                              checked={selectedCategories.includes(cat.id)}
                              onChange={() => toggleCategory(cat.id)}
                            />
                            <span className='category-icon'>{cat.icon}</span>
                            <span className='category-label'>{cat.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className='category-selector-footer'>
            <div className='selected-count'>
              Selected: <strong>{selectedCount}</strong> industries
            </div>
            <div className='category-actions'>
              <button
                className='btn-secondary'
                onClick={() => setSelectedCategories([])}
              >
                Clear All
              </button>
              <button
                className='btn-primary'
                onClick={savePreferences}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
