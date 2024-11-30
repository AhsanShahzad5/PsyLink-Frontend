import React, { useState } from "react";
import Spline from '@splinetool/react-spline';
import { useNavigate } from "react-router-dom";

const teamMembers = [
    {
      name: "John Carter",
      designation: "CEO & CO-FOUNDER",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
      image: "/src/assets/patient/landingPage/man.png",
      social: [
        { icon: "/src/assets/patient/landingPage/Facebook.png", alt: "Facebook" },
        { icon: "/src/assets/patient/landingPage/Twitter.png", alt: "Twitter" },
        { icon: "/src/assets/patient/landingPage/LinkedIn.png", alt: "LinkedIn" },
        { icon: "/src/assets/patient/landingPage/Instagram.png", alt: "Instagram" },
      ],
    },
    {
      name: "Sophie Moore",
      designation: "DENTAL SPECIALIST",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
      image: "/src/assets/patient/landingPage/man.png",
      social: [
        { icon: "/src/assets/patient/landingPage/Facebook.png", alt: "Facebook" },
        { icon: "/src/assets/patient/landingPage/Twitter.png", alt: "Twitter" },
        { icon: "/src/assets/patient/landingPage/LinkedIn.png", alt: "LinkedIn" },
        { icon: "/src/assets/patient/landingPage/Instagram.png", alt: "Instagram" },
      ],
    },
    {
      name: "Matt Cannon",
      designation: "ORTHOPEDIC",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
      image: "/src/assets/patient/landingPage/man.png",
      social: [
        { icon: "/src/assets/patient/landingPage/Facebook.png", alt: "Facebook" },
        { icon: "/src/assets/patient/landingPage/Twitter.png", alt: "Twitter" },
        { icon: "/src/assets/patient/landingPage/LinkedIn.png", alt: "LinkedIn" },
        { icon: "/src/assets/patient/landingPage/Instagram.png", alt: "Instagram" },
      ],
    },
  ];

