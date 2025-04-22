
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  description?: string;
  count: number;
  icon: React.ReactNode;
  linkTo: string;
  color: string;
  onClick?: () => void;
  onAdd?: () => void;
  children?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  count,
  icon,
  linkTo,
  color,
  onClick,
  onAdd,
  children,
}) => {
  return (
    <Card className="border-t-4" style={{ borderTopColor: color }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-opacity-20`} style={{ backgroundColor: color }}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {children}
        {onAdd && (
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 w-full"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add {title.slice(0, -1)}
          </Button>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          onClick={onClick}
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
