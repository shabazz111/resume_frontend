import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ArrowRight, CheckCircle } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    "ATS-Friendly Templates",
    "Professional Formatting",
    "AI-Powered Suggestions",
    "Instant PDF Download",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <FileText className="h-12 w-12 text-blue-800" />
              <span className="text-3xl font-bold text-blue-800">ResumeAI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Create Your Professional
              <span className="text-blue-800 block mt-2">
                Resume in Minutes
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Stand out from the crowd with our AI-powered resume builder.
              Generate an ATS-friendly resume that gets you more interviews.
            </p>

            <motion.button
              onClick={() => navigate("/resume")}
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-800 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 mb-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="bg-white p-4 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-blue-800" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
