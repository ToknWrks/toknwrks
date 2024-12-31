"use client"

import PageIllustration from "@/components/page-illustration";
import dynamic from 'next/dynamic';
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";

const Swaps = dynamic(() => import('@/components/leap'), { ssr: false });

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Swaps />
    
    </>
  );
}
