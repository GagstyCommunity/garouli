
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  User, 
  Settings, 
  LogOut, 
  BookOpen,
  Users,
  Briefcase,
  Zap,
  Award,
  Shield,
  Plus,
  BarChart3,
  Crown
} from 'lucide-react';

const Navigation = () => {
  const { user, userRole, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const categories = [
    { name: 'AI & Machine Learning', icon: Zap, path: '/courses?category=ai' },
    { name: 'Web Development', icon: BookOpen, path: '/courses?category=web' },
    { name: 'Data Science', icon: BarChart3, path: '/courses?category=data' },
    { name: 'Business', icon: Briefcase, path: '/courses?category=business' },
    { name: 'Design', icon: Award, path: '/courses?category=design' },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'instructor': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'instructor': return User;
      case 'enterprise': return Briefcase;
      default: return BookOpen;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">Garouli</span>
              <span className="text-xs text-gray-500 -mt-1">Free Learning Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-gray-900 font-medium">
                Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} className="p-3" asChild>
                    <Link to={category.path}>
                      <category.icon className="h-4 w-4 mr-3" />
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/courses" className="text-gray-700 hover:text-gray-900 font-medium">
              Courses
            </Link>
            <Link to="/codex" className="text-gray-700 hover:text-gray-900 font-medium">
              Codex
            </Link>
            <Link to="/battle" className="text-gray-700 hover:text-gray-900 font-medium">
              Prompt Battle
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-gray-900 font-medium">
              Jobs
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-gray-900 font-medium">
              Blog
            </Link>
            <Link to="/contribute" className="text-gray-700 hover:text-gray-900 font-medium">
              Contribute
            </Link>
            
            {/* Role-specific navigation */}
            {userRole === 'instructor' && (
              <Link to="/instructor/create-course" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
            )}
            
            {userRole === 'enterprise' && (
              <Link to="/agency-dashboard" className="text-purple-600 hover:text-purple-800 font-medium">
                Agency Dashboard
              </Link>
            )}
            
            {userRole === 'admin' && (
              <Link to="/admin" className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for courses, instructors, topics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-auto px-2 rounded-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
                          {userProfile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {userRole && (
                        <Badge className={`text-xs ${getRoleColor(userRole)}`}>
                          {userRole === 'enterprise' ? 'Agency' : userRole}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium">
                      {userProfile?.full_name || user.user_metadata?.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {userRole && (
                      <div className="flex items-center gap-1 mt-1">
                        {React.createElement(getRoleIcon(userRole), { className: "h-3 w-3" })}
                        <span className="text-xs text-gray-600 capitalize">
                          {userRole === 'enterprise' ? 'Agency Account' : `${userRole} Account`}
                        </span>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-learning')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Learning
                  </DropdownMenuItem>
                  {userRole === 'instructor' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/instructor/courses')}>
                        <Users className="mr-2 h-4 w-4" />
                        My Courses
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/instructor/analytics')}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </DropdownMenuItem>
                    </>
                  )}
                  {userRole === 'enterprise' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/agency-dashboard')}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Agency Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/team-management')}>
                        <Users className="mr-2 h-4 w-4" />
                        Team Management
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/certificates')}>
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Log In
                </Button>
                <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                  Sign Up Free
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link to="/courses" className="block text-gray-700 hover:text-gray-900 py-2">
                    Courses
                  </Link>
                  <Link to="/codex" className="block text-gray-700 hover:text-gray-900 py-2">
                    Codex
                  </Link>
                  <Link to="/battle" className="block text-gray-700 hover:text-gray-900 py-2">
                    Prompt Battle
                  </Link>
                  <Link to="/jobs" className="block text-gray-700 hover:text-gray-900 py-2">
                    Jobs
                  </Link>
                  {userRole === 'instructor' && (
                    <Link to="/instructor/create-course" className="block text-blue-600 hover:text-blue-800 py-2">
                      Create Course
                    </Link>
                  )}
                  {userRole === 'enterprise' && (
                    <Link to="/agency-dashboard" className="block text-purple-600 hover:text-purple-800 py-2">
                      Agency Dashboard
                    </Link>
                  )}
                  {userRole === 'admin' && (
                    <Link to="/admin" className="block text-red-600 hover:text-red-800 py-2">
                      Admin Panel
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
