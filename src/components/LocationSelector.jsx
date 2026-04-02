import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import './LocationSelector.css';

// Predefined locations data
const LOCATION_DATA = {
  // Metropolitan Areas
  metros: [
    {
      id: 'greater-seattle',
      label: 'Greater Seattle Area',
      locations: [
        'Seattle',
        'Bellevue',
        'Kirkland',
        'Redmond',
        'Bothell',
        'Woodinville',
        'Lynnwood',
        'Edmonds',
        'Renton',
        'Kent',
      ],
    },
    {
      id: 'eastside',
      label: 'Eastside (Bellevue, Kirkland, Redmond)',
      locations: ['Bellevue', 'Kirkland', 'Redmond', 'Sammamish', 'Issaquah'],
    },
    {
      id: 'south-sound',
      label: 'South Sound (Tacoma, Olympia, etc.)',
      locations: ['Tacoma', 'Olympia', 'Lacey', 'Puyallup'],
    },
    {
      id: 'north-sound',
      label: 'North Sound (Everett, Bellingham)',
      locations: ['Everett', 'Bellingham', 'Marysville', 'Mount Vernon'],
    },
    {
      id: 'peninsula',
      label: 'Kitsap Peninsula',
      locations: ['Bremerton', 'Silverdale', 'Port Orchard', 'Poulsbo'],
    },
  ],

  // Washington State Cities
  washington: [
    { id: 'seattle', label: 'Seattle', metro: 'greater-seattle' },
    { id: 'bellevue', label: 'Bellevue', metro: 'greater-seattle' },
    { id: 'kirkland', label: 'Kirkland', metro: 'greater-seattle' },
    { id: 'redmond', label: 'Redmond', metro: 'greater-seattle' },
    { id: 'bothell', label: 'Bothell', metro: 'greater-seattle' },
    { id: 'woodinville', label: 'Woodinville', metro: 'greater-seattle' },
    { id: 'lynnwood', label: 'Lynnwood', metro: 'greater-seattle' },
    { id: 'edmonds', label: 'Edmonds', metro: 'greater-seattle' },
    { id: 'renton', label: 'Renton', metro: 'greater-seattle' },
    { id: 'kent', label: 'Kent', metro: 'greater-seattle' },
    { id: 'tacoma', label: 'Tacoma', metro: 'south-sound' },
    { id: 'olympia', label: 'Olympia', metro: 'south-sound' },
    { id: 'everett', label: 'Everett', metro: 'north-sound' },
    { id: 'bellingham', label: 'Bellingham', metro: 'north-sound' },
    { id: 'spokane', label: 'Spokane', metro: null },
    { id: 'vancouver-wa', label: 'Vancouver, WA', metro: null },
  ],

  // Additional States (expand as needed)
  oregon: [
    { id: 'portland', label: 'Portland', metro: 'portland-metro' },
    { id: 'beaverton', label: 'Beaverton', metro: 'portland-metro' },
    { id: 'hillsboro', label: 'Hillsboro', metro: 'portland-metro' },
    { id: 'bend', label: 'Bend', metro: null },
  ],

  idaho: [
    { id: 'boise', label: 'Boise', metro: 'boise-metro' },
    { id: 'meridian', label: 'Meridian', metro: 'boise-metro' },
  ],

  // Custom locations (user can add their own)
  custom: [],
};

