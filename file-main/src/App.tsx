import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Bell } from 'lucide-react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import CompleteProfile from './components/CompleteProfile';
import OnboardingPreferences from './components/OnboardingPreferences';
import UserProfile from './components/UserProfile';
import GroupDetailPage from './components/GroupDetailPage';
import CafeMenu from './components/CafeMenu';
import PaymentPage from './components/PaymentPage';
import AdminDashboard from './components/AdminDashboard';
import FindGroups from './components/FindGroups';
import Notifications from './components/Notifications';
import PartnerRegistration from './components/PartnerRegistration';
import PartnerLoginChoice from './components/PartnerLoginChoice';
import Settings from './components/Settings';
import ReportProblem from './components/ReportProblem';
import JoinGroup from './components/JoinGroup';
import CafeOwnerDashboard from './components/CafeOwnerDashboard';
import CafeVerificationPending from './components/CafeVerificationPending';
import CafeOwnerGoogleLogin from './components/CafeOwnerGoogleLogin';
import AboutUs from './components/AboutUs';
import HowItWorks from './components/HowItWorks';
import SafetyGuidelines from './components/SafetyGuidelines';
import CoffeeLoader from './components/CoffeeLoader';
import AdminDetails from './components/AdminDetails';
import MeetupCode from './components/MeetupCode';
import CafeSelectionCreate from './components/CafeSelectionCreate';
import CafeVotingCreate from './components/CafeVotingCreate';
import MeetupChatBilling from './components/MeetupChatBilling';
import PaymentOnline from './components/PaymentOnline';
import JoinMeetup from './components/JoinMeetup';
import JoinVoting from './components/JoinVoting';
import CafeDetailsPage from './components/CafeDetailsPage';
import AllCafesPage from './components/AllCafesPage';
import { initializeApp } from './utils/initializeApp';
import { initializeNotifications, getUnreadCount } from './utils/notificationManager';
import { clearAllGroupData } from './utils/groupStateManager';
import { getAvatarById } from './utils/avatarData';
import { getCafeById } from './utils/cafesData';
import { safeStorage, safeWindow, safeDocument } from './utils/safeStorage';
import { BASE_URL } from './utils/api';
const CAFFELINO_LOGO_URL = 'https://i.postimg.cc/g0S6yjSj/caffelino-removebg-preview.png';
type Page =
  | "landing"
  | "home"
  | "login"
  | "complete-profile"
  | "onboarding"
  | "profile"
  | "group-detail"
  | "cafe-menu"
  | "payment"
  | "admin"
  | "find-groups"
  | "notifications"
  | "partner-registration"
  | "partner-login-choice"
  | "settings"
  | "report-problem"
  | "join-group"
  | "cafe-owner-dashboard"
  | "cafe-verification-pending"
  | "about-us"
  | "how-it-works"
  | "safety-guidelines"
  | "admin-details"
  | "meetup-code"
  | "create-meetup-step2"
  | "create-meetup-step3"
  | "cafe-selection-create"
  | "cafe-voting-create"
  | "create-meetup-step5"
  | "meetup-chat-billing"
  | "meetup-chat-billing-completed"
  | "payment-online"
  | "join-meetup"
  | "join-voting"
  | "cafe-details"
  | "all-cafes"
  | "cafe-owner-google-login";

interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  photo?: string;
  interests: string[];
  verified: boolean;
  isAdmin?: boolean;
  avatarId?: string;

  firstName?: string;
  lastName?: string;
  gender?: string;
  bio?: string;
  cafeVibe?: string[];
  cuisinePreference?: string[];
  beverage?: string;
  hobbies?: string[];
  purpose?: string[];
  locality?: string;
  distance?: string;
  availableDays?: string[];
  preferredTime?: string;
  lookingFor?: string[];
  groupSize?: string;
  instagram?: string;
  linkedin?: string;
  profileVisibility?: string;
  notifyNewCafes?: boolean;
  notifyEvents?: boolean;
  notifyMessages?: boolean;
  cafeMood?: string;
  favoriteDrink?: string;
  cafeName?: string;
  isCafeOwner?: boolean;
  profileCompleted?: boolean;
  role?: string;
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Brewing your experience...");

  const setLoading = (loading: boolean, message?: string) => {
    setIsLoading(loading);
    if (message) {
      setLoadingMessage(message);
    } else {
      setLoadingMessage("Brewing your experience...");
    }
  };

  const getPersistedUser = (): User | null => {
    try {
      const saved = safeStorage.getItem('caffelino_user');
      if (saved) return JSON.parse(saved) as User;
    } catch (e) { }
    return null;
  };

  const hasCompletedProfile = (user: User | null): boolean => {
    if (!user) return false;
    if (user.profileCompleted === true) return true;
    if (user.role === 'cafe' || user.isCafeOwner) return true; // Cafe owners skip user profile
    
    // Check local storage for profile data
    const savedProfile = safeStorage.getItem(`user_${user.id}_profile`);
    if (savedProfile) return true;

    // Check if essential fields are present
    return !!(user.gender || user.city);
  };

  const getPersistedPage = (): Page => {
    const user = getPersistedUser();
    const savedCurrentPage = safeStorage.getItem('caffelino_currentPage') as Page;
    const userMode = safeStorage.getItem('caffelino_userMode');
    const myCafeId = safeStorage.getItem('myCafeId');

    if (user) {
      if (hasCompletedProfile(user)) {
        if (savedCurrentPage && !['landing', 'login', 'partner-login-choice'].includes(savedCurrentPage)) {
           if (savedCurrentPage === 'cafe-owner-dashboard') {
              if (myCafeId) return 'cafe-owner-dashboard';
              if (userMode === 'partner' || user.role === 'cafe' || user.isCafeOwner) return 'partner-registration';
              return 'home';
           }
           return savedCurrentPage;
        }

        if (userMode === 'partner' || user.role === 'cafe' || user.isCafeOwner) {
          return myCafeId ? 'cafe-owner-dashboard' : 'partner-registration';
        }
        return 'home';
      } else {
        return 'complete-profile';
      }
    }
    
    // User is NOT logged in. Preserve common public pages instead of always forcing landing.
    if (savedCurrentPage) {
      const publicPages = [
        'landing', 'login', 'partner-login-choice', 'about-us', 
        'how-it-works', 'safety-guidelines', 'partner-registration', 
        'cafe-owner-google-login'
      ];
      if (publicPages.includes(savedCurrentPage)) {
        return savedCurrentPage;
      }
    }

    return 'landing';
  };

  const getPersistedHistory = (): Page[] => {
    return [getPersistedPage()];
  };

  const getPersistedGroup = (): any => {
    try {
      const saved = safeStorage.getItem('caffelino_selectedGroup');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return null;
  };

  const getPersistedCafe = (): any => {
    try {
      const saved = safeStorage.getItem('caffelino_selectedCafe');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return null;
  };

  const getPersistedMode = (): "go" | "partner" | null => {
    try {
      const saved = safeStorage.getItem('caffelino_userMode');
      if (saved === 'go' || saved === 'partner') return saved;
    } catch (e) { }
    return null;
  };

  const [currentPage, setCurrentPage] = useState<Page>(getPersistedPage());
  const [pageHistory, setPageHistory] = useState<Page[]>(getPersistedHistory());
  const [user, setUser] = useState<User | null>(getPersistedUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(getPersistedGroup());
  const [selectedCafe, setSelectedCafe] = useState<any>(getPersistedCafe());
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userMode, setUserMode] = useState<"go" | "partner" | null>(getPersistedMode());
  const [deepLinkCode, setDeepLinkCode] = useState<string | null>(null);
  const [userJustLoggedIn, setUserJustLoggedIn] = useState(false);

  useEffect(() => { safeStorage.setItem('caffelino_currentPage', currentPage); }, [currentPage]);
  useEffect(() => { safeStorage.setItem('caffelino_pageHistory', JSON.stringify(pageHistory)); }, [pageHistory]);
  useEffect(() => {
    if (user) { safeStorage.setItem('caffelino_user', JSON.stringify(user)); }
    else { safeStorage.removeItem('caffelino_user'); }
  }, [user]);
  useEffect(() => {
    if (selectedGroup) { safeStorage.setItem('caffelino_selectedGroup', JSON.stringify(selectedGroup)); }
    else { safeStorage.removeItem('caffelino_selectedGroup'); }
  }, [selectedGroup]);
  useEffect(() => {
    if (selectedCafe) { safeStorage.setItem('caffelino_selectedCafe', JSON.stringify(selectedCafe)); }
    else { safeStorage.removeItem('caffelino_selectedCafe'); }
  }, [selectedCafe]);
  useEffect(() => {
    if (userMode) { safeStorage.setItem('caffelino_userMode', userMode); }
    else { safeStorage.removeItem('caffelino_userMode'); }
  }, [userMode]);

  const isPopStateNav = useRef(false);

  useEffect(() => {
    initializeApp();
    if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.history.replaceState({ page: getPersistedPage() }, '');
    safeWindow.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        isPopStateNav.current = true;
        // If backing out of chat/billing pages, skip intermediate steps and go home
        const chatPages = ['meetup-chat-billing', 'meetup-chat-billing-completed'];
        const skipPages = ['meetup-code', 'cafe-selection-create', 'cafe-voting-create', 'create-meetup-step3', 'create-meetup-step5', 'admin-details'];
        if (chatPages.includes(currentPage) || skipPages.includes(event.state.page)) {
          setCurrentPage('home' as Page);
          setPageHistory(['home'] as Page[]);
          window.history.replaceState({ page: 'home' }, '');
          return;
        }
        setCurrentPage(event.state.page);
        setPageHistory((prev: Page[]) => {
          if (prev.length > 1) {
            const newHist = [...prev];
            newHist.pop();
            return newHist;
          }
          return ['landing'];
        });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPage]);

  useEffect(() => {
    if (isPopStateNav.current) {
      isPopStateNav.current = false;
    } else {
      window.history.pushState({ page: currentPage }, '', '');
    }
    safeWindow.scrollTo(0, 0);
    safeDocument.scrollTop.set(0);
  }, [currentPage]);

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const prevPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(prevPage);
    } else {
      setCurrentPage('home');
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: (eventData) => {
      if (eventData.deltaX > 100) { handleBack(); }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 50,
  });

  useEffect(() => {
    const handleOnline = () => { setLoading(false); };
    const handleOffline = () => { setLoading(true, "Connection lost. Reconnecting..."); };
    safeWindow.addEventListener("online", handleOnline);
    safeWindow.addEventListener("offline", handleOffline);
    return () => {
      safeWindow.removeEventListener("online", handleOnline);
      safeWindow.removeEventListener("offline", handleOffline);
    };
  }, [setLoading]);

  const toggleDarkMode = (enabled: boolean) => {
    if (enabled) {
      safeDocument.classList.add("documentElement", "dark");
      safeStorage.setItem("cafelino-theme", "dark");
    } else {
      safeDocument.classList.remove("documentElement", "dark");
      safeStorage.setItem("cafelino-theme", "light");
    }
  };

  const handleModeSelection = async (mode: "go" | "partner") => {
    setLoading(true, "Setting up your experience...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUserMode(mode);
    if (mode === "partner") { navigateTo("partner-login-choice"); }
    else { navigateTo("home"); }
    setLoading(false);
  };

  const handleLogin = async (userData: User) => {
    setLoading(true, "Logging you in...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const savedProfile = safeStorage.getItem(`user_${userData.id}_profile`);
    let profileData = {};
    if (savedProfile) {
      try { profileData = JSON.parse(savedProfile); }
      catch (e) { console.error('Error parsing saved profile:', e); }
    }

    const mergedUser = { ...userData, ...profileData };
    setUser(mergedUser);
    initializeNotifications();
    setUnreadNotifications(getUnreadCount());
    setShowAuthModal(false);

    // ✅ Trigger promo popup on login/signup
    localStorage.removeItem('promo_seen');
    setUserJustLoggedIn(true);
    setTimeout(() => setUserJustLoggedIn(false), 6000); // Reset after 6s

    const isPartnerFlow = userMode === "partner" || (userMode === null && userData.role === "cafe");

    if (isPartnerFlow) {
      try {
        const { getMyCafe } = await import('./services/cafeService');
        const userId = userData.id;
        const cafeResult = await getMyCafe(userId);

        if (cafeResult && cafeResult.cafe) {
          const cafe = cafeResult.cafe as any;
          safeStorage.setItem('pendingCafeName', (cafe.cafeName || '') as string);
          safeStorage.setItem('myCafeId', (cafe.id || cafe._id) as string);
          safeStorage.setItem('myCafeOwnerId', userId);
          
          if (cafe.status === true || cafe.isVerified === true) {
            navigateTo("cafe-owner-dashboard", {
              cafeName: cafe.cafeName,
              email: userData.email,
              isCafeOwner: true,
              cafeId: cafe.id || cafe._id,
              userId: userData.id,
              id: userData.id
            } as any);
          } else {
            navigateTo("cafe-verification-pending");
          }
        } else {
          navigateTo("partner-registration");
        }
      } catch (error) {
        console.error('Error checking cafe status:', error);
        navigateTo("partner-registration");
      }
    } else {
      try {
        const { getActiveSession } = await import('./utils/sessionManager');
        const activeSession = getActiveSession(userData.id);
        if (activeSession) {
          navigateTo(activeSession.lastNavigationPage as Page, activeSession.navigationData);
        } else {
          if (hasCompletedProfile(mergedUser)) { navigateTo("home"); }
          else { navigateTo("complete-profile"); }
        }
      } catch (error) {
        console.error('Session restoration error:', error);
        if (hasCompletedProfile(mergedUser)) { navigateTo("home"); }
        else { navigateTo("complete-profile"); }
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true, "Logging out...");
    await new Promise((resolve) => setTimeout(resolve, 600));

    const isPartner = userMode === "partner";
    setUser(null);
    setSelectedGroup(null);
    setSelectedCafe(null);
    safeStorage.removeItem('caffelino_currentPage');
    safeStorage.removeItem('caffelino_pageHistory');
    safeStorage.removeItem('caffelino_user');
    safeStorage.removeItem('caffelino_selectedGroup');
    safeStorage.removeItem('caffelino_selectedCafe');
    safeStorage.removeItem('caffelino_userMode');

    if (isPartner) { navigateTo("partner-login-choice"); }
    else { navigateTo("home"); }

    setLoading(false);
  };

  const navigateTo = (page: string, data?: any) => {
    const pageToNav = page as Page;
    setLoading(true, "Loading...");
    
    setTimeout(async () => {
      if (user && data?.groupId) {
        try {
          const { saveActiveSession, getSessionStepFromPage } = await import('./utils/sessionManager');
          const currentStep = getSessionStepFromPage(pageToNav);
          saveActiveSession(user.id, data.groupId, currentStep, pageToNav, data);
        } catch (e) {}
      }

      const groupPages = [
        "group-detail", "group-interaction", "group-home", "voting-complete",
        "invite-members", "cafe-voting", "create-meetup-step2", "meetup-code",
        "create-meetup-step3", "cafe-selection-create", "cafe-voting-create",
        "create-meetup-step5", "meetup-chat", "cafe-selection-admin", "meetup-voting",
        "voting-result", "meetup-group-page", "join-with-code-cafe-view",
        "join-request-waiting", "bill-split-confirmation", "member-payment-screen",
        "payment-status-dashboard", "payment-completion", "digital-receipt",
        "menu-selection", "order-summary", "order-based-billing", "restaurant-bill-scan",
        "bill-approval-admin", "group-chat", "meetup-chat-billing-completed",
        "payment-online", "join-voting", "join-meetup", "meetup-chat-billing"
      ];

      if (groupPages.includes(pageToNav) && data) {
        setSelectedGroup(data);
      }

      if (pageToNav === "cafe-menu" && data) { setSelectedCafe(data); }

      if (pageToNav === "cafe-owner-dashboard" && data) {
        if (data.cafeId) {
          safeStorage.setItem('myCafeId', data.cafeId);
        }
        if (data.cafeName || data.email) {
          setUser((prevUser) => prevUser ? ({
            ...prevUser,
            cafeName: data.cafeName || prevUser.cafeName,
            email: data.email || prevUser.email,
            isCafeOwner: true,
          }) : null);
        }
      }

      if (pageToNav === "cafe-details" && data) {
        if (data.dbCafe) { setSelectedCafe(data.dbCafe); }
        else if (data.cafeId) {
          const cafe = getCafeById(data.cafeId);
          setSelectedCafe(cafe);
        }
      }

      setPageHistory((prev) => [...prev, pageToNav]);
      setCurrentPage(pageToNav);
      setLoading(false);
    }, 600);
  };

  const handleCompleteProfile = async (profileData: any) => {
    setLoading(true, "Saving your profile...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (user) {
      const updatedUser = {
        ...user,
        ...profileData,
        name: profileData.firstName + (profileData.lastName ? " " + profileData.lastName : ""),
        firstName: profileData.firstName,
        gender: profileData.gender,
        city: profileData.city,
        interests: profileData.hobbies || [],
        photo: profileData.profilePhoto || user.photo,
        avatarId: profileData.avatarId || '',
      };

      try {
        const response = await fetch(`${BASE_URL}/api/user/profile/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            gender: profileData.gender,
            city: profileData.city,
          })
        });
        if (response.ok) {
          const result = await response.json();
          if (result.user && result.user.profileCompleted) {
            updatedUser.profileCompleted = true;
          }
        }
      } catch (error) {
        console.error("Error saving profile to backend:", error);
      }

      setUser(updatedUser);
      safeStorage.setItem(`user_${user.id}_profile`, JSON.stringify({
        firstName: profileData.firstName,
        name: updatedUser.name,
        email: updatedUser.email,
        gender: profileData.gender,
        avatarId: profileData.avatarId || '',
      }));
    }
    await navigateTo("home");
    setLoading(false);
  };

  const updateNotificationCount = () => {
    const count = getUnreadCount();
    setUnreadNotifications(count);
  };

  const noHeaderPages = [
    "admin", "landing", "partner-registration", "partner-login-choice",
    "cafe-owner-google-login", "complete-profile", "cafe-owner-dashboard",
    "cafe-verification-pending", "group-home", "voting-complete", "admin-details",
    "meetup-code", "create-meetup-step3", "cafe-selection-create", "cafe-voting-create",
    "meetup-chat-billing", "meetup-chat-billing-completed", "payment-online",
    "join-meetup", "join-voting", "meetup-group-page"
  ];

  const showHeader = !noHeaderPages.includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onSelectMode={handleModeSelection} />;
      case "home":
        return <HomePage user={user} onNavigate={navigateTo} onShowAuth={() => setShowAuthModal(true)} userJustLoggedIn={userJustLoggedIn} />;
      case "complete-profile":
        return <CompleteProfile user={user} onComplete={handleCompleteProfile} />;
      case "onboarding":
        return <OnboardingPreferences user={user} onComplete={() => setCurrentPage("home")} />;
      case "profile":
        return <UserProfile user={user} onNavigate={navigateTo} onLogout={handleLogout} onUpdateUser={(updatedUser) => setUser(updatedUser)} />;
      case "group-detail":
        return <GroupDetailPage user={user} group={selectedGroup} onNavigate={navigateTo} />;
      case "cafe-menu":
        return <CafeMenu cafe={selectedCafe} onNavigate={navigateTo} />;
      case "payment":
        return <PaymentPage onNavigate={navigateTo} />;
      case "admin":
        return <AdminDashboard onNavigate={navigateTo} />;
      case "find-groups":
        return <FindGroups user={user} onNavigate={navigateTo} onShowAuth={() => setShowAuthModal(true)} onBack={handleBack} />;
      case "notifications":
        return <Notifications user={user} onNavigate={navigateTo} onBack={() => navigateTo('home')} />;
      case "partner-registration":
        return <PartnerRegistration onNavigate={navigateTo} />;
      case "partner-login-choice":
        return <PartnerLoginChoice onNavigate={navigateTo} />;
      case "cafe-owner-google-login":
        return <CafeOwnerGoogleLogin onNavigate={navigateTo} />;
      case "settings":
        return <Settings user={user} onNavigate={navigateTo} onUpdateUser={setUser} onLogout={handleLogout} />;
      case "report-problem":
        return <ReportProblem onNavigate={navigateTo} user={user} />;
      case "join-group":
        return <JoinGroup user={user} onNavigate={navigateTo} />;
      case "cafe-owner-dashboard":
        return <CafeOwnerDashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} />;
      case "cafe-verification-pending":
        return <CafeVerificationPending onNavigate={navigateTo} />;
      case "about-us":
        return <AboutUs onNavigate={navigateTo} />;
      case "how-it-works":
        return <HowItWorks onNavigate={navigateTo} />;
      case "safety-guidelines":
        return <SafetyGuidelines onNavigate={navigateTo} />;
      case "admin-details":
        return <AdminDetails user={user} onNavigate={navigateTo} onBack={handleBack} />;
      case "meetup-code":
        return <MeetupCode user={user} meetupData={selectedGroup} onNavigate={navigateTo} onBack={handleBack} />;
      case "create-meetup-step3":
      case "cafe-selection-create":
        return <CafeSelectionCreate user={user} meetupData={selectedGroup} onNavigate={navigateTo} onBack={handleBack} />;
      case "cafe-voting-create":
        return <CafeVotingCreate user={user} meetupData={selectedGroup} onNavigate={navigateTo} onBack={handleBack} />;
      case "create-meetup-step5":
        return <CafeVotingCreate user={user} meetupData={selectedGroup} onNavigate={navigateTo} onBack={handleBack} />;
      case "meetup-chat-billing":
        return <MeetupChatBilling user={user} meetupData={selectedGroup} onNavigate={navigateTo} onBack={() => navigateTo('home')} onNotificationUpdate={updateNotificationCount} />;
      case "meetup-chat-billing-completed":
        return <MeetupChatBilling user={user} meetupData={selectedGroup} onNavigate={navigateTo} onBack={() => navigateTo('home')} onNotificationUpdate={updateNotificationCount} />;
      case "payment-online":
        return <PaymentOnline user={user} meetupData={selectedGroup} onNavigate={navigateTo} onBack={handleBack} onNotificationUpdate={updateNotificationCount} />;
      case "join-meetup":
        return <JoinMeetup user={user} onNavigate={navigateTo} onBack={handleBack} />;
      case "join-voting":
        return <JoinVoting user={user} meetupData={selectedGroup} onNavigate={navigateTo} onBack={handleBack} />;
      case "cafe-details":
        return <CafeDetailsPage cafe={selectedCafe} user={user} onNavigate={navigateTo} onBack={handleBack} />;
      case "all-cafes":
        return <AllCafesPage onNavigate={navigateTo} onBack={handleBack} />;
      default:
        if (currentPage !== 'landing' && currentPage !== 'home') {
          setTimeout(() => navigateTo('home'), 0);
        }
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" {...swipeHandlers}>
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 h-[72px] md:h-[80px] bg-[#be9d80] border-b border-[#a88968] z-50 shadow-md">
          <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
            </div>
            <div className="flex items-center gap-4 relative">
              {user ? (
                <>
                  <div className="flex items-center">
                    <p className="text-black text-[18px] md:text-[20px] font-['Arial:Bold',_sans-serif] font-bold tracking-wide">
                      {user.firstName || user.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="p-2.5 rounded-full hover:bg-[#a88968] transition-colors w-11 h-11 flex items-center justify-center relative"
                      aria-label="Notifications"
                      onClick={() => navigateTo("notifications")}
                    >
                      <Bell className="w-6 h-6 text-white" />
                      {unreadNotifications > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                          {unreadNotifications}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => navigateTo("profile")}
                      aria-label="Profile"
                      className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] border-2 border-white/60 hover:opacity-80 transition-opacity shadow-sm"
                    >
                      {user.avatarId && (user.gender === 'male' || user.gender === 'female') ? (
                        <span className="text-2xl">{getAvatarById(user.avatarId)?.emoji}</span>
                      ) : (
                        <span className="text-xl text-[#8b5943] font-semibold">
                          {user.firstName?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="p-2.5 rounded-full hover:bg-[#a88968] transition-colors"
                    aria-label="Notifications"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <Bell className="w-6 h-6 text-white" />
                  </button>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white text-slate-900 hover:bg-slate-100 rounded-lg px-4 md:px-7 text-base font-medium py-2"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={showHeader ? "pt-[72px] md:pt-[80px]" : ""}>
        {renderPage()}
      </main>

      {!user &&
        currentPage !== "landing" &&
        currentPage !== "partner-registration" &&
        currentPage !== "partner-login-choice" &&
        currentPage !== "cafe-owner-google-login" &&
        currentPage !== "cafe-owner-dashboard" &&
        currentPage !== "cafe-verification-pending" &&
        currentPage !== "admin" && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-slate-600">Join Caffélino to create and join groups</p>
              </div>
              <Button onClick={() => setShowAuthModal(true)} className="ml-4">Login / Sign Up</Button>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1665463193520-03ce64841ddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwY2hhcmFjdGVyJTIwZmFjZXxlbnwxfHx8fDE3NjE0MDQzOTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

      {showAuthModal && (
        <LoginSignup onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      )}

      <Toaster />

      <AnimatePresence>
        {isLoading && <CoffeeLoader message={loadingMessage} />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}