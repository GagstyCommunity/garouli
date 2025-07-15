
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  rating: number;
  student_count: number;
  duration_hours: number;
  difficulty: string;
  category: string;
  recommendation_score: number;
  reason: string;
}

interface UserLearningGoals {
  preferred_categories: string[] | null;
  preferred_difficulty: string | null;
}

interface CourseInteraction {
  course_id: string;
  interaction_type: string;
}

const RecommendationEngine: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      // Get user's learning goals
      const { data: goals, error: goalsError } = await supabase
        .from('user_learning_goals')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (goalsError) {
        console.log('No learning goals found, using default preferences');
      }

      // Get user's course interactions
      const { data: interactions, error: interactionsError } = await supabase
        .from('course_interactions')
        .select('course_id, interaction_type')
        .eq('user_id', user?.id);

      if (interactionsError) {
        console.log('No interactions found');
      }

      // Get courses based on preferences and behavior
      let query = supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .limit(6);

      // Filter by preferred categories if available
      const userGoals = goals as UserLearningGoals | null;
      if (userGoals?.preferred_categories && userGoals.preferred_categories.length > 0) {
        query = query.in('category', userGoals.preferred_categories);
      }

      const { data: courses, error: coursesError } = await query;

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        return;
      }

      if (courses) {
        // Calculate recommendation scores
        const scoredCourses = courses.map(course => {
          let score = 50; // Base score
          let reason = 'Popular course';

          // Boost score for preferred categories
          if (userGoals?.preferred_categories?.includes(course.category)) {
            score += 30;
            reason = 'Matches your interests';
          }

          // Boost score for difficulty preference
          if (userGoals?.preferred_difficulty === course.difficulty) {
            score += 20;
            reason = 'Perfect difficulty level';
          }

          // Boost score for highly rated courses
          if (course.rating && course.rating >= 4.5) {
            score += 15;
          }

          // Reduce score if already enrolled
          const enrolled = interactions?.some((i: CourseInteraction) => 
            i.course_id === course.id && i.interaction_type === 'enroll'
          );
          if (enrolled) {
            score -= 40;
          }

          return {
            ...course,
            recommendation_score: Math.min(100, score),
            reason,
            rating: course.rating || 0,
            student_count: course.student_count || 0,
            duration_hours: course.duration_hours || 0,
            thumbnail_url: course.thumbnail_url || '/placeholder.svg',
            description: course.description || ''
          };
        });

        // Sort by recommendation score
        const sortedCourses = scoredCourses
          .sort((a, b) => b.recommendation_score - a.recommendation_score)
          .slice(0, 6);

        setRecommendations(sortedCourses);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackInteraction = async (courseId: string, type: string) => {
    if (!user) return;

    try {
      await supabase.from('course_interactions').insert({
        user_id: user.id,
        course_id: courseId,
        interaction_type: type,
        interaction_data: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const handleCourseClick = async (course: RecommendedCourse) => {
    await trackInteraction(course.id, 'view');
    navigate(`/courses/${course.id}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading recommendations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((course) => (
            <Card 
              key={course.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCourseClick(course)}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={course.thumbnail_url || '/placeholder.svg'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-primary">
                  {Math.round(course.recommendation_score)}% match
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{course.reason}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{course.student_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration_hours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationEngine;
