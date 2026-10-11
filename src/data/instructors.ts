import type { Instructor } from '@/types';

/** Perfis fictícios, criados apenas para a demonstração. */
export const instructors: Instructor[] = [
  {
    id: 'helena-duarte',
    name: 'Helena Duarte',
    initials: 'HD',
    role: 'Engenheira de front-end sênior',
    bio: 'Lidera times de interface e ensina a transformar protótipos em produtos mantíveis.',
    expertise: ['React', 'TypeScript', 'Acessibilidade'],
    tone: 'primary',
  },
  {
    id: 'rafael-moura',
    name: 'Rafael Moura',
    initials: 'RM',
    role: 'Cientista de dados',
    bio: 'Combina estatística aplicada e engenharia para levar análises e modelos à rotina das equipes.',
    expertise: ['Python', 'SQL', 'IA generativa'],
    tone: 'mint',
  },
  {
    id: 'camila-teixeira',
    name: 'Camila Teixeira',
    initials: 'CT',
    role: 'Designer e gestora de produto',
    bio: 'Atua com descoberta de produto e sistemas de design em empresas de educação e finanças.',
    expertise: ['Figma', 'Pesquisa', 'Estratégia de produto'],
    tone: 'accent',
  },
  {
    id: 'bruno-anselmo',
    name: 'Bruno Anselmo',
    initials: 'BA',
    role: 'Especialista em segurança de aplicações',
    bio: 'Ajuda equipes a incorporar segurança ao ciclo de desenvolvimento sem travar as entregas.',
    expertise: ['AppSec', 'Modelagem de ameaças', 'DevSecOps'],
    tone: 'amber',
  },
];

export const instructorById = (id: string): Instructor | undefined => instructors.find((i) => i.id === id);
