
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Share, 
  MessageCircle,
  Clock,
  BookOpen,
  Plus,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface StudyRoom {
  id: string;
  name: string;
  description: string;
  course_title?: string;
  max_participants: number;
  current_participants: number;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    is_host: boolean;
  }[];
  is_active: boolean;
  created_at: string;
  topic: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  timestamp: string;
}

const StudyRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudyRooms();
  }, [user]);

  const fetchStudyRooms = async () => {
    if (!user) return;

    try {
      // Mock study rooms until backend is implemented
      const mockRooms: StudyRoom[] = [
        {
          id: '1',
          name: 'React Fundamentals Study Group',
          description: 'Learning React hooks and state management',
          course_title: 'React Development',
          max_participants: 8,
          current_participants: 4,
          participants: [
            {
              id: '1',
              name: 'Alice Johnson',
              avatar: '/placeholder.svg',
              is_host: true
            },
            {
              id: '2',
              name: 'Bob Smith',
              avatar: '/placeholder.svg',
              is_host: false
            },
            {
              id: '3',
              name: 'Carol Davis',
              avatar: '/placeholder.svg',
              is_host: false
            },
            {
              id: '4',
              name: 'David Wilson',
              avatar: '/placeholder.svg',
              is_host: false
            }
          ],
          is_active: true,
          created_at: new Date().toISOString(),
          topic: 'useState and useEffect hooks'
        },
        {
          id: '2',
          name: 'Python Data Science Workshop',
          description: 'Working on pandas and matplotlib projects',
          course_title: 'Data Science with Python',
          max_participants: 6,
          current_participants: 2,
          participants: [
            {
              id: '5',
              name: 'Eve Brown',
              avatar: '/placeholder.svg',
              is_host: true
            },
            {
              id: '6',
              name: 'Frank Miller',
              avatar: '/placeholder.svg',
              is_host: false
            }
          ],
          is_active: true,
          created_at: new Date().toISOString(),
          topic: 'Data visualization techniques'
        }
      ];

      setRooms(mockRooms);
    } catch (error) {
      console.error('Error fetching study rooms:', error);
      toast.error('Failed to load study rooms');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (room: StudyRoom) => {
    if (room.current_participants >= room.max_participants) {
      toast.error('Room is full');
      return;
    }

    try {
      setActiveRoom(room);
      
      // Mock chat messages
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          user_id: '1',
          user_name: 'Alice Johnson',
          message: 'Welcome everyone! Let\'s start with useState examples',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          user_id: '2',
          user_name: 'Bob Smith',
          message: 'Thanks for organizing this session!',
          timestamp: new Date().toISOString()
        }
      ];
      
      setChatMessages(mockMessages);
      toast.success(`Joined ${room.name}`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setChatMessages([]);
    setIsVideoOn(false);
    setIsAudioOn(false);
    setIsScreenSharing(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeRoom) return;

    const message: ChatMessage = {
      id: Math.random().toString(),
      user_id: user?.id || '',
      user_name: user?.user_metadata?.full_name || 'Anonymous',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    try {
      const newRoom: StudyRoom = {
        id: Math.random().toString(),
        name: newRoomName,
        description: newRoomDescription,
        max_participants: 8,
        current_participants: 1,
        participants: [
          {
            id: user?.id || '',
            name: user?.user_metadata?.full_name || 'Anonymous',
            avatar: user?.user_metadata?.avatar_url,
            is_host: true
          }
        ],
        is_active: true,
        created_at: new Date().toISOString(),
        topic: 'Open discussion'
      };

      setRooms(prev => [newRoom, ...prev]);
      setShowCreateRoom(false);
      setNewRoomName('');
      setNewRoomDescription('');
      
      toast.success('Study room created successfully!');
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.info(isVideoOn ? 'Camera turned off' : 'Camera turned on');
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast.info(isAudioOn ? 'Microphone muted' : 'Microphone unmuted');
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.info(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  };

  if (loading) {
    return <div className="text-center">Loading study rooms...</div>;
  }

  if (activeRoom) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                {activeRoom.name}
              </CardTitle>
              <Button variant="outline" onClick={leaveRoom}>
                Leave Room
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Area */}
              <div className="lg:col-span-2 space-y-4">
                {/* Main Video */}
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
                  {isScreenSharing ? (
                    <div className="text-white text-center">
                      <Share className="h-12 w-12 mx-auto mb-2" />
                      <p>Screen is being shared</p>
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <Video className="h-12 w-12 mx-auto mb-2" />
                      <p>Video call area</p>
                    </div>
                  )}
                  
                  {/* Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <Button
                      size="sm"
                      variant={isAudioOn ? "default" : "destructive"}
                      onClick={toggleAudio}
                    >
                      {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant={isVideoOn ? "default" : "destructive"}
                      onClick={toggleVideo}
                    >
                      {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant={isScreenSharing ? "secondary" : "outline"}
                      onClick={toggleScreenShare}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Participant Videos */}
                <div className="grid grid-cols-4 gap-2">
                  {activeRoom.participants.map((participant) => (
                    <div key={participant.id} className="aspect-video bg-gray-200 rounded flex items-center justify-center relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>
                          {participant.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-1 left-1 right-1">
                        <p className="text-xs text-white bg-black bg-opacity-50 px-1 rounded truncate">
                          {participant.name}
                        </p>
                      </div>
                      {participant.is_host && (
                        <Badge className="absolute top-1 right-1 text-xs">Host</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat & Participants */}
              <div className="space-y-4">
                {/* Participants */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Participants ({activeRoom.current_participants}/{activeRoom.max_participants})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {activeRoom.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="text-xs">
                            {participant.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{participant.name}</span>
                        {participant.is_host && (
                          <Badge variant="secondary" className="text-xs">Host</Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Chat */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-64 overflow-y-auto space-y-2">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="text-sm">
                          <div className="font-medium text-xs text-muted-foreground">
                            {message.user_name}
                          </div>
                          <div>{message.message}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button size="sm" onClick={sendMessage}>
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Virtual Study Rooms
            </CardTitle>
            <Button onClick={() => setShowCreateRoom(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{room.name}</h3>
                      <p className="text-sm text-muted-foreground">{room.description}</p>
                      {room.course_title && (
                        <p className="text-xs text-blue-600 mt-1">Course: {room.course_title}</p>
                      )}
                    </div>
                    <Badge variant={room.is_active ? "default" : "secondary"}>
                      {room.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex -space-x-2">
                      {room.participants.slice(0, 3).map((participant) => (
                        <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="text-xs">
                            {participant.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {room.participants.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                          <span className="text-xs">+{room.participants.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {room.current_participants}/{room.max_participants} participants
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {room.topic}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Active now
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => joinRoom(room)}
                      disabled={room.current_participants >= room.max_participants}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      {room.current_participants >= room.max_participants ? 'Full' : 'Join Room'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <Card className="fixed inset-4 z-50 bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create Study Room</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCreateRoom(false)}
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Room Name</label>
              <Input
                placeholder="Enter room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="What will you be studying?"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <Button onClick={createRoom} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyRooms;