export default function LocationSelector({ onSave, initialLocations = [] }) {
  const [selectedLocations, setSelectedLocations] = useState(initialLocations);
  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({
    metros: true,
    washington: true,
    oregon: false,
    idaho: false,
    custom: false,
  });
  const [customLocation, setCustomLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved preferences
  useEffect(() => {
    loadLocationPreferences();
  }, []);

  useEffect(() => {
    setSelectedLocations(initialLocations);
  }, [initialLocations]);

  const loadLocationPreferences = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/preferences/locations`);
      const data = await res.json();
      if (data.success && data.preferences) {
        setSelectedLocations(data.preferences.locations || []);
      }
    } catch (error) {
      console.error('Error loading location preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle individual location
  const toggleLocation = (locationId) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId],
    );
  };

  // Toggle metro area (selects all cities in that metro)
  const toggleMetro = (metro) => {
    const metroData = LOCATION_DATA.metros.find((m) => m.id === metro);
    if (!metroData) return;

    const allMetroLocations = metroData.locations;
    const allSelected = allMetroLocations.every((loc) =>
      selectedLocations.includes(loc),
    );

    if (allSelected) {
      setSelectedLocations((prev) =>
        prev.filter((id) => !allMetroLocations.includes(id)),
      );
    } else {
      const newLocations = [...selectedLocations];
      allMetroLocations.forEach((loc) => {
        if (!newLocations.includes(loc)) {
          newLocations.push(loc);
        }
      });
      setSelectedLocations(newLocations);
    }
  };

  // Toggle state (selects all cities in that state)
  const toggleState = (state) => {
    const stateCities = LOCATION_DATA[state] || [];
    const allCityIds = stateCities.map((city) => city.id);
    const allSelected = allCityIds.every((id) =>
      selectedLocations.includes(id),
    );

    if (allSelected) {
      setSelectedLocations((prev) =>
        prev.filter((id) => !allCityIds.includes(id)),
      );
    } else {
      const newLocations = [...selectedLocations];
      allCityIds.forEach((id) => {
        if (!newLocations.includes(id)) {
          newLocations.push(id);
        }
      });
      setSelectedLocations(newLocations);
    }
  };

  // Add custom location
  const addCustomLocation = () => {
    if (customLocation.trim()) {
      const newId = `custom-${Date.now()}`;
      LOCATION_DATA.custom.push({
        id: newId,
        label: customLocation.trim(),
        custom: true,
      });
      setSelectedLocations((prev) => [...prev, newId]);
      setCustomLocation('');

      // Expand custom group
      setExpandedGroups((prev) => ({ ...prev, custom: true }));
    }
  };

  // Remove custom location
  const removeCustomLocation = (locationId) => {
    setSelectedLocations((prev) => prev.filter((id) => id !== locationId));
    const index = LOCATION_DATA.custom.findIndex((l) => l.id === locationId);
    if (index !== -1) {
      LOCATION_DATA.custom.splice(index, 1);
    }
  };

  // Save preferences
  const savePreferences = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/preferences/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: selectedLocations }),
      });
      if (res.ok) {
        if (onSave) onSave(selectedLocations);
        setShowSelector(false);
      }
    } catch (error) {
      console.error('Error saving location preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  // Filter locations based on search
  const getFilteredLocations = () => {
    if (!searchTerm)
      return { metros: LOCATION_DATA.metros, states: LOCATION_DATA };

    const term = searchTerm.toLowerCase();
    const filtered = {
      metros: [],
      states: { washington: [], oregon: [], idaho: [], custom: [] },
    };

    // Filter metros
    LOCATION_DATA.metros.forEach((metro) => {
      if (
        metro.label.toLowerCase().includes(term) ||
        metro.locations.some((loc) => loc.toLowerCase().includes(term))
      ) {
        filtered.metros.push(metro);
      }
    });

    // Filter states
    ['washington', 'oregon', 'idaho'].forEach((state) => {
      LOCATION_DATA[state].forEach((city) => {
        if (city.label.toLowerCase().includes(term)) {
          filtered.states[state].push(city);
        }
      });
    });

    // Filter custom
    LOCATION_DATA.custom.forEach((city) => {
      if (city.label.toLowerCase().includes(term)) {
        filtered.states.custom.push(city);
      }
    });

    return filtered;
  };

  const getLocationLabel = (id) => {
    // Check in all location lists
    for (const state of ['washington', 'oregon', 'idaho']) {
      const found = LOCATION_DATA[state].find((c) => c.id === id);
      if (found) return found.label;
    }
    const custom = LOCATION_DATA.custom.find((c) => c.id === id);
    if (custom) return custom.label;
    return id;
  };

  const filtered = getFilteredLocations();
  const selectedCount = selectedLocations.length;

  // Group selected locations by type for display
  const selectedGrouped = {
    metros: selectedLocations.filter(
      (loc) =>
        LOCATION_DATA.metros.some((m) => m.locations.includes(loc)) ||
        LOCATION_DATA.metros.some((m) => m.id === loc),
    ),
    cities: selectedLocations.filter((loc) => {
      for (const state of ['washington', 'oregon', 'idaho']) {
        if (LOCATION_DATA[state].some((c) => c.id === loc)) return true;
      }
      return LOCATION_DATA.custom.some((c) => c.id === loc);
    }),
  };

  const toggleGroupExpand = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className='location-selector'>
      <button
        className='location-selector-toggle'
        onClick={() => setShowSelector(!showSelector)}
      >
        <span className='location-icon'>📍</span>
        <span>Locations ({selectedCount})</span>
        <span className='toggle-arrow'>{showSelector ? '▲' : '▼'}</span>
      </button>

      {showSelector && (
        <div className='location-selector-modal'>
          <div className='location-selector-header'>
            <h3>Select Target Locations</h3>
            <p>Choose cities, metropolitan areas, or add custom locations</p>
            <div className='location-search'>
              <input
                type='text'
                placeholder='Search cities or areas...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className='location-selector-groups'>
            {/* Metropolitan Areas */}
            {filtered.metros.length > 0 && (
              <div className='location-group'>
                <div
                  className='location-group-header'
                  onClick={() => toggleGroupExpand('metros')}
                >
                  <span className='group-name'>🌆 Metropolitan Areas</span>
                  <span className='group-expand'>
                    {expandedGroups.metros ? '▼' : '▶'}
                  </span>
                </div>
                {expandedGroups.metros && (
                  <div className='location-group-items'>
                    {filtered.metros.map((metro) => {
                      const allSelected = metro.locations.every((loc) =>
                        selectedLocations.includes(loc),
                      );
                      const someSelected = metro.locations.some((loc) =>
                        selectedLocations.includes(loc),
                      );
                      return (
                        <div key={metro.id} className='metro-item'>
                          <label className='metro-select'>
                            <input
                              type='checkbox'
                              checked={allSelected}
                              ref={(el) => {
                                if (el)
                                  el.indeterminate =
                                    someSelected && !allSelected;
                              }}
                              onChange={() => toggleMetro(metro.id)}
                            />
                            <span className='metro-name'>{metro.label}</span>
                            <span className='metro-count'>
                              ({metro.locations.length} cities)
                            </span>
                          </label>
                          <div className='metro-cities'>
                            {metro.locations.map((city) => (
                              <label key={city} className='location-item'>
                                <input
                                  type='checkbox'
                                  checked={selectedLocations.includes(city)}
                                  onChange={() => toggleLocation(city)}
                                />
                                <span className='location-label'>{city}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Washington State */}
            {filtered.states.washington.length > 0 && (
              <div className='location-group'>
                <div
                  className='location-group-header'
                  onClick={() => toggleGroupExpand('washington')}
                >
                  <span className='group-name'>📍 Washington</span>
                  <span className='group-expand'>
                    {expandedGroups.washington ? '▼' : '▶'}
                  </span>
                </div>
                {expandedGroups.washington && (
                  <div className='location-group-items'>
                    <label className='state-select'>
                      <input
                        type='checkbox'
                        checked={filtered.states.washington.every((city) =>
                          selectedLocations.includes(city.id),
                        )}
                        onChange={() => toggleState('washington')}
                      />
                      <span className='state-name'>
                        Select All Washington Cities
                      </span>
                    </label>
                    {filtered.states.washington.map((city) => (
                      <label key={city.id} className='location-item'>
                        <input
                          type='checkbox'
                          checked={selectedLocations.includes(city.id)}
                          onChange={() => toggleLocation(city.id)}
                        />
                        <span className='location-label'>{city.label}</span>
                        {city.metro && (
                          <span className='location-badge'>
                            {
                              LOCATION_DATA.metros
                                .find((m) => m.id === city.metro)
                                ?.label.split(' (')[0]
                            }
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Oregon State */}
            {filtered.states.oregon.length > 0 && (
              <div className='location-group'>
                <div
                  className='location-group-header'
                  onClick={() => toggleGroupExpand('oregon')}
                >
                  <span className='group-name'>📍 Oregon</span>
                  <span className='group-expand'>
                    {expandedGroups.oregon ? '▼' : '▶'}
                  </span>
                </div>
                {expandedGroups.oregon && (
                  <div className='location-group-items'>
                    <label className='state-select'>
                      <input
                        type='checkbox'
                        checked={filtered.states.oregon.every((city) =>
                          selectedLocations.includes(city.id),
                        )}
                        onChange={() => toggleState('oregon')}
                      />
                      <span className='state-name'>
                        Select All Oregon Cities
                      </span>
                    </label>
                    {filtered.states.oregon.map((city) => (
                      <label key={city.id} className='location-item'>
                        <input
                          type='checkbox'
                          checked={selectedLocations.includes(city.id)}
                          onChange={() => toggleLocation(city.id)}
                        />
                        <span className='location-label'>{city.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Idaho State */}
            {filtered.states.idaho.length > 0 && (
              <div className='location-group'>
                <div
                  className='location-group-header'
                  onClick={() => toggleGroupExpand('idaho')}
                >
                  <span className='group-name'>📍 Idaho</span>
                  <span className='group-expand'>
                    {expandedGroups.idaho ? '▼' : '▶'}
                  </span>
                </div>
                {expandedGroups.idaho && (
                  <div className='location-group-items'>
                    <label className='state-select'>
                      <input
                        type='checkbox'
                        checked={filtered.states.idaho.every((city) =>
                          selectedLocations.includes(city.id),
                        )}
                        onChange={() => toggleState('idaho')}
                      />
                      <span className='state-name'>
                        Select All Idaho Cities
                      </span>
                    </label>
                    {filtered.states.idaho.map((city) => (
                      <label key={city.id} className='location-item'>
                        <input
                          type='checkbox'
                          checked={selectedLocations.includes(city.id)}
                          onChange={() => toggleLocation(city.id)}
                        />
                        <span className='location-label'>{city.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Locations */}
            <div className='location-group'>
              <div
                className='location-group-header'
                onClick={() => toggleGroupExpand('custom')}
              >
                <span className='group-name'>✏️ Custom Locations</span>
                <span className='group-expand'>
                  {expandedGroups.custom ? '▼' : '▶'}
                </span>
              </div>
              {expandedGroups.custom && (
                <div className='location-group-items'>
                  <div className='add-custom'>
                    <input
                      type='text'
                      placeholder='Add custom city or area...'
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' && addCustomLocation()
                      }
                    />
                    <button onClick={addCustomLocation}>+ Add</button>
                  </div>
                  {LOCATION_DATA.custom.map((city) => (
                    <div key={city.id} className='custom-item'>
                      <label className='location-item'>
                        <input
                          type='checkbox'
                          checked={selectedLocations.includes(city.id)}
                          onChange={() => toggleLocation(city.id)}
                        />
                        <span className='location-label'>{city.label}</span>
                      </label>
                      <button
                        className='remove-custom'
                        onClick={() => removeCustomLocation(city.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='location-selector-footer'>
            <div className='selected-summary'>
              <strong>{selectedCount}</strong> locations selected
              {selectedCount > 0 && (
                <div className='selected-tags'>
                  {selectedLocations.slice(0, 5).map((loc) => (
                    <span key={loc} className='selected-tag'>
                      {getLocationLabel(loc)}
                    </span>
                  ))}
                  {selectedCount > 5 && (
                    <span className='selected-tag-more'>
                      +{selectedCount - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className='location-actions'>
              <button
                className='btn-secondary'
                onClick={() => setSelectedLocations([])}
              >
                Clear All
              </button>
              <button
                className='btn-primary'
                onClick={savePreferences}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Locations'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
