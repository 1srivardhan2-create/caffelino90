import { useState, useEffect } from 'react';
import { Users, TrendingUp, Gift, MessageSquare, Search, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import CoffeeLoader from './CoffeeLoader';

interface Group {
  id: string;
  name: string;
  type: string;
  visits: number;
  totalSpent: number;
  lastVisit: string;
  members: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold';
  contactPerson: string;
  contactEmail: string;
  favoriteItems: string[];
  hasDiscount: boolean;
  discountPercent?: number;
}



const GROUP_TYPES = ['All', 'Tech', 'Books', 'Music', 'Design', 'Gaming', 'Business', 'Study'];

export default function CafeGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('10');
  const [messageText, setMessageText] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading effect
  useEffect(() => {
    const loadGroups = async () => {
      setIsLoading(true);
      // Simulate fetching groups data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    loadGroups();
  }, []);

  const handleOfferDiscount = (group: Group) => {
    setSelectedGroup(group);
    setDiscountPercent(group.discountPercent?.toString() || '10');
    setShowDiscountDialog(true);
  };

  const handleSaveDiscount = () => {
    if (selectedGroup) {
      setGroups(groups.map(g => 
        g.id === selectedGroup.id 
          ? { ...g, hasDiscount: true, discountPercent: parseInt(discountPercent) }
          : g
      ));
      toast.success(`${discountPercent}% discount offered to ${selectedGroup.name}!`);
      setShowDiscountDialog(false);
    }
  };

  const handleRemoveDiscount = (groupId: string) => {
    setGroups(groups.map(g => 
      g.id === groupId ? { ...g, hasDiscount: false, discountPercent: undefined } : g
    ));
    toast.success('Discount removed');
  };

  const handleSendMessage = (group: Group) => {
    setSelectedGroup(group);
    setMessageText('');
    setShowMessageDialog(true);
  };

  const handleSendMessageSubmit = () => {
    if (messageText.trim() && selectedGroup) {
      toast.success(`Message sent to ${selectedGroup.name}!`);
      setShowMessageDialog(false);
      setMessageText('');
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesType = filterType === 'All' || group.type === filterType;
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const stats = {
    totalGroups: groups.length,
    goldTier: groups.filter(g => g.loyaltyTier === 'gold').length,
    silverTier: groups.filter(g => g.loyaltyTier === 'silver').length,
    bronzeTier: groups.filter(g => g.loyaltyTier === 'bronze').length,
    totalRevenue: groups.reduce((sum, g) => sum + g.totalSpent, 0),
  };

  if (isLoading) {
    return <CoffeeLoader message="Loading community data..." />;
  }

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'silver': return 'bg-slate-200 text-slate-700 border-slate-300';
      case 'bronze': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLoyaltyIcon = (tier: string) => {
    switch (tier) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '⭐';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] leading-[36px] text-neutral-950 mb-2">👥 Groups & Community</h1>
        <p className="text-[14px] text-slate-600">Manage your loyal groups and build community</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Total Groups</p>
          <p className="text-[24px] leading-[32px] text-neutral-950">{stats.totalGroups}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50">
          <p className="text-[12px] text-amber-700 mb-1">Gold Tier 🥇</p>
          <p className="text-[24px] leading-[32px] text-amber-600">{stats.goldTier}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-slate-50 to-gray-50">
          <p className="text-[12px] text-slate-600 mb-1">Silver Tier 🥈</p>
          <p className="text-[24px] leading-[32px] text-slate-600">{stats.silverTier}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50">
          <p className="text-[12px] text-orange-700 mb-1">Bronze Tier 🥉</p>
          <p className="text-[24px] leading-[32px] text-orange-600">{stats.bronzeTier}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-[12px] text-green-700 mb-1">Total Revenue</p>
          <p className="text-[24px] leading-[32px] text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by group name or contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-0"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {GROUP_TYPES.map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-[18px] leading-[26px] text-neutral-950 mb-1">{group.name}</h3>
                  <Badge variant="secondary" className="text-[12px]">{group.type}</Badge>
                </div>
                <Badge variant="outline" className={getLoyaltyColor(group.loyaltyTier)}>
                  {getLoyaltyIcon(group.loyaltyTier)} {group.loyaltyTier.toUpperCase()}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[12px] text-slate-600">Visits</p>
                  <p className="text-[16px] text-neutral-950">{group.visits}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-600">Members</p>
                  <p className="text-[16px] text-neutral-950">{group.members}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-600">Total Spent</p>
                  <p className="text-[16px] text-green-600">₹{group.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-600">Last Visit</p>
                  <p className="text-[12px] text-neutral-950">{group.lastVisit}</p>
                </div>
              </div>

              {/* Favorite Items */}
              <div>
                <p className="text-[12px] text-slate-600 mb-2">Favorite Items:</p>
                <div className="flex flex-wrap gap-1">
                  {group.favoriteItems.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-[11px]">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Discount Badge */}
              {group.hasDiscount && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="size-4 text-green-600" />
                    <span className="text-[14px] text-green-700">{group.discountPercent}% Discount</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDiscount(group.id)}
                    className="text-red-600 hover:text-red-700 h-auto p-1"
                  >
                    Remove
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOfferDiscount(group)}
                >
                  <Gift className="size-4 mr-2" />
                  {group.hasDiscount ? 'Update' : 'Offer'} Discount
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSendMessage(group)}
                >
                  <MessageSquare className="size-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="size-16 text-slate-300 mx-auto mb-4" />
          <p className="text-[14px] text-slate-600">No groups found</p>
        </div>
      )}

      {/* Discount Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offer Discount</DialogTitle>
            <DialogDescription>
              Offer a loyalty discount to {selectedGroup?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="discount">Discount Percentage</Label>
              <Input
                id="discount"
                type="number"
                min="5"
                max="50"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="mt-2"
              />
              <p className="text-[12px] text-slate-500 mt-1">
                Enter a discount percentage between 5% and 50%
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-[14px] text-indigo-900">
                💡 This group has visited {selectedGroup?.visits} times and spent ₹{selectedGroup?.totalSpent.toLocaleString()} in total.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDiscountDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveDiscount}
                className="flex-1"
              >
                <Gift className="size-4 mr-2" />
                Offer {discountPercent}% Discount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {selectedGroup?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>

            <div className="bg-slate-50 border rounded-lg p-3">
              <p className="text-[12px] text-slate-600 mb-1">To:</p>
              <p className="text-[14px] text-neutral-950">{selectedGroup?.contactPerson}</p>
              <p className="text-[12px] text-slate-600">{selectedGroup?.contactEmail}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowMessageDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessageSubmit}
                className="flex-1"
                disabled={!messageText.trim()}
              >
                <MessageSquare className="size-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
