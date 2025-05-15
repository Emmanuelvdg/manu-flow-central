
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteDetailsHeaderProps {
  quoteNumber: string;
  status: string;
  createdAt: string;
  riskLevel?: string;
  onStatusChange: () => void;
}

export const QuoteDetailsHeader: React.FC<QuoteDetailsHeaderProps> = ({
  quoteNumber,
  status,
  createdAt,
  riskLevel,
  onStatusChange
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Map quote status to StatusBadge status
  const getBadgeStatus = (status: string) => {
    const statusMap: Record<string, "draft" | "submitted" | "completed" | "rejected"> = {
      'draft': 'draft',
      'submitted': 'submitted',
      'accepted': 'completed',
      'rejected': 'rejected'
    };
    return statusMap[status] || 'submitted';
  };

  // Get risk level badge color
  const getRiskLevelColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    
    const riskColors: Record<string, string> = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Very High': 'bg-red-100 text-red-800'
    };
    return riskColors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/quotes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quotes
            </Link>
            <h1 className="text-2xl font-bold">Quote #{quoteNumber}</h1>
            <p className="text-sm text-muted-foreground mt-1">Created on {formatDate(createdAt)}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {riskLevel && (
              <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(riskLevel)}`}>
                {riskLevel} Risk
              </span>
            )}
            <StatusBadge status={getBadgeStatus(status)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
