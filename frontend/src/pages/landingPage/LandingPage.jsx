import React from "react";
import Navbar from "../../components/landingPage/Navbar";
import Hero from "../../components/landingPage/Hero";
import TrustedCompanies from "../../components/landingPage/TrustedCompanies";
import JobSeekersEmployers from "../../components/landingPage/JobSeekersEmployers";
import About from "../../components/landingPage/About";
import CTA from "../../components/landingPage/CTA";
import Pricing from "../../components/landingPage/Pricing";
import Contact from "../../components/landingPage/Contact";
import Footer from "../../components/landingPage/Footer";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <JobSeekersEmployers />
      <About />
      <CTA />
      <Pricing />
      <Contact />
      <Footer />
    </>
  );
};

export default LandingPage;