const LandingPage: React.FC = () => {
    
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    
  return (

    <div
      className="fixed top-0 left-0 right-0 z-10 w-full bg-transparent shadow-md"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      
      
      <div
      className="w-full h-auto p-4"
      style={{
        background: "linear-gradient(360deg, #064034 60%, #047D72 100%)",
      }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-[#549d95] w-full h-[60px] rounded-lg border-b border-gray-200 px-4 sm:px-8">
        <div className="flex items-center space-x-3">
          <img
            src="/src/assets/patient/homePage/Logo.png"
            alt="PsyLink Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <span className="text-lg sm:text-xl font-bold text-[#fff]">
            PsyLink
          </span>
        </div>
        {/* Menu button for small screens */}
        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        {/* Hidden Links for large screens */}
        <div className="hidden sm:flex space-x-4 sm:space-x-20 text-[#fff] text-sm sm:text-lg">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#resources" className="hover:underline">Resources</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
        <div className="hidden sm:flex items-center gap-0">
          {/* Login and Sign Up Buttons for large screens */}
          <button className="font-outfit font-bold text-[25.2px] leading-[30.24px] text-black hover:underline"
                  onClick={() => navigate('/login')}>
            Login
          </button>
          <span className="mx-5 text-black text-[24px]">•</span>
          <button className="font-outfit font-normal text-[22.05px] leading-[27.78px] text-white bg-[#131114] py-[7.75px] px-[20.25px] rounded-[94px] hover:bg-[#0c0c0c] mr-2"
          
          onClick={() => navigate('/sign-up')}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`${isOpen ? 'block' : 'hidden'} fixed z-10 inset-0 overflow-hidden`}>
        <div className="absolute inset-0 overflow-hidden">
          <section className="absolute inset-y-0 left-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                    <div className="-mr-2">
                      <button onClick={() => setIsOpen(false)}>
                        <span className="text-3xl font-extrabold text-gray-700">×</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative flex-1 py-6 px-4 sm:px-6">
                  {/* Sidebar content */}
                  <nav className="flex flex-col space-y-4">
                    <a href="#features" className="text-gray-900 hover:underline">Features</a>
                    <a href="#about" className="text-gray-900 hover:underline">About</a>
                    <a href="#resources" className="text-gray-900 hover:underline">Resources</a>
                    <a href="#contact" className="text-gray-900 hover:underline">Contact</a>
                    {/* Login and Sign Up Buttons for small screens */}
                    <button onClick={() => navigate('/patient/Home')} className="w-full text-white bg-[#131114] p-2 rounded hover:bg-[#0c0c0c]">
                      Login
                    </button>
                    <button className="w-full text-white bg-[#131114] p-2 rounded hover:bg-[#0c0c0c]">
                      Sign Up
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

     {/* Main Content */}
     <div className="flex flex-col lg:flex-row mt-8 lg:mt-16 items-center lg:items-start">
          {/* Left Content */}
          <div className="flex flex-col w-full lg:w-[400px] px-4 sm:px-6 lg:px-12 text-center lg:text-left">
            <h1 className="text-[36px] sm:text-[48px] lg:text-[60px] font-extrabold leading-tight text-[#fff]">
              Hope, Heal, <br /> Thrive!
            </h1>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-[#fff] leading-relaxed">
              Connecting you to compassionate care, anytime, anywhere – Welcome
              to Psylink, your gateway to mental well-being.
            </p>
            <div className="flex justify-center lg:justify-start mb-10">
              <button className="mt-6 py-2 px-4 sm:px-6 bg-[#000] text-[#fff] text-sm sm:text-md font-bold rounded-xl hover:bg-[#345956] flex items-center"
                onClick={ () => navigate('/login')}
              >
                GET STARTED!
                <img
                  src="/src/assets/patient/landingPage/RightArrow.png"
                  alt="Right Arrow"
                  className="w-6 h-6 sm:w-[40px] sm:h-[40px] object-cover ml-2"
                />
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex w-full lg:w-auto justify-center lg:justify-end mt-8 lg:mt-0 space-x-2">
            <img
              src="/src/assets/patient/landingPage/landing1.png"
              alt="Group Session"
              className="w-[120px] sm:w-[200px] lg:w-[380px] h-[140px] sm:h-[280px] lg:h-[400px] object-cover rounded-lg"
            />
            <img
              src="/src/assets/patient/landingPage/landing2.png"
              alt="Personal Therapy"
              className="w-[120px] sm:w-[200px] lg:w-[380px] h-[140px] sm:h-[280px] lg:h-[400px] object-cover rounded-lg"
            />
            <img
              src="/src/assets/patient/landingPage/landing3.png"
              alt="Writing Therapy"
              className="w-[120px] sm:w-[200px] lg:w-[380px] h-[140px] sm:h-[280px] lg:h-[400px] object-cover rounded-lg"
            />
          </div>
        </div>

    




      </div>






    {/* Features Section */}
<div className="flex flex-col items-center justify-center w-full sm:w-[485px] h-[181px] bg-transparent rounded-[50px] mt-16 mx-auto">
  {/* Features Button */}
  <button className="px-6 sm:px-10 py-2 text-white font-outfit font-normal text-xl sm:text-2xl leading-tight sm:leading-[41.58px] rounded-full flex items-center justify-center" style={{
    background: "linear-gradient(270deg, #064034 60%, #047D72 100%)",
  }}>
    Features
  </button>

  {/* Why Are We Better than Others? */}
  <p className="mt-6 font-outfit font-normal text-lg sm:text-[33px] leading-tight sm:leading-[41.58px] text-black text-center">
    Why Are We Better than Others?
  </p>
</div>




<div className="w-full max-w-[1648px] mx-auto p-8 sm:px-24 space-y-10">
  {/* AI Chat Support Section */}
  <div className="bg-white rounded-xl p-8 sm:px-12 space-y-4">
    <h2 className="font-outfit font-bold text-2xl sm:text-3xl leading-tight sm:leading-[47.88px] text-center mb-4">
      AI Chat Support
    </h2>
    <div className="flex justify-center items-center h-full">
      <img
        src="/src/assets/patient/landingPage/ChatAI.png"
        alt="Online Doctor Icon"
        className="w-[50px] h-[50px] mr-4"
      />
    </div>
    <p className="font-outfit font-normal text-xl sm:text-2xl leading-tight sm:leading-[41.58px] text-center">
      Introducing <strong>Allen</strong>, Psylink’s AI chatbot designed to
      help you vent your frustrations in a safe, supportive space. Allen
      listens with empathy, offering calming and compassionate responses to
      make sure you feel heard and never alone. Whether you're stressed or
      overwhelmed, Allen is here to provide comforting words and a sense of
      connection whenever you need it.
    </p>
  </div>

  {/* Online Doctor Consultation and E-Prescription Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-6 sm:space-y-0">
    {/* Online Doctor Consultation */}
    <div className="bg-white rounded-2xl p-8 space-y-4">
      <div className="flex items-center mb-4">
        <img
          src="/src/assets/patient/landingPage/Phone.png"
          alt="Online Doctor Icon"
          className="w-[50px] h-[50px] mr-4"
        />
        <h2 className="font-outfit font-bold text-2xl sm:text-3xl leading-tight sm:leading-[47.88px]">
          Online Doctor Consultation
        </h2>
      </div>
      <p className="font-outfit font-normal text-xl sm:text-2xl leading-tight sm:leading-[41.58px]">
        Anonymous Doctor Consultation lets you connect with mental health
        professionals securely, ensuring privacy and support without
        revealing your identity.
      </p>
    </div>

    {/* E-Prescription */}
    <div className="bg-white rounded-2xl p-8 space-y-4">
      <div className="flex items-center mb-4">
        <img
          src="/src/assets/patient/landingPage/E-prescription.png"
          alt="E-Prescription Icon"
          className="w-[50px] h-[50px] mr-4"
        />
        <h2 className="font-outfit font-bold text-2xl sm:text-3xl leading-tight sm:leading-[47.88px]">
          E-Prescription
        </h2>
      </div>
      <p className="font-outfit font-normal text-xl sm:text-2xl leading-tight sm:leading-[41.58px]">
        You can receive prescriptions from licensed doctors after a
        consultation, all from the comfort of your home. Convenient, fast,
        and fully digital, ensuring you care without hassle.
      </p>
    </div>
  </div>

  {/* Psylink Community Section */}
  <div className="bg-white rounded-2xl p-8 space-y-4">
    <h2 className="font-outfit font-bold text-2xl sm:text-3xl leading-tight sm:leading-[47.88px] text-center mb-4">
      Psylink Community - Psync
    </h2>
    <div className="flex justify-center items-center h-full">
      <img
        src="/src/assets/patient/landingPage/Community.png"
        alt="Online Doctor Icon"
        className="w-[50px] h-[50px] mr-4"
      />
    </div>
    <p className="font-outfit font-normal text-xl sm:text-2xl leading-tight sm:leading-[41.58px] text-center">
      Our Community Support feature is a safe space where individuals can
      openly share their mental health journeys and experiences. It’s a
      place to find encouragement, connect with others, and offer support,
      creating a strong network of understanding and care.
    </p>
  </div>
</div>





   {/* About Section */}
<div className="flex flex-col items-center justify-center w-full sm:w-[485px] h-[181px] bg-transparent rounded-[50px] mx-auto">
  {/* About Button */}
  <button className="px-6 sm:px-10 py-2 text-white font-outfit font-normal text-xl sm:text-2xl leading-tight sm:leading-[41.58px] rounded-full flex items-center justify-center" style={{
    background: "linear-gradient(270deg, #064034 60%, #047D72 100%)",
  }}>
    About
  </button>
</div>





<div className="flex flex-col lg:flex-row items-start bg-white rounded-xl p-8 shadow-md max-w-[1648px] mx-auto lg:mx-10">
  {/* Left Div */}
  <div className="w-full lg:w-1/2 space-y-6">
    {/* Top Section: Logo and Text */}
    <div className="flex items-center space-x-4 mb-6">
      <img
        src="/src/assets/patient/homePage/Logo.png"
        alt="PsyLink Logo"
        className="w-[50px] h-[50px]"
      />
      <h1 className="font-outfit font-bold text-2xl leading-[47.88px]">
        PsyLink
      </h1>
    </div>

    {/* Bottom Section: Long Text */}
    <div>
      <p className="font-outfit font-normal text-xl text-left leading-[41.58px]">
        We are committed to making mental healthcare accessible,
        supportive, and stigma-free for everyone.
      </p>
      <p className="font-outfit font-normal text-xl text-left leading-[41.58px] mt-4">
        Our platform offers a range of tools, including Anonymous Online
        Doctor Consultations, to provide professional guidance without fear
        of judgment. We aim to break the stigma surrounding mental health
        by allowing users to seek help privately, creating a space where
        everyone can prioritize their mental well-being without hesitation.
      </p>
      <p className="font-outfit font-normal text-xl text-left leading-[41.58px] mt-4">
        Whether you need a safe place to vent, compassionate AI support, or
        connection within a caring community, Psylink is here to empower
        you on your journey to better mental health. Compassionate care,
        anytime, anywhere.
      </p>
    </div>
  </div>

  {/* Right Div: Empty Space for Image */}
  <div className="w-full lg:w-1/2 flex justify-center items-center mt-10 lg:mt-0">
    <div className="w-full h-[300px] lg:h-[500px] border border-dashed border-gray-400 rounded-lg flex items-center justify-center overflow-hidden relative">
      <div className="w-[95%] h-[95%] translate-x-[5%]">
      <Spline
          scene="https://prod.spline.design/Vk2WhhCLdgXrP0ub/scene.splinecode"
          className="w-full h-full"
      />
      </div>
    </div>
  </div>
</div>




{/* Meet our team Section */}
<div className="flex flex-col items-center justify-center w-full sm:w-[485px] h-[181px] bg-transparent rounded-[50px] mt-16 mx-auto">
  {/* Meet our team Button */}
  <button className="px-6 sm:px-10 py-2 text-white font-outfit font-normal text-xl sm:text-2xl leading-tight sm:leading-[41.58px] rounded-full flex items-center justify-center" style={{
    background: "linear-gradient(270deg, #064034 60%, #047D72 100%)",
  }}>
    Meet our team
  </button>

  {/* Welcome Text */}
  <p className="mt-6 font-outfit font-normal text-xl sm:text-2xl leading-tight sm:leading-[41.58px] text-black text-center">
    Welcome to our prestigious members who made PsyLink a real world application.
  </p>
</div>





<div className="bg-transparent py-10">
  <div className="container mx-auto flex flex-wrap justify-center gap-8">
    {teamMembers.map((member, index) => (
      <div
        key={index}
        className="bg-white shadow-md rounded-lg p-6 w-full sm:w-[300px] flex flex-col items-center text-center"
      >
        {/* Image */}
        <img
          src={member.image}
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />

        {/* Name */}
        <h3 className="font-outfit font-bold text-lg text-[#064034]">
          {member.name}
        </h3>

        {/* Designation */}
        <p className="font-outfit font-medium text-sm text-[#047D72] mb-4">
          {member.designation}
        </p>

        {/* Description */}
        <p className="font-outfit text-sm text-gray-600 mb-6">
          {member.description}
        </p>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          {member.social.map((social, i) => (
            <a key={i} href="#" className="w-6 h-6">
              <img
                src={social.icon}
                alt={social.alt}
                className="w-full h-full"
              />
            </a>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>






<div className="flex flex-col items-center justify-center bg-transparent py-16">
  {/* Title */}
  <h2 className="font-outfit font-bold text-3xl leading-[53.05px] text-center mb-8">
    Subscribe to our newsletter
  </h2>

  {/* Input and Button */}
  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 w-full px-4 sm:px-0">
    {/* Input Field */}
    <input
      type="email"
      placeholder="Enter your email"
      className="w-full sm:w-[484.97px] h-[55.39px] rounded-full px-6 text-[22.34px] font-dm-sans font-normal leading-[25.13px] placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
    />

    {/* Subscribe Button */}
    <button className="w-full sm:w-auto h-[56.26px] px-8 bg-[#047D72] text-white rounded-full font-dm-sans font-bold text-[22.34px] leading-[25.13px]">
      Subscribe
    </button>
  </div>
</div>






    <footer className="bg-gradient-to-r from-[#064034] to-[#047D72] text-white py-10 px-24">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-start space-y-10 lg:space-y-0">
        {/* Left Div */}
        <div className="flex flex-col space-y-4">
          {/* Logo and Text */}
          <div className="flex items-center space-x-2">
            <img
              src="/src/assets/patient/homePage/Logo.png"
              alt="PsyLink Logo"
              className="w-10 h-10"
            />
            <h1 className="font-outfit text-lg font-semibold">PsyLink</h1>
          </div>
          {/* Copyright */}
          <p className="font-outfit text-sm text-gray-300">
            Copyright © 2024 PsyLink | All Rights Reserved
          </p>
        </div>

        {/* Right Div */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-24">
          {/* Product Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-outfit font-bold text-lg">Product</h3>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Features
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Pricing
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Case studies
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Reviews
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Updates
            </a>
          </div>

          {/* Company Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-outfit font-bold text-lg">Company</h3>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              About
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Contact us
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Careers
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Culture
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Blog
            </a>
          </div>

          {/* Support Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-outfit font-bold text-lg">Support</h3>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Getting started
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Help center
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Server status
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Report a bug
            </a>
            <a href="#" className="text-gray-300 text-sm hover:text-white">
              Chat support
            </a>
          </div>

          {/* Follow Us Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-outfit font-bold text-lg">Follow us</h3>
            <a href="#" className="flex items-center space-x-2 text-gray-300 text-sm hover:text-white">
              <img src="/src/assets/patient/landingPage/Facebook2.png" alt="Facebook" className="w-4 h-4" />
              <span>Facebook</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 text-sm hover:text-white">
              <img src="/src/assets/patient/landingPage/Twitter2.png" alt="Twitter" className="w-4 h-4" />
              <span>Twitter</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 text-sm hover:text-white">
              <img src="/src/assets/patient/landingPage/Instagram2.png" alt="Instagram" className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 text-sm hover:text-white">
              <img src="/src/assets/patient/landingPage/LinkedIn2.png" alt="LinkedIn" className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 text-sm hover:text-white">
              <img src="/src/assets/patient/landingPage/Youtube2.png" alt="YouTube" className="w-4 h-4" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </footer>

    </div>
  );
};

export default LandingPage;
