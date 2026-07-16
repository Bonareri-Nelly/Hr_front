// src/features/offboarding/components/ExitInterviewView.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Send,
} from 'lucide-react';
import type { ExitInterview } from '../types';

interface ExitInterviewViewProps {
  caseId: string;
}

// Mock data - replace with actual API call
const mockInterview: ExitInterview = {
  id: 'exit-001',
  caseId: 'off-001',
  employeeId: 'emp-001',
  primaryReason: 'Better career opportunity',
  secondaryReasons: ['Higher salary', 'Career growth'],
  feedback: [
    {
      category: 'career-growth',
      rating: 4,
      comments: 'Good opportunities for growth, but limited in current role'
    },
    {
      category: 'compensation',
      rating: 3,
      comments: 'Competitive base salary but bonuses could be better'
    },
    {
      category: 'work-life-balance',
      rating: 4,
      comments: 'Flexible work arrangements are great'
    }
  ],
  overallRating: 4,
  wouldRecommend: 'yes',
  additionalComments: 'Overall positive experience with the company',
  suggestionsForImprovement: 'More structured career development programs',
  submittedBy: 'employee',
  submittedDate: '2024-12-10',
  isConfidential: true
};

export const ExitInterviewView: React.FC<ExitInterviewViewProps> = () => {
  const [interview, setInterview] = useState<ExitInterview>(mockInterview);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(interview);

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? 'fill-gold-500 text-gold-500'
                : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRecommendationIcon = (recommend: string) => {
    switch (recommend) {
      case 'yes':
        return <ThumbsUp className="h-5 w-5 text-green-400" />;
      case 'no':
        return <ThumbsDown className="h-5 w-5 text-red-400" />;
      default:
        return <Meh className="h-5 w-5 text-yellow-400" />;
    }
  };

  const handleSubmit = () => {
    setInterview(formData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Summary */}
        <Card className="bg-navy-700/50 border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Exit Interview Summary</span>
              <Badge className="bg-blue-500/20 text-blue-400">
                {interview.submittedBy === 'employee' ? 'Self-Submitted' : 'HR Admin'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-400">Primary Reason</p>
                <p className="text-white font-medium">{interview.primaryReason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Overall Rating</p>
                {getRatingStars(interview.overallRating)}
              </div>
              <div>
                <p className="text-sm text-gray-400">Would Recommend</p>
                <div className="flex items-center gap-2">
                  {getRecommendationIcon(interview.wouldRecommend)}
                  <span className="text-white capitalize">{interview.wouldRecommend}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Secondary Reasons</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {interview.secondaryReasons?.map((reason, i) => (
                  <Badge key={i} variant="outline" className="border-gold-500/20">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Additional Comments</p>
              <p className="text-white mt-1">{interview.additionalComments || 'No additional comments'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Suggestions for Improvement</p>
              <p className="text-white mt-1">{interview.suggestionsForImprovement || 'No suggestions'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card className="bg-navy-700/50 border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-white">Category Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interview.feedback.map((item, index) => (
                <div key={index} className="border-b border-gold-500/10 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium capitalize">
                        {item.category.replace('-', ' ')}
                      </span>
                      {getRatingStars(item.rating)}
                    </div>
                  </div>
                  {item.comments && (
                    <p className="text-sm text-gray-400 mt-1">{item.comments}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="border-gold-500/20 text-white"
          >
            Edit Interview
          </Button>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="space-y-6">
      <Card className="bg-navy-700/50 border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-white">Exit Interview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Primary Reason for Leaving</Label>
            <Input
              value={formData.primaryReason}
              onChange={(e) => setFormData({ ...formData, primaryReason: e.target.value })}
              className="bg-navy-800 text-white border-gold-500/20"
            />
          </div>

          <div>
            <Label className="text-gray-300">Secondary Reasons</Label>
            <Input
              placeholder="Separate with commas"
              value={formData.secondaryReasons?.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                secondaryReasons: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="bg-navy-800 text-white border-gold-500/20"
            />
          </div>

          <div>
            <Label className="text-gray-300">Overall Rating</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={formData.overallRating === rating ? 'default' : 'outline'}
                  className={`${
                    formData.overallRating === rating
                      ? 'bg-gold-500 text-navy-900'
                      : 'border-gold-500/20 text-white'
                  }`}
                  onClick={() => setFormData({ ...formData, overallRating: rating })}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Would You Recommend?</Label>
            <Select
              value={formData.wouldRecommend}
              onValueChange={(value) =>
                setFormData({ ...formData, wouldRecommend: value as ExitInterview['wouldRecommend'] })
              }
            >
              <SelectTrigger className="bg-navy-800 text-white border-gold-500/20">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Additional Comments</Label>
            <Textarea
              value={formData.additionalComments}
              onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
              className="bg-navy-800 text-white border-gold-500/20"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-gray-300">Suggestions for Improvement</Label>
            <Textarea
              value={formData.suggestionsForImprovement}
              onChange={(e) => setFormData({ ...formData, suggestionsForImprovement: e.target.value })}
              className="bg-navy-800 text-white border-gold-500/20"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
          className="border-gold-500/20 text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-gold-500 text-navy-900 hover:bg-gold-400"
        >
          <Send className="mr-2 h-4 w-4" />
          Save Interview
        </Button>
      </div>
    </div>
  );
};