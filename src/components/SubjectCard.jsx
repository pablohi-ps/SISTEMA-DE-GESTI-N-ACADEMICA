import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { BookOpen, Users, FileText, ChevronRight, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubjectCard({ subject }) {
  // Stable random stats (computed once on mount via lazy initializer)
  const [studentsCount] = useState(() => Math.floor(Math.random() * 20) + 15);
  const [progress] = useState(() => Math.floor(Math.random() * 60) + 30);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card className="h-full group overflow-hidden border-border/60 bg-card hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col">
        {/* Header with gradient bar */}
        <div className="h-2 w-full bg-gradient-to-r from-primary to-indigo-400"></div>
        
        <CardHeader className="pb-4 relative">
          <div className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 cursor-pointer" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{subject.code}</span>
          </div>
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {subject.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-grow space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{studentsCount} Alumnos</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>12 Temas</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Progreso del Sílabo</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-6 flex gap-2">
          <Button variant="default" className="flex-1 bg-primary text-white hover:bg-primary/90 shadow-md">
            Gestionar <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="outline" className="px-3 border-primary/20 text-primary hover:bg-primary/5">
            Sílabo
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
