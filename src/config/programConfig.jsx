import About from "../utilities/About/About";
import Contact from "../utilities/Contact/Contact";
import Welcome from "../utilities/Welcome/Welcome";
import Message from "../utilities/Message/Message";
import StarShow from "../utilities/StarShow/StarShow";
import Version from "../utilities/Version/Version";

// Import your icons
import logoIcon from "../assets/icons/Tree.ico";
import cardIcon from "../assets/icons/Microsoft Windows 3 Cardfile.ico";
import folderIcon from "../assets/icons/Microsoft Windows 3 Folder.ico";
import notebookIcon from "../assets/icons/Microsoft Windows 3 Binder.ico";
import calculatorIcon from "../assets/icons/Microsoft Windows 3 Calculator.ico";
import calendarIcon from "../assets/icons/Microsoft Windows 3 Calendar.ico";
import clockIcon from "../assets/icons/Microsoft Windows 3 Clock.ico";
import monaLisaIcon from "../assets/icons/Microsoft Windows 3 Mona Lisa.ico";
import videoIcon from "../assets/icons/Microsoft Windows 3 Media Player.ico";
import newsIcon from "../assets/icons/Microsoft Windows 3 Newspaper.ico";
import internetIcon from "../assets/icons/Microsoft Windows 3 International.ico";
import cameraIcon from "../assets/icons/Microsoft Windows 3 Camera.ico";
import paintIcon from "../assets/icons/Microsoft Windows 3 Paint Tools.ico";
import dllSetupIcon from "../assets/icons/Certificate.ico";
import briefcaseIcon from "../assets/icons/Microsoft Windows 3 Briefcase.ico";
import computerIcon from "../assets/icons/Microsoft Windows 3 Computer.ico";
import faxIcon from "../assets/icons/Microsoft Windows 3 Fax Machine.ico";
import docIcon from "../assets/icons/Microsoft Windows 3 Documents.ico";
import aboutIcon from "../assets/icons/Microsoft Windows 3 Post-It.ico";

// Unified desktop items configuration
export const desktopItems = [
  {
    id: "about",
    label: "About Me",
    iconSrc: computerIcon,
    type: "icon",
    isMaximizable: false,
  },
  {
    id: "certificates",
    label: "My Certificates",
    iconSrc: dllSetupIcon,
    type: "folder",
    positionRight: false,
    contents: [
      {
        id: "network",
        label: "Computer Communications",
        iconSrc: docIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://www.coursera.org/account/accomplishments/specialization/EB5BPKJWRHKZ",
      },
      {
        id: "pm",
        label: "Project Management",
        iconSrc: docIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://www.coursera.org/account/accomplishments/specialization/TL03HX7CKRQF",
      },
      {
        id: "dev",
        label: "Software Development",
        iconSrc: docIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://www.coursera.org/account/accomplishments/specialization/RF6X2AN8M4CX",
      },
      {
        id: "ux",
        label: "UI/UX Design",
        iconSrc: docIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://www.coursera.org/account/accomplishments/specialization/5VA9KE6TB7HW",
      },
      {
        id: "web",
        label: "Web Design",
        iconSrc: docIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://www.coursera.org/account/accomplishments/specialization/KKQDLWDJGR84",
      },
    ],
  },
  {
    id: "projects",
    label: "My Projects",
    iconSrc: briefcaseIcon,
    type: "folder",
    positionRight: false,
    contents: [
      {
        id: "portfolio",
        label: "VisiCore",
        iconSrc: logoIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://khonloi.github.io/retro-homepage/",
      },
    ],
  },
  {
    id: "contact",
    label: "My Contact",
    iconSrc: cardIcon,
    type: "icon",
    isMaximizable: false,
  },
  {
    id: "message",
    label: "Message Me",
    iconSrc: faxIcon,
    type: "icon",
    isMaximizable: false,
  },
    {
    id: "version",
    label: "Version",
    iconSrc: logoIcon,
    type: "icon",
    isMaximizable: false,
  },
  {
    id: "welcome",
    label: "Welcome",
    iconSrc: aboutIcon,
    type: "icon",
    isMaximizable: false,
    startup: true,
  },
  {
    id: "programs",
    label: "Programs",
    iconSrc: folderIcon,
    type: "folder",
    positionRight: true,
    contents: [
      {
        id: "calculator",
        label: "Calculator",
        iconSrc: calculatorIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "calendar",
        label: "Calendar",
        iconSrc: calendarIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "camera",
        label: "Camera",
        iconSrc: cameraIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "canvas",
        label: "Canvas",
        iconSrc: paintIcon,
        type: "icon",
        isMaximizable: true,
        isFullScreen: true, // Enable full-screen for Canvas
      },
      {
        id: "clock",
        label: "Clock",
        iconSrc: clockIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "internet",
        label: "Internet",
        iconSrc: internetIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "news",
        label: "News",
        iconSrc: newsIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "notebook",
        label: "Notebook",
        iconSrc: notebookIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "photo",
        label: "Photo",
        iconSrc: monaLisaIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "video",
        label: "Media",
        iconSrc: videoIcon,
        type: "icon",
        isMaximizable: true,
      },
    ],
  },
  {
    id: "starshow",
    label: "Star Show",
    // iconSrc: logoIcon,
    type: "icon",
    positionRight: true,
    isFullScreen: true,
  },
];

// Window content registry for better maintainability and performance
const windowContentRegistry = {
  about: About,
  contact: Contact,
  welcome: Welcome,
  message: Message,
  starshow: StarShow,
  version: Version,
};

// Default fallback component
const DefaultWindowContent = ({ windowTitle }) => (
  <div className="p-4">
    <h3 className="text-lg font-bold">{windowTitle}</h3>
    <p>{windowTitle} coming soon...</p>
    <p>This would be where the {windowTitle} interface would load.</p>
  </div>
);

// Window content renderer function - optimized with registry lookup
export const renderWindowContent = (windowId, windowTitle) => {
  const Component = windowContentRegistry[windowId];
  if (Component) {
    return <Component />;
  }
  return <DefaultWindowContent windowTitle={windowTitle} />;
};