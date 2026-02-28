import React from 'react'
import { useState, useEffect, useRef } from "react";
import COLORS from '../constants/colors';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { HowItWorks } from '../components/HowItWorks';
import { WhyChoose } from '../components/WhyChoose';
import { CTA } from '../components/Cta';
import { Footer } from '../components/Footer';

function LandingPage() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <About/>
    <HowItWorks/>
    <WhyChoose/>
    <CTA/>
    <Footer/>
    </>
    
  )
}

export default LandingPage