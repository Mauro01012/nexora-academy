import type { IconName } from '@/components/ui/Icon';

export type CategoryId = 'web' | 'dados' | 'design' | 'seguranca' | 'ia' | 'negocios';
export type Tone = 'primary' | 'mint' | 'accent' | 'amber' | 'slate';
export type Level = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: IconName;
  tone: Tone;
  /** Quantidade ilustrativa de cursos na categoria. */
  courseCount: number;
}

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
  expertise: string[];
  tone: Tone;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: CategoryId;
  level: Level;
  hours: number;
  lessons: number;
  rating: number;
  students: number;
  /** Preço em reais (BRL). Quando ausente, o curso é gratuito. */
  price?: number;
  instructorId: string;
  tags: string[];
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export interface Stat {
  value: string;
  label: string;
}
