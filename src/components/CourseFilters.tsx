
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CourseFiltersProps {
  filters: {
    categories: string[];
    difficulty: string[];
    duration: string[];
    company: string[];
    certification: boolean;
  };
  onFilterChange: (filters: any) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({ filters, onFilterChange }) => {
  const categories = [
    'Artificial Intelligence',
    'DevOps & Cloud',
    'Web Development',
    'Data Science',
    'Cybersecurity',
    'Mobile Development',
    'Blockchain',
    'UI/UX Design'
  ];

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const durations = ['< 2 hours', '2-10 hours', '10-20 hours', '20+ hours'];
  const companies = ['Google', 'Microsoft', 'AWS', 'Meta', 'OpenAI', 'Nvidia', 'Tesla'];

  const handleFilterToggle = (filterType: string, value: string) => {
    const newFilters = { ...filters };
    
    if (filterType === 'certification') {
      newFilters.certification = !newFilters.certification;
    } else {
      // Handle array-type filters
      const currentArray = newFilters[filterType as keyof typeof newFilters] as string[];
      if (currentArray.includes(value)) {
        (newFilters as any)[filterType] = currentArray.filter(item => item !== value);
      } else {
        (newFilters as any)[filterType] = [...currentArray, value];
      }
    }
    
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      difficulty: [],
      duration: [],
      company: [],
      certification: false,
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.duration.length > 0 ||
    filters.company.length > 0 ||
    filters.certification;

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => handleFilterToggle('categories', category)}
                />
                <label
                  htmlFor={category}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Difficulty */}
        <div>
          <h3 className="font-semibold mb-3">Difficulty</h3>
          <div className="space-y-2">
            {difficultyLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={filters.difficulty.includes(level)}
                  onCheckedChange={() => handleFilterToggle('difficulty', level)}
                />
                <label
                  htmlFor={level}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Duration */}
        <div>
          <h3 className="font-semibold mb-3">Duration</h3>
          <div className="space-y-2">
            {durations.map((duration) => (
              <div key={duration} className="flex items-center space-x-2">
                <Checkbox
                  id={duration}
                  checked={filters.duration.includes(duration)}
                  onCheckedChange={() => handleFilterToggle('duration', duration)}
                />
                <label
                  htmlFor={duration}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {duration}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Company Sponsors */}
        <div>
          <h3 className="font-semibold mb-3">Company Sponsors</h3>
          <div className="space-y-2">
            {companies.map((company) => (
              <div key={company} className="flex items-center space-x-2">
                <Checkbox
                  id={company}
                  checked={filters.company.includes(company)}
                  onCheckedChange={() => handleFilterToggle('company', company)}
                />
                <label
                  htmlFor={company}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {company}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Certification */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="certification"
              checked={filters.certification}
              onCheckedChange={() => handleFilterToggle('certification', '')}
            />
            <label
              htmlFor="certification"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Includes Certification
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseFilters;
