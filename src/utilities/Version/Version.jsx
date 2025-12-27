// Version.jsx
import React, { memo, useMemo } from 'react';
import './Version.css';
import treeIcon from '../../assets/icons/Tree.ico';  // Adjust the relative path if needed

// Version information data structure
const VERSION_INFO = [
  {
    id: 'edition',
    label: 'Edition',
    value: 'VisiCore',
  },
  {
    id: 'version',
    label: 'Version',
    value: '2.5',
  },
  {
    id: 'installed',
    label: 'Installed on',
    value: '27/12/2025',
  },
  {
    id: 'build',
    label: 'OS build',
    value: '38147.0926',
  },
];

const LEGAL_TEXT = 'The VisiCore operating system and its user interface are protected by trademark and other pending or existing intellectual property rights in the United States and other countries or regions.';

const LICENSE_INFO = 'This product is licensed to: nguyenminhkhoi3913@gmail.com';

const Version = memo(() => {
  const specItems = useMemo(
    () =>
      VERSION_INFO.map((item) => (
        <div key={item.id} className="version-spec">
          <span className="version-spec-label">{item.label}</span>
          <span>{item.value}</span>
        </div>
      )),
    []
  );

  return (
    <div className="version-container">
      <div className="version-title">
        <div className="version-logo-group">
          <img src={treeIcon} alt="VisiCore Icon" className="version-logo-icon" />
          <div className="version-logo">VisiCore</div>
        </div>
      </div>
      <div className="version-specs">
        {specItems}
      </div>
      <div className="version-legal">
        <p className="version-legal-text">{LEGAL_TEXT}</p>
        <p className="version-license">{LICENSE_INFO}</p>
      </div>
    </div>
  );
});

Version.displayName = 'Version';

export default Version;