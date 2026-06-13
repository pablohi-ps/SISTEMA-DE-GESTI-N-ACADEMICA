import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BackButton({ to = -1, label = "Volver" }) {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => navigate(to)} 
      className="mb-4 text-muted-foreground hover:text-primary flex items-center gap-1 group transition-colors px-0"
    >
      <div className="p-1 rounded-full group-hover:bg-primary/10 transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </div>
      <span className="font-medium text-xs">{label}</span>
    </Button>
  );
}
