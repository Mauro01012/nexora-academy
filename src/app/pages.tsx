import type { ComponentType } from 'react';
import type { RouteId } from '@/app/routes';
import { CourseDetail } from '@/pages/CourseDetail';
import { Enroll } from '@/pages/Enroll';
import { Courses } from '@/pages/Courses';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Logout } from '@/pages/Logout';
import { Signup } from '@/pages/Signup';
import { StudentArea } from '@/pages/StudentArea';

/**
 * Registro das páginas implementadas. Na próxima etapa, adicione aqui o painel
 * administrativo (e marque `implemented: true` em routes.ts).
 */
export const pages: Partial<Record<RouteId, ComponentType<{ params: Record<string, string> }>>> = {
  home: Home,
  courses: Courses,
  course: CourseDetail,
  enroll: Enroll,
  login: Login,
  signup: Signup,
  logout: Logout,
  student: StudentArea,
};
