import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Bell } from 'lucide-react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { AnimatePresence } from 'motion/react';
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
import imgLogo from 'figma:asset/c3ec3feac5c0ab68f4c09d5c8a9e7f9f7f0c40c4.png';
import imgCaffelinoLogo from 'figma:asset/ea8edc7a5e80446726722176201d332f9359a7a2.png';

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
  age: number;
  email: string;
  city: string;
  photo?: string;
  interests: string[];
  verified: boolean;
  isAdmin?: boolean;
  avatarId?: string; // Custom avatar ID from avatar selection
  mobileNumber?: string; // Mobile number (+91XXXXXXXXXX format)
  // Complete Profile fields
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
  // Cafe Owner fields
  cafeName?: string;
  isCafeOwner?: boolean;
  profileCompleted?: boolean;
  role?: string;
}

function AppContent() {
  // Loading state management
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

  // ─── Restore persisted state from localStorage ─────────────────
  const getPersistedUser = (): User | null => {
    try {
      const saved = safeStorage.getItem('caffelino_user');
      if (saved) return JSON.parse(saved) as User;
    } catch (e) { /* ignore */ }
    return null;
  };

  const hasCompletedProfile = (user: User | null): boolean => {
    if (!user) return false;
    // Check backend first
    if (user.profileCompleted) return true;
    
    // Fallback: Check if profile details exist locally
    const savedProfile = safeStorage.getItem(`user_${user.id}_profile`);
    return !!savedProfile || !!user.gender || !!user.city;
  };

  const getPersistedPage = (): Page => {
    const user = getPersistedUser();
    
    // Auth redirection logic:
    if (user) {
      if (hasCompletedProfile(user)) {
        // Logged in + profile complete -> go Home (or cafe dashboard if owner)
        const userMode = safeStorage.getItem('caffelino_userMode');
        if (userMode === 'partner' || user.role === 'cafe') {
           const myCafeId = safeStorage.getItem('myCafeId');
           return myCafeId ? 'cafe-owner-dashboard' : 'partner-registration';
        }
        return 'home';
      } else {
        // Logged in + profile incomplete -> go Complete Profile
        return 'complete-profile';
      }
    }
    
    // Not logged in -> go Landing
    return 'landing';
  };

  const getPersistedHistory = (): Page[] => {
    // History should match the starting page
    return [getPersistedPage()];
  };
  const getPersistedGroup = (): any => {
    try {
      const saved = safeStorage.getItem('caffelino_selectedGroup');
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return null;
  };
  const getPersistedCafe = (): any => {
    try {
      const saved = safeStorage.getItem('caffelino_selectedCafe');
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return null;
  };
  const getPersistedMode = (): "go" | "partner" | null => {
    try {
      const saved = safeStorage.getItem('caffelino_userMode');
      if (saved === 'go' || saved === 'partner') return saved;
    } catch (e) { /* ignore */ }
    return null;
  };

  const [currentPage, setCurrentPage] =
    useState<Page>(getPersistedPage);
  const [pageHistory, setPageHistory] = useState<Page[]>(getPersistedHistory);
  const [user, setUser] = useState<User | null>(getPersistedUser);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(getPersistedGroup);
  const [selectedCafe, setSelectedCafe] = useState<any>(getPersistedCafe);
  const [unreadNotifications, setUnreadNotifications] =
    useState(0); // Track unread notifications - starts at 0
  const [userMode, setUserMode] = useState<
    "go" | "partner" | null
  >(getPersistedMode);
  const [deepLinkCode, setDeepLinkCode] = useState<
    string | null
  >(null);

  // ─── Persist state to localStorage whenever it changes ────────
  useEffect(() => {
    safeStorage.setItem('caffelino_currentPage', currentPage);
  }, [currentPage]);
  useEffect(() => {
    safeStorage.setItem('caffelino_pageHistory', JSON.stringify(pageHistory));
  }, [pageHistory]);
  useEffect(() => {
    if (user) {
      safeStorage.setItem('caffelino_user', JSON.stringify(user));
    } else {
      safeStorage.removeItem('caffelino_user');
    }
  }, [user]);
  useEffect(() => {
    if (selectedGroup) {
      safeStorage.setItem('caffelino_selectedGroup', JSON.stringify(selectedGroup));
    } else {
      safeStorage.removeItem('caffelino_selectedGroup');
    }
  }, [selectedGroup]);
  useEffect(() => {
    if (selectedCafe) {
      safeStorage.setItem('caffelino_selectedCafe', JSON.stringify(selectedCafe));
    } else {
      safeStorage.removeItem('caffelino_selectedCafe');
    }
  }, [selectedCafe]);
  useEffect(() => {
    if (userMode) {
      safeStorage.setItem('caffelino_userMode', userMode);
    } else {
      safeStorage.removeItem('caffelino_userMode');
    }
  }, [userMode]);

  // Initialize app on first load
  // Track whether we are navigating via browser back button (popstate)
  const isPopStateNav = useRef(false);

  useEffect(() => {
    initializeApp();

    // Disable browser scroll restoration and force scroll to top
    if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Push initial state
    window.history.replaceState({ page: getPersistedPage() }, '');

    // Force scroll to top on initial load
    safeWindow.scrollTo(0, 0);
  }, []);

  // Browser back/forward button handler (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        isPopStateNav.current = true;
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
  }, []);

  // Push browser history on every page change (skip if triggered by popstate)
  useEffect(() => {
    if (isPopStateNav.current) {
      isPopStateNav.current = false;
    } else {
      window.history.pushState({ page: currentPage }, '', '');
    }
    safeWindow.scrollTo(0, 0);
    safeDocument.scrollTop.set(0);
  }, [currentPage]);

  // Swipe-back gesture handler (mobile)
  const swipeHandlers = useSwipeable({
    onSwipedRight: (eventData) => {
      // Only trigger with a strong enough swipe (>100px) to avoid accidental triggers
      if (eventData.deltaX > 100) {
        handleBack();
      }
    },
    preventScrollOnSwipe: false, // Don't interfere with vertical scrolling
    trackMouse: false, // Only touch devices
    delta: 50, // Minimum distance before recognizing a swipe
  });

  // Monitor network connection
  useEffect(() => {
    const handleOnline = () => {
      setLoading(false);
    };

    const handleOffline = () => {
      setLoading(true, "Connection lost. Reconnecting...");
    };

    safeWindow.addEventListener("online", handleOnline);
    safeWindow.addEventListener("offline", handleOffline);

    return () => {
      safeWindow.removeEventListener("online", handleOnline);
      safeWindow.removeEventListener("offline", handleOffline);
    };
  }, [setLoading]);

  // Toggle dark mode
  const toggleDarkMode = (enabled: boolean) => {
    if (enabled) {
      safeDocument.classList.add("documentElement", "dark");
      safeStorage.setItem("cafelino-theme", "dark");
    } else {
      safeDocument.classList.remove("documentElement", "dark");
      safeStorage.setItem("cafelino-theme", "light");
    }
  };

  const handleModeSelection = async (
    mode: "go" | "partner",
  ) => {
    setLoading(true, "Setting up your experience...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUserMode(mode);
    if (mode === "partner") {
      navigateTo("partner-login-choice");
    } else {
      navigateTo("home");
    }
    setLoading(false);
  };

  const handleLogin = async (userData: User) => {
    setLoading(true, "Logging you in...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Load saved profile data from localStorage
    const savedProfile = safeStorage.getItem(`user_${userData.id}_profile`);
    let profileData = {}
    if (savedProfile) {
      try {
        profileData = JSON.parse(savedProfile);
      } catch (e) {
        console.error('Error parsing saved profile:', e);
      }
    }

    // Merge saved profile with user data
    const mergedUser = {
      ...userData,
      ...profileData,
    };
    setUser(mergedUser);

    // Initialize notifications - clear old data and start fresh
    initializeNotifications();
    setUnreadNotifications(getUnreadCount());

    setShowAuthModal(false);

    // ─── ROLE-BASED ROUTING ──────────────────────────────────────────
    // Determine the flow based on userMode selection ('partner' vs 'go')
    // Fallback to userData.role if mode isn't explicitly set yet
    const isPartnerFlow = userMode === "partner" || (userMode === null && userData.role === "cafe");

    if (isPartnerFlow) {
      // ── CAFE OWNER FLOW ──
      try {
        const { getMyCafe } = await import('./services/cafeService');
        const userId = userData.id;
        const cafeResult = await getMyCafe(userId);

        if (cafeResult && cafeResult.cafe) {
          const cafe = cafeResult.cafe;
          // Save cafe info for later use
          safeStorage.setItem('pendingCafeName', cafe.cafeName || '');
          safeStorage.setItem('myCafeId', cafe.id);
          safeStorage.setItem('myCafeOwnerId', userId);

          if (cafe.status === true) {
            // Cafe is verified — go to dashboard
            console.log('✅ Cafe is verified, going to dashboard');
            navigateTo("cafe-owner-dashboard", {
              cafeName: cafe.cafeName,
              email: userData.email,
              isCafeOwner: true,
              cafeId: cafe.id || cafe._id,
              userId: userData.id,
              id: userData.id
            });
          } else {
            // Cafe exists but not verified — show pending page
            console.log('⏳ Cafe is pending verification');
            navigateTo("cafe-verification-pending");
          }
        } else {
          // No cafe found — show partner registration
          navigateTo("partner-registration");
        }
      } catch (error) {
        console.error('Error checking cafe status:', error);
        navigateTo("partner-registration");
      }
    } else {
      // ── REGULAR USER FLOW ──
      try {
        // Skip cafe check entirely, go straight to session restore or profile completion
        const { getActiveSession } = await import('./utils/sessionManager');
        const activeSession = getActiveSession(userData.id);

        if (activeSession) {
          console.log('Resuming from active session:', activeSession);
          navigateTo(activeSession.lastNavigationPage as Page, activeSession.navigationData);
        } else {
          if (hasCompletedProfile(mergedUser)) {
             navigateTo("home");
          } else {
             navigateTo("complete-profile");
          }
        }
      } catch (error) {
        console.error('Session restoration error:', error);
        if (hasCompletedProfile(mergedUser)) {
           navigateTo("home");
        } else {
           navigateTo("complete-profile");
        }
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true, "Logging out...");
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Check if user is a partner/cafe owner
    const isPartner = userMode === "partner";

    // Clear user data
    setUser(null);
    setSelectedGroup(null);
    setSelectedCafe(null);

    // Clear persisted state
    safeStorage.removeItem('caffelino_currentPage');
    safeStorage.removeItem('caffelino_pageHistory');
    safeStorage.removeItem('caffelino_user');
    safeStorage.removeItem('caffelino_selectedGroup');
    safeStorage.removeItem('caffelino_selectedCafe');
    safeStorage.removeItem('caffelino_userMode');

    // Redirect based on user type
    if (isPartner) {
      // Cafe owners go back to partner login/registration page
      navigateTo("partner-login-choice");
    } else {
      // Regular users go to home page
      navigateTo("home");
    }

    setLoading(false);
  };

  const navigateTo = async (page: Page, data?: any) => {
    // Show loading for page transitions
    setLoading(true, "Loading...");
    await new Promise((resolve) => setTimeout(resolve, 600));

    // AUTO-SAVE SESSION: Save navigation state for resume
    if (user && data?.groupId) {
      const { saveActiveSession, getSessionStepFromPage } = await import('./utils/sessionManager');
      const currentStep = getSessionStepFromPage(page);
      saveActiveSession(user.id, data.groupId, currentStep, page, data);
    }

    if (page === "group-detail" && data) {
      setSelectedGroup(data);
    }
    if (page === "group-interaction" && data) {
      setSelectedGroup(data);
    }
    if (page === "group-home" && data) {
      setSelectedGroup(data);
    }
    if (page === "voting-complete" && data) {
      setSelectedGroup(data);
    }
    if (page === "invite-members" && data) {
      setSelectedGroup(data);
    }
    if (page === "cafe-voting" && data) {
      setSelectedGroup(data);
    }
    if (page === "create-meetup-step2" && data) {
      setSelectedGroup(data);
    }
    if (page === "meetup-code" && data) {
      setSelectedGroup(data);
    }
    if (page === "create-meetup-step3" && data) {
      setSelectedGroup(data);
    }
    if (page === "cafe-selection-create" && data) {
      setSelectedGroup(data);
    }
    if (page === "cafe-voting-create" && data) {
      setSelectedGroup(data);
    }
    if (page === "create-meetup-step5" && data) {
      setSelectedGroup(data);
    }
    if (page === "meetup-chat" && data) {
      setSelectedGroup(data);
    }
    if (page === "cafe-selection-admin" && data) {
      setSelectedGroup(data);
    }
    if (page === "meetup-voting" && data) {
      setSelectedGroup(data);
    }
    if (page === "voting-result" && data) {
      setSelectedGroup(data);
    }
    if (page === "meetup-group-page" && data) {
      setSelectedGroup(data);
    }
    if (page === "join-with-code-cafe-view" && data) {
      setSelectedGroup(data);
    }
    if (page === "join-request-waiting" && data) {
      setSelectedGroup(data);
    }
    if (page === "bill-split-confirmation" && data) {
      setSelectedGroup(data);
    }
    if (page === "member-payment-screen" && data) {
      setSelectedGroup(data);
    }
    if (page === "payment-status-dashboard" && data) {
      setSelectedGroup(data);
    }
    if (page === "payment-completion" && data) {
      setSelectedGroup(data);
    }
    if (page === "digital-receipt" && data) {
      setSelectedGroup(data);
    }
    if (page === "menu-selection" && data) {
      setSelectedGroup(data);
    }
    if (page === "order-summary" && data) {
      setSelectedGroup(data);
    }
    if (page === "order-based-billing" && data) {
      setSelectedGroup(data);
    }
    if (page === "restaurant-bill-scan" && data) {
      setSelectedGroup(data);
    }
    if (page === "bill-approval-admin" && data) {
      setSelectedGroup(data);
    }
    if (page === "cafe-menu" && data) {
      setSelectedCafe(data);
    }
    if (page === "cafe-owner-dashboard" && data) {
      // Update user with cafe owner data
      setUser((prevUser) => ({
        ...prevUser,
        cafeName: data.cafeName,
        email: data.email,
        isCafeOwner: data.isCafeOwner,
      }));
    }
    if (page === "group-chat" && data) {
      setSelectedGroup(data);
    }
    if (page === "meetup-flow-controller" && data) {
      setSelectedGroup(data);
    }
    if (page === "meetup-dashboard" && data) {
      setSelectedGroup(data);
    }
    if (page === "cafe-selection-page" && data) {
      setSelectedGroup(data);
    }
    if (page === "cafe-voting-page" && data) {
      setSelectedGroup(data);
    }
    if (page === "meetup-chat-billing" && data) {
      setSelectedGroup(data);
    }
    if (page === "meetup-chat-billing-completed" && data) {
      setSelectedGroup(data);
    }
    if (page === "payment-online" && data) {
      setSelectedGroup(data);
    }
    if (page === "join-voting" && data) {
      setSelectedGroup(data);
    }
    if (page === "join-meetup" && data) {
      setSelectedGroup(data);
    }
    if (page === "cafe-details" && data) {
      if (data.dbCafe) {
        // DB cafe - store the full object directly
        setSelectedCafe(data.dbCafe);
      } else {
        // Hardcoded cafe - look up by ID
        const cafe = getCafeById(data.cafeId);
        setSelectedCafe(cafe);
      }
    }
    if (page === "all-cafes") {
      // No data needed for all cafes page
    }
    setCurrentPage(page);
    setPageHistory((prev) => [...prev, page]);
    setLoading(false);
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
    } else {
      // If no history, go to home
      navigateTo("home");
    }
  };

  const handleCompleteProfile = async (profileData: any) => {
    setLoading(true, "Saving your profile...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (user) {
      // Merge profile data with existing user data
      const updatedUser = {
        ...user,
        ...profileData,
        name:
          profileData.firstName +
          (profileData.lastName
            ? " " + profileData.lastName
            : ""),
        firstName: profileData.firstName,
        age: parseInt(profileData.age),
        gender: profileData.gender,
        city: profileData.city,
        interests: profileData.hobbies || [],
        photo: profileData.profilePhoto || user.photo,
        avatarId: profileData.avatarId || '', // Save the selected avatar ID
        mobileNumber: profileData.mobileNumber, // Save mobile number
      };

      // Save to backend via the new API endpoint
      try {
        const response = await fetch(`http://localhost:5000/api/user/profile/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            gender: profileData.gender,
            city: profileData.city,
            age: profileData.age,
            mobileNumber: profileData.mobileNumber,
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          // Update profileCompleted flag from server
          if (result.user && result.user.profileCompleted) {
            updatedUser.profileCompleted = true;
          }
        }
      } catch (error) {
        console.error("Error saving profile to backend:", error);
      }

      // Save to state
      setUser(updatedUser);

      // Save to localStorage for persistence
      safeStorage.setItem(`user_${user.id}_profile`, JSON.stringify({
        firstName: profileData.firstName,
        name: updatedUser.name,
        email: updatedUser.email, // Persist email
        gender: profileData.gender,
        age: profileData.age,
        avatarId: profileData.avatarId || '', // Persist avatar ID
        mobileNumber: profileData.mobileNumber, // Persist mobile number
      }));
    }
    await navigateTo("home");
    setLoading(false);
  };

  // Function to update notification count
  const updateNotificationCount = () => {
    const count = getUnreadCount();
    setUnreadNotifications(count);
    console.log('📩 Notification count updated:', count);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage onSelectMode={handleModeSelection} />
        );
      case "home":
        return (
          <HomePage
            user={user}
            onNavigate={navigateTo}
            onShowAuth={() => setShowAuthModal(true)}
          />
        );
      case "complete-profile":
        return (
          <CompleteProfile
            user={user}
            onComplete={handleCompleteProfile}
          />
        );
      case "onboarding":
        return (
          <OnboardingPreferences
            user={user}
            onComplete={() => setCurrentPage("home")}
          />
        );
      case "profile":
        return (
          <UserProfile
            user={user}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            onUpdateUser={(updatedUser) => setUser(updatedUser)}
          />
        );
      case "group-detail":
        return (
          <GroupDetailPage
            user={user}
            group={selectedGroup}
            onNavigate={navigateTo}
          />
        );
      case "cafe-menu":
        return (
          <CafeMenu
            cafe={selectedCafe}
            onNavigate={navigateTo}
          />
        );
      case "payment":
        return <PaymentPage onNavigate={navigateTo} />;
      case "admin":
        return <AdminDashboard onNavigate={navigateTo} />;
      case "find-groups":
        return (
          <FindGroups
            user={user}
            onNavigate={navigateTo}
            onShowAuth={() => setShowAuthModal(true)}
            onBack={handleBack}
          />
        );
      case "notifications":
        return (
          <Notifications user={user} onNavigate={navigateTo} onBack={() => navigateTo('home')} />
        );
      case "partner-registration":
        return <PartnerRegistration onNavigate={navigateTo} />;
      case "partner-login-choice":
        return <PartnerLoginChoice onNavigate={navigateTo} />;
      case "cafe-owner-google-login":
        return <CafeOwnerGoogleLogin onNavigate={navigateTo} />;
      case "settings":
        return (
          <Settings
            user={user}
            onNavigate={navigateTo}
            onUpdateUser={setUser}
            onLogout={handleLogout}
          />
        );
      case "report-problem":
        return (
          <ReportProblem onNavigate={navigateTo} user={user} />
        );
      case "join-group":
        return (
          <JoinGroup user={user} onNavigate={navigateTo} />
        );
      case "cafe-owner-dashboard":
        return (
          <CafeOwnerDashboard
            user={user}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      case "cafe-verification-pending":
        return (
          <CafeVerificationPending onNavigate={navigateTo} />
        );
      case "about-us":
        return <AboutUs onNavigate={navigateTo} />;
      case "how-it-works":
        return <HowItWorks onNavigate={navigateTo} />;
      case "safety-guidelines":
        return <SafetyGuidelines onNavigate={navigateTo} />;
      case "admin-details":
        return (
          <AdminDetails
            user={user}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case "meetup-code":
        return (
          <MeetupCode
            user={user}
            meetupData={selectedGroup}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case "create-meetup-step3":
      case "cafe-selection-create":
        return (
          <CafeSelectionCreate
            user={user}
            meetupData={selectedGroup}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case "cafe-voting-create":
        return (
          <CafeVotingCreate
            user={user}
            meetupData={selectedGroup}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case "create-meetup-step5":
        return (
          <CafeVotingCreate
            user={user}
            meetupData={selectedGroup}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case "meetup-chat-billing":
        return (
          <MeetupChatBilling
            user={user}
            meetupData={selectedGroup}
            onNavigate={navigateTo}
            onBack={handleBack}
            onNotificationUpdate={updateNotificationCount}
          />
        );
      case "meetup-chat-billing-completed":
        return (
          <MeetupChatBilling
            user={user}
            meetupData={selectedGroup}
            onNavigate={navigateTo}
            onBack={handleBack}
            onNotificationUpdate={updateNotificationCount}
          />
        );
      case "payment-online":
        return (
          <PaymentOnline
            user={user}
            meetupData={selectedGroup}
            onNavigate={navigateTo}
            onBack={handleBack}
            onNotificationUpdate={updateNotificationCount}
          />
        );
      case "join-meetup":
        return (
          <JoinMeetup
            user={user}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case "join-voting":
        return (
          <JoinVoting
            user={user}
            meetupData={selectedGroup}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case "cafe-details":
        return (
          <CafeDetailsPage
            cafe={selectedCafe}
            user={user}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case "all-cafes":
        return (
          <AllCafesPage
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      default:
        // For unknown routes, redirect to home
        if (currentPage !== 'landing' && currentPage !== 'home') {
          setTimeout(() => navigateTo('home'), 0);
        }
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" {...swipeHandlers}>
      {/* Header */}
      {currentPage !== "admin" &&
        currentPage !== "landing" &&
        currentPage !== "partner-registration" &&
        currentPage !== "partner-login-choice" &&
        currentPage !== "cafe-owner-google-login" &&
        currentPage !== "complete-profile" &&
        currentPage !== "cafe-owner-dashboard" &&
        currentPage !== "cafe-verification-pending" &&
        currentPage !== "group-home" &&
        currentPage !== "voting-complete" &&
        currentPage !== "admin-details" &&
        currentPage !== "meetup-code" &&
        currentPage !== "create-meetup-step3" &&
        currentPage !== "cafe-selection-create" &&
        currentPage !== "cafe-voting-create" &&
        currentPage !== "meetup-chat-billing" &&
        currentPage !== "meetup-chat-billing-completed" &&
        currentPage !== "payment-online" &&
        currentPage !== "join-meetup" &&
        currentPage !== "join-voting" &&
        currentPage !== "meetup-group-page" && ( // Add this condition
          <header className="fixed top-0 left-0 right-0 h-14 bg-[#be9d80] border-b border-[#a88968] z-50 shadow-sm">
            <div className="max-w-7xl mx-auto h-full px-3 md:px-4 flex items-center justify-between">
              {/* Left Section - Logo */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Logo */}
                <div
                  className="cursor-pointer"
                  onClick={() => navigateTo("landing")}
                >
                  <img
                    src={imgCaffelinoLogo}
                    alt="Caffélino"
                    className="h-[128px] md:h-[160px] w-auto object-contain"
                  />
                </div>
              </div>

              {/* Right Section - User Name, Notifications and Login */}
              <div className="flex items-center gap-3 relative h-9">
                {user ? (
                  <>
                    {/* User Name - Positioned near notification bell */}
                    <div className="flex items-center">
                      <p className="text-black text-[16px] md:text-[18px] font-['Arial:Bold',_sans-serif] font-bold tracking-wide">
                        {user.firstName || user.name}
                      </p>
                    </div>

                    <div className="relative h-9 w-[84px]">
                      {/* Bell Button - Position: left 0 */}
                      <button
                        className="absolute left-0 top-0 p-2 rounded-full hover:bg-[#a88968] transition-colors w-9 h-9 flex items-center justify-center"
                        aria-label="Notifications"
                        onClick={() => navigateTo("notifications")}
                      >
                        <Bell className="w-5 h-5 text-white" />
                        {unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                            {unreadNotifications}
                          </span>
                        )}
                      </button>

                      {/* Avatar Button - Position: left 48px */}
                      <button
                        onClick={() => navigateTo("profile")}
                        aria-label="Profile"
                        className="absolute left-12 top-0 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] border-[1.6px] border-white/60 hover:opacity-80 transition-opacity"
                      >
                        {user.avatarId && (user.gender === 'male' || user.gender === 'female') ? (
                          <span className="text-2xl">
                            {getAvatarById(user.avatarId)?.emoji}
                          </span>
                        ) : (
                          <span className="text-lg text-[#8b5943]">
                            {user.firstName?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Bell Button for non-logged in users */}
                    <button
                      className="p-2 rounded-full hover:bg-[#a88968] transition-colors"
                      aria-label="Notifications"
                      onClick={() => setShowAuthModal(true)}
                    >
                      <Bell className="w-5 h-5 text-white" />
                    </button>
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      className="bg-white text-slate-900 hover:bg-slate-100 rounded-md px-3 md:px-6 text-sm"
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>
        )}

      {/* Main Content */}
      <main
        className={
          currentPage !== "admin" &&
            currentPage !== "landing" &&
            currentPage !== "partner-registration" &&
            currentPage !== "partner-login-choice" &&
            currentPage !== "cafe-owner-google-login" &&
            currentPage !== "complete-profile" &&
            currentPage !== "cafe-owner-dashboard" &&
            currentPage !== "cafe-verification-pending" &&
            currentPage !== "group-home" &&
            currentPage !== "voting-complete" &&
            currentPage !== "admin-details" &&
            currentPage !== "meetup-code" &&
            currentPage !== "create-meetup-step3" &&
            currentPage !== "cafe-selection-create" &&
            currentPage !== "cafe-voting-create" &&
            currentPage !== "meetup-chat-billing" &&
            currentPage !== "meetup-chat-billing-completed" &&
            currentPage !== "payment-online" &&
            currentPage !== "join-meetup" &&
            currentPage !== "join-voting" &&
            currentPage !== "meetup-group-page"
            ? "pt-14"
            : ""
        }
      >
        {renderPage()}
      </main>

      {/* Bottom Navigation Bar - Show when user is not logged in */}
      {!user &&
        currentPage !== "landing" &&
        currentPage !== "partner-registration" &&
        currentPage !== "partner-login-choice" &&
        currentPage !== "cafe-owner-google-login" &&
        currentPage !== "cafe-verification-pending" &&
        currentPage !== "admin" && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-slate-600">
                  Join Caffélino to create and join groups
                </p>
              </div>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="ml-4"
              >
                Login / Sign Up
              </Button>
              {/* Cartoon Profile Avatar */}
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

      {/* Auth Modal */}
      {showAuthModal && (
        <LoginSignup
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}

      <Toaster />

      {/* Coffee Loading Screen */}
      <AnimatePresence>
        {isLoading && <CoffeeLoader message={loadingMessage} />}
      </AnimatePresence>
    </div>
  );
}

// Export the main App component
export default function App() {
  return <AppContent />;
}