import React, { useState, useMemo, memo, useCallback } from "react";
import "./welcome.css";

// Content data extracted for better maintainability
const WELCOME_CONTENT = {
  welcome: (
    <>
      <h2 className="welcome-title">Welcome to My Portfolio</h2>
      <p>
        Hello! Welcome to my retro-styled portfolio website. This is a
        nostalgic recreation of a Windows 95/98 desktop environment,
        built with modern web technologies. Here you can explore my work,
        skills, and professional background in a unique and interactive way.
      </p>
      <p>
        Navigate through the desktop icons to discover different sections:
        learn about my background in "About Me", browse my projects and
        certificates, or get in touch through the contact options. The
        interface is designed to be both functional and fun, combining
        retro aesthetics with modern web capabilities.
      </p>
      <p>
        Feel free to explore at your own pace. Double-click any icon to
        open a window, drag windows around, and interact with the desktop
        just like you would on a classic Windows system. Check out the
        "Discover" section for detailed navigation instructions.
      </p>
    </>
  ),
  discover: (
    <>
      <h2 className="welcome-title">Discover</h2>
      <p>
        This portfolio is designed as a retro Windows desktop experience.
        Here's how to navigate and interact with the interface:
      </p>
      <ul className="welcome-usage-list">
        <li>
          <strong>Click</strong> an icon to select it (it will highlight in blue)
        </li>
        <li>
          <strong>Double-click</strong> icons to open windows and view content
        </li>
        <li>
          <strong>Drag</strong> icons to rearrange them on the desktop
        </li>
        <li>
          <strong>Drag</strong> windows by their title bar to reposition them
        </li>
        <li>
          <strong>Click ×</strong> to close a window
        </li>
        <li>
          <strong>Click •</strong> to maximize a window (click again to restore)
        </li>
        <li>
          <strong>Click -</strong> to minimize a window to the taskbar
        </li>
      </ul>
      <p>
        Explore the available sections: "About Me" for my professional
        background and skills, "My Projects" to see my work, "My
        Certificates" to view my achievements, and "My Contact" for ways
        to reach out. You can also use the "Message Me" program to send me
        a message directly.
      </p>
    </>
  ),
  "contact-now": (
    <>
      <h2 className="welcome-title">Contact</h2>
      <p>
        I'd love to connect with you! Whether you're interested in
        collaboration, have questions about my work, or just want to say
        hello, feel free to reach out. I'm always open to new
        opportunities, feedback, or a friendly conversation.
      </p>
      <ul className="welcome-usage-list">
        <li>
          <strong>Email:</strong> nguyenminhkhoi3913@gmail.com
        </li>
        <li>
          <strong>Message Me:</strong> Use the "Message Me" program icon on
          the desktop to send me a message directly through this interface
        </li>
        <li>
          <strong>My Contact:</strong> Open the "My Contact" window for
          additional contact information and links
        </li>
      </ul>
      <p className="welcome-closing-text">
        Thank you for visiting my portfolio! Don't hesitate to reach out
        if you'd like to discuss projects, opportunities, or anything else.
        I look forward to hearing from you!
      </p>
    </>
  ),
};

const MENU_ITEMS = [
  { id: "welcome", label: "Welcome" },
  { id: "discover", label: "Discover" },
  { id: "contact-now", label: "Contact" },
];

import TreeIcon from "../../assets/icons/Tree.ico";

const Welcome = memo(() => {
  const [activeSection, setActiveSection] = useState("welcome");

  const content = useMemo(
    () => WELCOME_CONTENT[activeSection] || null,
    [activeSection]
  );

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <img src={TreeIcon} alt="Tree" className="welcome-header-icon" />
        <h1 className="welcome-header-title">GOMI 3</h1>
      </div>
      <div className="welcome-main-layout">
        <div className="welcome-buttons-group">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className="welcome-menu-item window-button program-button"
              onClick={() => handleSectionChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="welcome-content-section">{content}</div>
      </div>
    </div>
  );
});

Welcome.displayName = "Welcome";

export default Welcome;
