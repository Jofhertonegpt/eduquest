import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Learning Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Your journey to knowledge starts here
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            {
              title: "Interactive Learning",
              description: "Engage with dynamic content and real-time feedback",
            },
            {
              title: "Track Progress",
              description: "Monitor your learning journey with detailed analytics",
            },
            {
              title: "Community",
              description: "Connect with peers and share your knowledge",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <GlassPanel className="p-6 text-center hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Animated Cat */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-20 flex justify-center"
        >
          <div className="cat-container">
            <style jsx>{`
              .cat-container {
                position: relative;
                width: 200px;
                height: 200px;
              }
              .cat {
                position: relative;
                width: 100%;
                height: 100%;
              }
              .ear {
                position: absolute;
                width: 30px;
                height: 40px;
                background: #4a5568;
                border-radius: 50% 50% 0 0;
              }
              .ear--left {
                left: 40px;
                transform-origin: 50% 100%;
                animation: earWiggle 1s infinite;
              }
              .ear--right {
                right: 40px;
                transform-origin: 50% 100%;
                animation: earWiggle 1s infinite reverse;
              }
              .face {
                position: absolute;
                top: 40px;
                width: 100%;
                height: 120px;
                background: #4a5568;
                border-radius: 50%;
              }
              .eye {
                position: absolute;
                top: 40px;
                width: 30px;
                height: 30px;
                background: #fff;
                border-radius: 50%;
                animation: blink 3s infinite;
              }
              .eye--left {
                left: 45px;
              }
              .eye--right {
                right: 45px;
              }
              .eye-pupil {
                position: absolute;
                top: 25%;
                left: 25%;
                width: 50%;
                height: 50%;
                background: #000;
                border-radius: 50%;
                animation: look 5s infinite;
              }
              .muzzle {
                position: absolute;
                top: 60%;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 10px;
                background: #pink;
                border-radius: 50%;
              }
              @keyframes earWiggle {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(5deg); }
              }
              @keyframes blink {
                0%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0); }
              }
              @keyframes look {
                0%, 45%, 55%, 100% { transform: translate(0, 0); }
                50% { transform: translate(10px, 0); }
              }
            `}</style>
            <div className="cat">
              <div className="ear ear--left"></div>
              <div className="ear ear--right"></div>
              <div className="face">
                <div className="eye eye--left">
                  <div className="eye-pupil"></div>
                </div>
                <div className="eye eye--right">
                  <div className="eye-pupil"></div>
                </div>
                <div className="muzzle"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;