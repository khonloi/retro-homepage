import About from "../features/About/About";
import Contact from "../features/Contact/Contact";
import Welcome from "../features/Welcome/Welcome";
import Message from "../features/Message/Message";
import StarShow from "../features/StarShow/StarShow";
import VideoPlayer from "../features/VideoPlayer/VideoPlayer";

// Import your icons
import logoIcon from "../assets/icons/Tree.ico";
import cardIcon from "../assets/icons/Microsoft Windows 3 Cardfile.ico";
import folderIcon from "../assets/icons/Microsoft Windows 3 Folder.ico";
import notebookIcon from "../assets/icons/Microsoft Windows 3 Binder.ico";
import calculatorIcon from "../assets/icons/Microsoft Windows 3 Calculator.ico";
import calendarIcon from "../assets/icons/Microsoft Windows 3 Calendar.ico";
import clockIcon from "../assets/icons/Microsoft Windows 3 Clock.ico";
import monaLisaIcon from "../assets/icons/Microsoft Windows 3 Mona Lisa.ico";
import mediaIcon from "../assets/icons/Microsoft Windows 3 Media Player.ico";
import newsIcon from "../assets/icons/Microsoft Windows 3 Newspaper.ico";
import internetIcon from "../assets/icons/Microsoft Windows 3 International.ico";
import cameraIcon from "../assets/icons/Microsoft Windows 3 Camera.ico";
import paintIcon from "../assets/icons/Microsoft Windows 3 Paint Tools.ico";
import dllSetupIcon from "../assets/icons/Certificate.ico";
import briefcaseIcon from "../assets/icons/Microsoft Windows 3 Briefcase.ico";
import computerIcon from "../assets/icons/Microsoft Windows 3 Computer.ico";
import faxIcon from "../assets/icons/Microsoft Windows 3 Fax Machine.ico";
import docIcon from "../assets/icons/Microsoft Windows 3 Documents.ico";
import noteIcon from "../assets/icons/Microsoft Windows 3 Post-It.ico";
import gashIcon from "../assets/icons/GASH.ico";
import cassetteIcon from "../assets/icons/Microsoft Windows 3 Cassette.ico";
import plannerIcon from "../assets/icons/Microsoft Windows 3 ClipBook Viewer.ico";
import compressorIcon from "../assets/icons/Microsoft Windows 3 Compression.ico";
import safeIcon from "../assets/icons/Microsoft Windows 3 Safe.ico";
import schedulerIcon from "../assets/icons/Microsoft Windows 3 Schedule.ico";
import recorderIcon from "../assets/icons/Microsoft Windows 3 Sound Recorder.ico";
import minesweeperIcon from "../assets/icons/Microsoft Windows 3 Minesweeper.ico";
import solitaireIcon from "../assets/icons/Microsoft Windows 3 Solitaire.ico";

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
        label: "Computer Network",
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
        label: "GOMI 3",
        iconSrc: logoIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://khonloi.github.io/retro-homepage/",
      },
      {
        id: "gash1",
        label: "GASH",
        iconSrc: gashIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://gash-frontend.vercel.app/",
      },
      {
        id: "gash2",
        label: "GASH Dashboard",
        iconSrc: gashIcon,
        type: "icon",
        isMaximizable: false,
        link: "https://gash-dashboard.vercel.app/",
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
    id: "welcome",
    label: "Welcome",
    iconSrc: noteIcon,
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
        id: "clock",
        label: "Clock",
        iconSrc: clockIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "compressor",
        label: "Compressor",
        iconSrc: compressorIcon,
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
        id: "paint",
        label: "Paint",
        iconSrc: paintIcon,
        type: "icon",
        isMaximizable: true,
        isFullScreen: true,
      },
      {
        id: "planner",
        label: "Planner",
        iconSrc: plannerIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "recorder",
        label: "Recorder",
        iconSrc: recorderIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "safe",
        label: "Safe",
        iconSrc: safeIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "scheduler",
        label: "Scheduler",
        iconSrc: schedulerIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "video",
        label: "Video Player",
        iconSrc: mediaIcon,
        type: "icon",
        isMaximizable: true,
      },
    ],
  },
  {
    id: "games",
    label: "Games",
    iconSrc: folderIcon,
    type: "folder",
    positionRight: true,
    contents: [
      {
        id: "minesweeper",
        label: "Minesweeper",
        iconSrc: minesweeperIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "solitaire",
        label: "Solitaire",
        iconSrc: solitaireIcon,
        type: "icon",
        isMaximizable: false,
      },
    ],
  },
  {
    id: "photo",
    label: "Photo",
    iconSrc: monaLisaIcon,
    type: "icon",
    isMaximizable: true,
    positionRight: true,
  },
  {
    id: "music",
    label: "Music Player",
    iconSrc: cassetteIcon,
    type: "icon",
    positionRight: true,
  },
  {
    id: "video",
    label: "Video Player",
    iconSrc: mediaIcon,
    type: "icon",
    isMaximizable: true,
    positionRight: true,
  },
  {
    id: "starshow",
    label: "Star Show",
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
  video: VideoPlayer,
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
