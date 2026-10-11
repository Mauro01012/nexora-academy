import { Benefits } from '@/components/home/Benefits';
import { CallToAction } from '@/components/home/CallToAction';
import { Categories } from '@/components/home/Categories';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { Hero } from '@/components/home/Hero';
import { Instructors } from '@/components/home/Instructors';
import { StatsStrip } from '@/components/home/StatsStrip';
import { Testimonials } from '@/components/home/Testimonials';

export function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <FeaturedCourses />
      <Categories />
      <Benefits />
      <Instructors />
      <Testimonials />
      <CallToAction />
    </>
  );
}
