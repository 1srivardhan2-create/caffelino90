import { useState, useEffect, useRef } from 'react';
import { Users, Calendar, Receipt, Coffee, Sparkles, MapPin, Store, BadgeCheck, Loader2, ArrowRight, DollarSign } from 'lucide-react';
import { getApprovedCafes } from '../services/cafeService';
import { getActiveMeetups, getMyMeetups } from '../services/meetupService';
import { Badge } from './ui/badge';
import Footer from './Footer';
import MyGroupCard from './MyGroupCard';
import { getUserGroups, clearOldTestGroups, removeGroup, removeAllUserGroups, saveGroupState, getNavigationPageFromStage, GroupState } from '../utils/groupStateManager';
import { getActiveGroupId } from '../utils/sessionManager';
import { BASE_URL } from '../utils/api';


interface HomePageProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onShowAuth: () => void;
}

export default function HomePage({ user, onNavigate, onShowAuth }: HomePageProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [approvedCafes, setApprovedCafes] = useState<any[]>([]);
  const [totalCafes, setTotalCafes] = useState<number>(0);
  const [cafesLoading, setCafesLoading] = useState(true);
  const [showWakeup, setShowWakeup] = useState(false);
  const [myMeetups, setMyMeetups] = useState<GroupState[]>([]);

  // Fetch approved cafes and active meetups from backend
  useEffect(() => {
    let wakeTimer: NodeJS.Timeout;
    if (cafesLoading) {
      wakeTimer = setTimeout(() => setShowWakeup(true), 3000);
    } else {
      setShowWakeup(false);
    }
    return () => clearTimeout(wakeTimer);
  }, [cafesLoading]);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchInitialData = async () => {
      setCafesLoading(true);
      try {
        // Parallel fetch for speed
        const [cafesResult, meetupsResult] = await Promise.all([
          getApprovedCafes(4),
          user ? getMyMeetups(user.id) : Promise.resolve({ success: false, meetups: [] })
        ]);

        if (cafesResult.success && cafesResult.cafes) {
          setApprovedCafes(cafesResult.cafes);
          setTotalCafes(cafesResult.totalCount || cafesResult.cafes.length);
        }

        // Sync backend meetups with local state
        if (meetupsResult.success && meetupsResult.meetups && user) {
          // IMPORTANT: Clear ALL old localStorage groups for this user FIRST
          // This prevents stale/deleted meetups from reappearing
          removeAllUserGroups(user.id);

          const freshGroups: GroupState[] = [];
          meetupsResult.meetups.forEach((m: any) => {
            const memberInfo = m.members.find((mem: any) => mem.userId === user.id);
            if (!memberInfo) return; // Strictest check: only if user is member

            // Map backend status to frontend stage
            let stage: any = 'chat';
            let status: any = 'Active';

            if (m.status === 'voting') {
              stage = 'voting';
              status = 'Voting';
            } else if (m.status === 'ordering') {
              stage = 'menu-selection';
              status = 'Ordering';
            }

            const navigationPage = getNavigationPageFromStage(stage);

            const groupState: GroupState = {
              groupId: m._id,
              groupName: m.title || m.meetupName || "Unnamed Meetup",
              groupCode: m.meetupCode,
              currentStage: stage,
              status: status,
              userRole: (memberInfo.role === 'admin' || m.organizerId === user.id) ? 'creator' : 'member',
              isApproved: memberInfo.isApproved !== undefined ? memberInfo.isApproved : true,
              lastActive: new Date().toISOString(),
              cafeName: m.selectedCafe?.cafeName || m.selectedCafe?.name || "",
              cafeImage: m.selectedCafe?.cafeImage || "",
              lastNavigationPage: navigationPage,
              navigationData: {
                meetupId: m._id,
                meetupName: m.title || m.meetupName,
                cafeName: m.selectedCafe?.cafeName || m.selectedCafe?.name,
                selectedCafe: m.selectedCafe,
                isAdmin: (memberInfo.role === 'admin' || m.organizerId === user.id),
                groupCode: m.meetupCode,
              }
            };
            
            freshGroups.push(groupState);
            saveGroupState(user.id, groupState);
          });
          setMyMeetups(freshGroups);
          setRefreshKey((k: number) => k + 1);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setCafesLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  // Get active group ID for this user
  const activeGroupId = user ? getActiveGroupId(user.id) : null;

  // Use myMeetups instead of all local storage groups
  const allUserGroups = myMeetups;

  // SINGLE ACTIVE GROUP RULE: Show only the active group, or all groups if no active session
  const userGroups = activeGroupId
    ? allUserGroups.filter((g: GroupState) => g.groupId === activeGroupId)
    : allUserGroups;

  // STRICT FILTERING: Created groups = ONLY where userRole === 'creator'
  const createdGroups = userGroups.filter((g: GroupState) => g.userRole === 'creator');

  // STRICT FILTERING: Joined groups = ONLY where userRole === 'member' AND isApproved
  const joinedGroups = userGroups.filter((g: GroupState) => g.userRole === 'member' && g.isApproved);

  const handleResumeGroup = (group: any) => {
    // If we have full navigation data saved, use it. Otherwise fallback to basic.
    let data = group.navigationData;
    
    if (!data) {
      data = {
        _id: group.groupId, // Critical for API calls
        meetupId: group.groupId,
        meetupName: group.groupName,
        title: group.groupName,
        cafeName: group.cafeName,
        isAdmin: group.userRole === 'creator',
        joinCode: group.groupCode,
        meetupCode: group.groupCode,
        members: [], // Initialize as empty array to avoid crashes
        date: group.meetupDate || '',
        time: group.meetupTime || '',
        organizerName: group.userRole === 'creator' ? (user?.firstName || user?.name) : 'Admin',
      };
    } else {
      // Ensure _id is present even in existing navigationData if it was missing
      if (!data._id && group.groupId) data._id = group.groupId;
      if (!data.joinCode && group.groupCode) data.joinCode = group.groupCode;
      if (!data.members) data.members = [];
    }
    
    onNavigate('meetup-chat-billing', data);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to remove this meetup?")) {
      if (user && user.id) {
        // Optimistic UI update
        const previousMeetups = [...myMeetups];
        
        removeGroup(user.id, groupId);
        setMyMeetups((prev: GroupState[]) => prev.filter((g: GroupState) => g.groupId !== groupId));
        setRefreshKey((k: number) => k + 1);

        // Backend delete/leave
        import('../services/meetupService').then(async ({ leaveMeetup }) => {
          const result = await leaveMeetup(groupId, user.id);
          if (!result.success) {
            console.error("Failed to leave meetup on backend", result.error);
            // Revert on failure
            saveGroupState(user.id, previousMeetups.find(g => g.groupId === groupId) as GroupState);
            setMyMeetups(previousMeetups);
            setRefreshKey((k: number) => k + 1);
            alert("Failed to remove meetup. Please try again.");
          }
        });
      }
    }
  };

  return (
    <div className="bg-[#fffbf5] box-border flex flex-col pb-0 pt-[0.8px] px-0 relative w-full overflow-x-hidden" data-name="Caffélino App">
      {/* Main Content */}
      <div className="relative w-full" data-name="HomePage">
        {/* Hero Section - Legendary Brown Gradient */}
        <div className="relative box-border content-stretch flex flex-col h-auto md:h-[420px] items-start justify-center pb-[40px] md:pb-[80px] pt-[40px] md:pt-[80px] px-3 md:px-[24px] w-full" data-name="Section" style={{ background: "linear-gradient(70.915deg, rgb(139, 89, 67) 2.259%, rgb(217, 191, 157) 50.958%, rgb(139, 89, 67) 99.733%)" }}>
          <div className="w-full max-w-[1400px] mx-auto content-stretch flex flex-col gap-[16px] md:gap-[24px] items-center mb-8 md:mb-0 px-4" data-name="Container">
            <div className="h-auto relative shrink-0 w-full" data-name="Heading 1">
              <p className="font-['Advent_Pro:Regular',_sans-serif] font-normal leading-[36px] md:leading-[60px] text-[26px] md:text-[48px] text-center text-[#4a2c1a] w-full px-2" style={{ fontVariationSettings: "'wdth' 100" }}>
                Plan Meetups with Friends & Family
              </p>
            </div>
            <div className="h-auto relative shrink-0 w-full" data-name="Paragraph">
              <p className="font-['Archivo_Narrow:Regular',_sans-serif] font-normal leading-[24px] md:leading-[28px] text-[16px] md:text-[20px] text-center text-[#4a2c1a] w-full px-2">Create Groups. Split Bills. Enjoy Together.</p>
            </div>
            <div className="content-stretch flex flex-col md:flex-row gap-[10px] md:gap-[16px] items-center justify-center w-full mt-[8px]" data-name="Container">
              <button
                className="bg-[#0a0a0a] h-[52px] md:h-[56px] rounded-[16px] px-8 md:px-10 cursor-pointer hover:bg-[#1a1a1a] transition-all shadow-md hover:shadow-xl w-full md:w-auto font-bold text-[15px] md:text-[16px] text-white hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={() => user ? onNavigate('admin-details') : onShowAuth()}
              >
                <Sparkles className="w-5 h-5" />
                Create Meetup
              </button>
              <button
                className="bg-[#0a0a0a] border-2 border-[#be9d80] h-[52px] md:h-[56px] rounded-[16px] px-8 md:px-10 cursor-pointer hover:bg-[#1a1a1a] transition-all shadow-sm w-full md:w-auto font-bold text-[15px] md:text-[16px] text-white hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={() => user ? onNavigate('join-meetup') : onShowAuth()}
              >
                <Users className="w-5 h-5" />
                Join Meetup
              </button>
            </div>
          </div>
        </div>

        {/* Your Meetups Section - Show active group if exists, otherwise show all */}
        {user && allUserGroups.length > 0 && (
          <div className="max-w-[1400px] mx-auto w-full bg-[#be9d80] border-y border-[#a88a6f]">
            <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[32px] pt-[32px] px-3 md:px-[24px] w-full" data-name="Section">
              <div className="w-full">
                <div className="content-stretch flex flex-col gap-2 h-auto items-start w-full px-1 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#8b5943] flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[32px] md:leading-[40px] text-[22px] md:text-[28px] text-neutral-950">
                      Your Meetups
                    </p>
                  </div>
                  <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-neutral-600">
                    {activeGroupId ? "Active Session" : "All your active groups"}
                  </p>
                </div>

                <div className="w-full px-1 space-y-3">
                  {userGroups.map((group) => (
                    <MyGroupCard
                      key={group.groupId}
                      group={group}
                      onClick={() => handleResumeGroup(group)}
                      onDelete={handleDeleteGroup}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State - No Meetups */}
        {user && allUserGroups.length === 0 && (
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="box-border content-stretch flex flex-col gap-[16px] items-center pb-[32px] pt-[32px] px-3 md:px-[24px] w-full" data-name="Section">
              <div className="w-full max-w-2xl mx-auto bg-slate-50 rounded-[16px] p-8 text-center border-2 border-dashed border-slate-300">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[18px] text-neutral-950 mb-2">
                  No meetups joined yet
                </p>
                <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-neutral-600">
                  You haven't joined or created any meetups yet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Approved Cafes Section ═══ */}
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[32px] pt-[32px] px-3 md:px-[24px] w-full" data-name="CafesSection">
            <div className="w-full">
              <div className="flex items-center justify-between w-full px-1 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5943] to-[#be9d80] flex items-center justify-center shadow-md">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[28px] text-[22px] md:text-[28px] text-neutral-950">
                      Popular Cafes Near You
                    </p>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[18px] text-[13px] text-neutral-500">
                      {cafesLoading ? 'Loading...' : `${totalCafes} verified partner${totalCafes !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('all-cafes')}
                  className="flex items-center gap-1 text-[#8b5943] text-[14px] font-medium hover:text-[#6b4423] transition-colors"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Loading state */}
              {cafesLoading && (
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse bg-white rounded-[16px] shadow-sm border border-gray-100 p-4">
                        <div className="bg-gray-200 h-[170px] rounded-[12px] mb-3"></div>
                        <div className="bg-gray-200 h-5 w-3/4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                      </div>
                    ))}
                  </div>
                  {showWakeup && (
                    <p className="text-center text-orange-500 font-medium mt-6 animate-pulse">
                      Server is waking up, please wait...
                    </p>
                  )}
                </div>
              )}

              {/* No cafes yet */}
              {!cafesLoading && approvedCafes.length === 0 && (
                <div className="text-center py-10 bg-[#f9f5f0] rounded-[16px] border-2 border-dashed border-[#be9d80]/40">
                  <Coffee className="w-10 h-10 text-[#be9d80] mx-auto mb-3" />
                  <p className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-700 mb-1">No verified cafes yet</p>
                  <p className="font-['Arial:Regular',_sans-serif] text-[13px] text-neutral-500">Partner cafes will appear here once approved</p>
                </div>
              )}

              {/* Cafe Cards */}
              {!cafesLoading && approvedCafes.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1">
                    {approvedCafes.slice(0, 4).map((cafe: any, idx: number) => {
                    const resolveImg = (imgStr: any) => {
                      if (!imgStr) return null;
                      if (typeof imgStr !== 'string') return null;
                      if (imgStr.startsWith('/uploads/')) return `${BASE_URL}${imgStr}`;
                      return imgStr; // Handles data: image/... and http://... natively
                    };

                    // Check multiple possible field names for photos
                    const photos = cafe.Cafe_photos || cafe.cafePhotos || cafe.gallery || [];
                    const heroImage = (photos.length > 0 ? resolveImg(photos[0]) : null) || 
                      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800';
                    
                    // Check multiple possible field names for profile picture
                    const profileSrc = resolveImg(cafe.profilePicture || (cafe.manager && (cafe.manager.profilePic || cafe.manager.profilePicture)));

                    return (
                      <div
                        key={cafe._id || idx}
                        onClick={() => onNavigate('cafe-details', { dbCafe: cafe })}
                        className="bg-white rounded-[16px] shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 hover:scale-[1.03] active:scale-[0.98] group"
                      >
                        {/* Image */}
                        <div className="relative h-[200px] bg-[#fdfaf7] flex items-center justify-center overflow-hidden rounded-t-[14px]">
                          <img
                            src={heroImage}
                            alt={cafe.Name}
                            loading="lazy"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                            onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'; }}
                          />
                          <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1 z-10">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            Verified
                          </div>
                          
                          {/* Manager Profile Picture Badge */}
                          {profileSrc && (
                             <div className="absolute bottom-[-15px] right-4 w-[50px] h-[50px] rounded-full border-4 border-white shadow-md overflow-hidden bg-white z-20">
                               <img src={profileSrc} alt="Manager" className="w-full h-full object-cover" />
                             </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Store className="w-5 h-5 text-[#8b5943] flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-['Arial:Bold',sans-serif] text-[17px] text-[#0a0a0a] line-clamp-1">
                                {cafe.Name || 'Unnamed Cafe'}
                              </h3>
                              <span className="inline-block px-2 py-0.5 bg-[#8b5943]/10 text-[#8b5943] text-[11px] rounded-full font-medium mt-0.5">
                                {cafe.establishmentType || 'Cafe'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-gray-500 mb-1.5">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#be9d80]" />
                            <span className="text-[12px] line-clamp-1">{cafe.Cafe_Address || cafe.cafe_location || 'Location not set'}</span>
                          </div>

                          {cafe.Average_Cost && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <DollarSign className="w-3.5 h-3.5 flex-shrink-0 text-[#be9d80]" />
                              <span className="text-[12px] font-medium">₹{cafe.Average_Cost} for one</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                  
                  {totalCafes > 4 && (
                    <div className="flex justify-center mt-8 w-full">
                      <button
                        onClick={() => onNavigate('all-cafes')}
                        className="bg-[#fcf9f5] hover:bg-[#f5ebd9] border-2 border-[#e8d5c4] text-[#8b5943] font-bold py-3 px-8 rounded-[12px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                      >
                        View all {totalCafes} cafes
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="box-border content-stretch flex flex-col gap-[24px] md:gap-[32px] items-start pb-[48px] md:pb-[64px] pt-[32px] md:pt-[48px] px-3 md:px-[24px] w-full" data-name="Section">
            <div className="content-stretch flex h-auto items-start w-full px-1" data-name="Heading 2">
              <p className="font-['Arial:Regular',_sans-serif] leading-[32px] md:leading-[40px] not-italic text-[24px] md:text-[32px] text-neutral-950 text-center w-full">How It Works</p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-1">
              {/* Step 1 */}
              <div className="box-border content-stretch flex flex-col gap-[16px] items-center p-6 rounded-[16px] bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20">
                <div className="w-16 h-16 rounded-full bg-[#8b5943] flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[18px] text-neutral-950 mb-2">1. Sign Up & Create Profile</p>
                  <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-neutral-600">Join Caffélino and set up your personal profile</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="box-border content-stretch flex flex-col gap-[16px] items-center p-6 rounded-[16px] bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20">
                <div className="w-16 h-16 rounded-full bg-[#8b5943] flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[18px] text-neutral-950 mb-2">2. Create Group</p>
                  <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-neutral-600">Invite friends or family to your meetup</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="box-border content-stretch flex flex-col gap-[16px] items-center p-6 rounded-[16px] bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20">
                <div className="w-16 h-16 rounded-full bg-[#8b5943] flex items-center justify-center">
                  <Receipt className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[18px] text-neutral-950 mb-2">3. Split Bills Easily</p>
                  <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-neutral-600">Order together and split the bill equally</p>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Features Section */}
        <div className="max-w-[1400px] mx-auto w-full" style={{ background: "linear-gradient(159.042deg, rgb(139, 89, 67) 0%, rgb(217, 191, 157) 49.038%, rgba(139, 89, 67, 0.98) 95.673%)" }}>
          <div className="box-border content-stretch flex flex-col gap-[24px] md:gap-[32px] items-start pb-[48px] md:pb-[64px] pt-[48px] md:pt-[64px] px-3 md:px-[24px] w-full" data-name="Section">
            <div className="content-stretch flex h-auto items-start w-full px-1" data-name="Heading 2">
              <p className="font-['Arial:Regular',_sans-serif] leading-[32px] md:leading-[40px] not-italic text-[24px] md:text-[32px] text-[#0a0a0a] text-center w-full">Perfect for Gatherings</p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
              {/* Feature 1 - Friends & Family */}
              <div className="bg-white rounded-[16px] p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(139,89,67,0.2)] flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#8b5943]" />
                  </div>
                  <div>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[18px] text-[#0a0a0a] mb-2">Friends & Family</p>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-[#525252]">Create groups with people you know</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Vote on Café */}
              <div className="bg-white rounded-[16px] p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(139,89,67,0.2)] flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-6 h-6 text-[#8b5943]" />
                  </div>
                  <div>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[18px] text-[#0a0a0a] mb-2">Vote on Café Together</p>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-[#525252]">Choose from up to 3 cafés and let everyone vote on their favorite spot.</p>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Bill Splitting */}
              <div className="bg-white rounded-[16px] p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(139,89,67,0.2)] flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-6 h-6 text-[#8b5943]" />
                  </div>
                  <div>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[18px] text-[#0a0a0a] mb-2">Equal Bill Splitting</p>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-[#525252]">Bills are automatically split equally among all group members.</p>
                  </div>
                </div>
              </div>

              {/* Feature 4 - Group Chat */}
              <div className="bg-white rounded-[16px] p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(139,89,67,0.2)] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-[#8b5943]" />
                  </div>
                  <div>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[18px] text-[#0a0a0a] mb-2">Group Chat & Menu</p>
                    <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-[#525252]">Chat with your group and share food orders with images in real-time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Owner Demo Section */}
        <div className="max-w-[1400px] mx-auto w-full border-t border-neutral-200">
          <div className="box-border content-stretch flex flex-col gap-[16px] items-center pb-[32px] pt-[32px] px-3 md:px-[24px] w-full text-center" data-name="Section">
            {/* Admin Earnings Dashboard - Only for Platform Admins */}
            {user?.email === 'admin@caffelino.com' && (
              <div className="w-full max-w-4xl">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[16px] p-6 border-2 border-dashed border-green-200">
                  <p className="font-['Arial:Regular',_sans-serif] leading-[24px] text-[16px] text-neutral-950 mb-2">
                    💰 <strong>Platform Admin:</strong> Earnings Dashboard
                  </p>
                  <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-[14px] text-neutral-600 mb-4">
                    Track revenue, manage payouts, and generate tax reports
                  </p>
                  <button
                    className="bg-green-600 hover:bg-green-700 h-[40px] rounded-[8px] px-6 text-white font-['Arial:Regular',_sans-serif] text-[14px] transition-colors w-full"
                    onClick={() => onNavigate('admin-earnings-dashboard')}
                  >
                    View Earnings Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} user={user} onShowAuth={onShowAuth} />
    </div>
  );
}