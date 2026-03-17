import { useState } from 'react';
import { ArrowLeft, Users, MapPin, Calendar, Send, ThumbsUp, Share2, Menu as MenuIcon, Edit, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import GenderAvatar from './GenderAvatar';

interface GroupDetailPageProps {
  user: any;
  group: any;
  onNavigate: (page: string, data?: any) => void;
}



const VOTING_OPTIONS = [
  { id: '1', option: 'Saturday, 6:00 PM', votes: 3 },
  { id: '2', option: 'Sunday, 5:00 PM', votes: 2 },
  { id: '3', option: 'Saturday, 8:00 PM', votes: 1 },
];

const MENU_ITEMS = [
  { name: 'Cappuccino', price: 150, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { name: 'Margherita Pizza', price: 350, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
  { name: 'Caesar Salad', price: 250, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
  { name: 'Chocolate Cake', price: 180, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' }
];

export default function GroupDetailPage({ user, group, onNavigate }: GroupDetailPageProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  // Handle case where group is null
  if (!group) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Group not found</h2>
          <Button onClick={() => onNavigate('home')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: user.name,
      message: message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSystem: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleAddToOrder = (item: any) => {
    // Add to order list
    setOrderItems([...orderItems, item]);
    
    // Share in chat
    const foodMessage = {
      id: Date.now().toString(),
      sender: user.name,
      message: `I'm ordering ${item.name} (₹${item.price})`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSystem: false,
      foodItem: item // Include food item data
    };
    
    setMessages([...messages, foodMessage]);
    toast.success(`${item.name} added to your order and shared in chat!`);
  };

  const handleJoinGroup = () => {
    setHasJoined(true);
    toast.success('Successfully joined the group!');
    
    const systemMessage = {
      id: Date.now().toString(),
      sender: 'System',
      message: `${user.name} joined the group`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    };
    
    setMessages([...messages, systemMessage]);
  };

  const handleVote = (optionId: string) => {
    setVotedOption(optionId);
    toast.success('Vote recorded!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-14 z-40">
          <div className="px-4 py-4">
            <button 
              onClick={() => onNavigate('find-groups')}
              className="caffelino-back-btn mb-4"
            >
              ← Back
            </button>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl mb-2">{group.title}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {group.tags?.map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{group.cafe?.name || group.location || 'Location TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{group.date && group.time ? `${group.date} at ${group.time}` : group.time || 'Time TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{group.members || group.memberCount || 0}/{group.maxMembers || 6} members</span>
                  </div>
                </div>
              </div>
              
              {!hasJoined && (
                <Button onClick={handleJoinGroup}>
                  Join Group
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Members Strip */}
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-sm">Members:</span>
            <div className="flex -space-x-2">
              {(group?.members || []).map((member: any, i: number) => (
                <div key={i} className="border-2 border-white rounded-full">
                  <GenderAvatar 
                    gender={member.gender || 'male'}
                    name={member.name}
                    size="sm"
                  />
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="vote">Vote</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat">
              <Card className="p-4">
                <div className="h-96 overflow-y-auto mb-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={msg.isSystem ? 'text-center' : ''}>
                      {msg.isSystem ? (
                        <div className="text-sm text-slate-500 bg-slate-100 inline-block px-3 py-1 rounded-full">
                          {msg.message}
                        </div>
                      ) : (
                        <div className={`flex ${msg.sender === user?.name ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md ${
                            msg.sender === user?.name 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-slate-100'
                          } rounded-2xl px-4 py-2`}>
                            <div className="text-xs opacity-70 mb-1">{msg.sender}</div>
                            
                            {/* Show food item if present */}
                            {msg.foodItem && (
                              <div className="mb-2">
                                <img 
                                  src={msg.foodItem.image} 
                                  alt={msg.foodItem.name}
                                  className="w-full h-32 object-cover rounded-lg mb-2"
                                />
                              </div>
                            )}
                            
                            <div>{msg.message}</div>
                            <div className="text-xs opacity-70 mt-1">{msg.time}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {hasJoined ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-slate-100 rounded-lg">
                    <p className="text-slate-600">Join the group to start chatting</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Vote Tab */}
            <TabsContent value="vote">
              <Card className="p-6">
                <h3 className="text-xl mb-4">Vote for Meetup Time</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Choose your preferred time. Voting ends 24 hours before the meetup.
                </p>

                <div className="space-y-3">
                  {VOTING_OPTIONS.map((option) => (
                    <div key={option.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span>{option.option}</span>
                        <Button
                          size="sm"
                          variant={votedOption === option.id ? 'default' : 'outline'}
                          onClick={() => handleVote(option.id)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {votedOption === option.id ? 'Voted' : 'Vote'}
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>{option.votes} votes</span>
                          <span>{Math.round((option.votes / 6) * 100)}%</span>
                        </div>
                        <Progress value={(option.votes / 6) * 100} />
                      </div>
                    </div>
                  ))}
                </div>

                {votedOption && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Your vote has been recorded. You can change it anytime before voting ends.
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card className="p-6">
                <h3 className="text-xl mb-4">Group Members</h3>
                <div className="space-y-4">
                  {(group?.members || []).map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <GenderAvatar 
                          gender={member.gender}
                          name={member.name}
                          size="md"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{member.name}, {member.age}</span>
                            {member.verified && <span className="text-green-600 text-sm">✓</span>}
                          </div>
                          <div className="text-sm text-slate-500">Member</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-6">
                  Invite More Members
                </Button>
              </Card>
            </TabsContent>

            {/* Menu Tab */}
            <TabsContent value="menu">
              <Card className="p-6">
                {/* Café Header */}
                {group.cafe && (
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex gap-4">
                      <img 
                        src={group.cafe.image} 
                        alt={group.cafe.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg mb-1">{group.cafe.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {group.cafe.type === 'café' ? '☕ Café' : '🍽️ Restaurant'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>{group.cafe.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{group.cafe?.location || 'Location not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl">Menu</h3>
                  {group.isAdmin && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast.info('Admin can manage menu items')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Manage Menu
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-6">
                  {group.isAdmin 
                    ? 'As admin, you can add or edit menu items. Members can view and order.' 
                    : 'Browse the menu and place your order. Bills will be split equally.'}
                </p>

                <div className="space-y-4">
                  {MENU_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-0 border rounded-lg overflow-hidden">
                      {/* Food Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Food Details */}
                      <div className="flex-1 flex items-center justify-between py-4 pr-4">
                        <div>
                          <div>{item.name}</div>
                          <div className="text-sm text-slate-600">₹{item.price}</div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleAddToOrder(item)}>+ Add</Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Summary */}
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                  <h4 className="text-sm mb-3">Bill Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Your Order:</span>
                      <span>
                        {orderItems.length > 0 
                          ? `₹${orderItems.reduce((sum, item) => sum + item.price, 0)}` 
                          : '₹0'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Group Bill:</span>
                      <span>₹930</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span>Split among {group.members} members:</span>
                      <span className="text-lg">₹{Math.round(930 / group.members)} each</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    * Bills are split equally among all group members regardless of individual orders
                  </p>
                </div>

                <Button className="w-full mt-6" onClick={() => onNavigate('payment')}>
                  View Cart & Pay
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-2">
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => toast.info('Added to calendar')}>
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
