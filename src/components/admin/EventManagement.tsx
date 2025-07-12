
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, Plus, Edit, Eye, Users, MapPin, 
  Clock, Video, Award, Mic, UserCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_type: string;
  location: string;
  event_url: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  certificate_enabled: boolean;
  status: string;
  created_at: string;
}

interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string;
  talk_title: string;
  speaking_order: number;
  is_external: boolean;
}

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSpeakerDialogOpen, setIsSpeakerDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'online',
    location: '',
    event_url: '',
    start_time: '',
    end_time: '',
    max_participants: 100,
    certificate_enabled: false,
    status: 'draft'
  });
  const [newSpeaker, setNewSpeaker] = useState({
    name: '',
    title: '',
    bio: '',
    talk_title: '',
    speaking_order: 1,
    is_external: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpeakers = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_speakers')
        .select('*')
        .eq('event_id', eventId)
        .order('speaking_order');

      if (error) throw error;
      setSpeakers(data || []);
    } catch (error) {
      console.error('Error fetching speakers:', error);
      toast.error('Failed to load speakers');
    }
  };

  const handleCreateEvent = async () => {
    try {
      const slug = newEvent.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const { error } = await supabase
        .from('events')
        .insert([{
          ...newEvent,
          slug,
          host_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast.success('Event created successfully!');
      setIsCreateDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        event_type: 'online',
        location: '',
        event_url: '',
        start_time: '',
        end_time: '',
        max_participants: 100,
        certificate_enabled: false,
        status: 'draft'
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleCreateSpeaker = async () => {
    if (!selectedEvent) return;

    try {
      const { error } = await supabase
        .from('event_speakers')
        .insert([{
          ...newSpeaker,
          event_id: selectedEvent
        }]);

      if (error) throw error;

      toast.success('Speaker added successfully!');
      setIsSpeakerDialogOpen(false);
      setNewSpeaker({
        name: '',
        title: '',
        bio: '',
        talk_title: '',
        speaking_order: 1,
        is_external: true
      });
      fetchSpeakers(selectedEvent);
    } catch (error) {
      console.error('Error adding speaker:', error);
      toast.error('Failed to add speaker');
    }
  };

  const updateEventStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Event ${status} successfully!`);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'live': return 'bg-red-100 text-red-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    return type === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Event Management
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="AI Summit 2024"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Join industry leaders for the latest in AI..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="event_type">Event Type</Label>
                <Select value={newEvent.event_type} onValueChange={(value) => setNewEvent({...newEvent, event_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={newEvent.max_participants}
                  onChange={(e) => setNewEvent({...newEvent, max_participants: parseInt(e.target.value)})}
                />
              </div>
              {newEvent.event_type === 'online' ? (
                <div className="col-span-2">
                  <Label htmlFor="event_url">Event URL</Label>
                  <Input
                    id="event_url"
                    value={newEvent.event_url}
                    onChange={(e) => setNewEvent({...newEvent, event_url: e.target.value})}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              ) : (
                <div className="col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="San Francisco, CA"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent({...newEvent, start_time: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={newEvent.end_time}
                  onChange={(e) => setNewEvent({...newEvent, end_time: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="certificate_enabled"
                  checked={newEvent.certificate_enabled}
                  onChange={(e) => setNewEvent({...newEvent, certificate_enabled: e.target.checked})}
                />
                <Label htmlFor="certificate_enabled">Enable Certificates</Label>
              </div>
              <div className="col-span-2 flex gap-2">
                <Button onClick={handleCreateEvent} className="flex-1">
                  Create Event
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="speakers">Speakers</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.event_type)}
                      <span className="capitalize">{event.event_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{event.current_participants}/{event.max_participants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>{new Date(event.start_time).toLocaleDateString()}</span>
                    </div>
                    {event.certificate_enabled && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>Certificate</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedEvent(event.id);
                        fetchSpeakers(event.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {event.status === 'draft' ? (
                      <Button 
                        size="sm" 
                        onClick={() => updateEventStatus(event.id, 'published')}
                      >
                        Publish
                      </Button>
                    ) : event.status === 'published' ? (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => updateEventStatus(event.id, 'live')}
                      >
                        Go Live
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="speakers">
          {selectedEvent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Event Speakers ({speakers.length})</h3>
                <Dialog open={isSpeakerDialogOpen} onOpenChange={setIsSpeakerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Speaker
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Speaker</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="speaker_name">Name *</Label>
                        <Input
                          id="speaker_name"
                          value={newSpeaker.name}
                          onChange={(e) => setNewSpeaker({...newSpeaker, name: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="speaker_title">Title</Label>
                        <Input
                          id="speaker_title"
                          value={newSpeaker.title}
                          onChange={(e) => setNewSpeaker({...newSpeaker, title: e.target.value})}
                          placeholder="CEO at AI Corp"
                        />
                      </div>
                      <div>
                        <Label htmlFor="talk_title">Talk Title</Label>
                        <Input
                          id="talk_title"
                          value={newSpeaker.talk_title}
                          onChange={(e) => setNewSpeaker({...newSpeaker, talk_title: e.target.value})}
                          placeholder="The Future of AI"
                        />
                      </div>
                      <div>
                        <Label htmlFor="speaker_bio">Bio</Label>
                        <Textarea
                          id="speaker_bio"
                          value={newSpeaker.bio}
                          onChange={(e) => setNewSpeaker({...newSpeaker, bio: e.target.value})}
                          placeholder="John is a renowned expert in..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="speaking_order">Speaking Order</Label>
                        <Input
                          id="speaking_order"
                          type="number"
                          value={newSpeaker.speaking_order}
                          onChange={(e) => setNewSpeaker({...newSpeaker, speaking_order: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateSpeaker} className="flex-1">
                          Add Speaker
                        </Button>
                        <Button variant="outline" onClick={() => setIsSpeakerDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {speakers.map((speaker) => (
                  <Card key={speaker.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {speaker.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center gap-2">
                            {speaker.name}
                            <Mic className="h-4 w-4 text-blue-500" />
                          </h4>
                          <p className="text-sm text-muted-foreground">{speaker.title}</p>
                          <p className="text-sm font-medium mt-1">{speaker.talk_title}</p>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {speaker.bio}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="outline">
                              Order: {speaker.speaking_order}
                            </Badge>
                            <Badge variant={speaker.is_external ? 'secondary' : 'default'}>
                              {speaker.is_external ? 'External' : 'Internal'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select an event to manage speakers</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="participants">
          {selectedEvent ? (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Participant management coming soon</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select an event to manage participants</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventManagement;
