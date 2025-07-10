
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';

const featuredCourses = [
  {
    id: 1,
    title: 'Complete AI Engineering Bootcamp',
    description: 'Master machine learning, neural networks, and AI deployment with hands-on projects.',
    category: 'AI/ML',
    level: 'Beginner to Expert',
    duration: '12 weeks',
    students: 1250,
    rating: 4.9,
    sponsor: 'Google Cloud',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&h=225&q=80',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
  },
  {
    id: 2,
    title: 'DevOps Master Class',
    description: 'Learn Docker, Kubernetes, CI/CD, and cloud deployment strategies.',
    category: 'DevOps',
    level: 'Intermediate',
    duration: '8 weeks',
    students: 890,
    rating: 4.8,
    sponsor: 'AWS',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=400&h=225&q=80',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
  },
  {
    id: 3,
    title: 'Full-Stack Development with AI',
    description: 'Build modern web applications integrated with AI capabilities.',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '10 weeks',
    students: 2100,
    rating: 4.9,
    sponsor: 'Microsoft',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=400&h=225&q=80',
    tags: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
  },
];

const FeaturedCourses = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-gradient">AI-Powered Courses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular courses, designed by AI and refined by industry experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 hover-scale">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    {course.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 border-0">
                    {course.level}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {course.students.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="mr-1 text-yellow-400 fill-current" />
                    {course.rating}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Sponsor */}
                <div className="text-xs text-muted-foreground">
                  Sponsored by <span className="font-medium text-foreground">{course.sponsor}</span>
                </div>

                {/* Action Button */}
                <Link to={`/course/${course.id}`}>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <BookOpen size={16} className="mr-2" />
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/courses">
            <Button variant="outline" size="lg" className="hover-scale">
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
