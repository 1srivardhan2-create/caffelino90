import { useState } from 'react';
import { MapPin, Users, Calendar, Filter, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface FindGroupsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onShowAuth: () => void;
  onBack: () => void;
}



export default function FindGroups({ user, onNavigate, onShowAuth, onBack }: FindGroupsProps) {
  const [groups, setGroups] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    gender: 'any',
    groupSize: [],
    interests: [],
    distance: '10'
  });

  const handleJoinGroup = (group: any) => {
    if (!user) {
      onShowAuth();
      return;
    }
    onNavigate('group-detail', group);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="caffelino-back-btn mb-4"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Find Groups</h1>
          <p className="text-slate-600">Discover meetups near you</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Groups</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="mb-3">Gender Preference</h3>
                  <div className="space-y-2">
                    {['any', 'male', 'female', 'mixed'].map((option) => (
                      <div key={option} className="flex items-center">
                        <Checkbox 
                          id={option}
                          checked={filters.gender === option}
                          onCheckedChange={() => setFilters({...filters, gender: option})}
                        />
                        <Label htmlFor={option} className="ml-2 capitalize">
                          {option === 'any' ? 'Any' : option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Group Size</h3>
                  <div className="space-y-2">
                    {['4', '6', '8', '10'].map((size) => (
                      <div key={size} className="flex items-center">
                        <Checkbox id={`size-${size}`} />
                        <Label htmlFor={`size-${size}`} className="ml-2">
                          {size} people
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Interests</h3>
                  <div className="space-y-2">
                    {['Coffee', 'Gaming', 'Tech', 'Food', 'Business'].map((interest) => (
                      <div key={interest} className="flex items-center">
                        <Checkbox id={`interest-${interest}`} />
                        <Label htmlFor={`interest-${interest}`} className="ml-2">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>

          <Badge variant="secondary" className="cursor-pointer">
            Nearby First
          </Badge>
          <Badge variant="secondary" className="cursor-pointer">
            Today
          </Badge>
          <Badge variant="secondary" className="cursor-pointer">
            Weekend
          </Badge>
        </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video relative">
                <img 
                  src={group.image} 
                  alt={group.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {group.distance}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="flex-1">{group.title}</h3>
                </div>
                
                <p className="text-slate-600 text-sm mb-3">{group.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{group.cafe} • {group.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{group.time}</span>
                </div>

                <div className="flex gap-2 mb-4">
                  {group.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      {group.members}/{group.maxMembers}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleJoinGroup(group)}
                    >
                      View
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleJoinGroup(group)}
                      disabled={group.members >= group.maxMembers}
                    >
                      {group.members >= group.maxMembers ? 'Full' : 'Join'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline">Load More Groups</Button>
        </div>
      </div>
    </div>
  );
}