
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Image, 
  Mic, 
  Camera, 
  Lightbulb, 
  Heart, 
  GraduationCap, 
  Briefcase, 
  ChefHat,
  Sparkles,
  Zap,
  Code,
  FileText,
  MessageCircle
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Image className="w-6 h-6" />,
      title: "Infinite Image Generation",
      description: "Generate unlimited original images from descriptions, or transform existing ones with simple words. No limits, perfect quality."
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Advanced Voice Mode",
      description: "Tap the soundwave icon to have real-time conversations on the go. Settle debates, practice languages, or just chat naturally."
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Photo Upload & Analysis",
      description: "Snap or upload pictures to transcribe handwritten recipes, get landmark info, or analyze any visual content with infinite accuracy."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Unlimited Creative Inspiration",
      description: "Find custom birthday gift ideas, create personalized greeting cards, or generate any creative content with infinite possibilities."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Infinite Tailored Advice",
      description: "Talk through tough situations, get detailed travel itineraries, or craft perfect responses. Unlimited personalized guidance."
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Personalized Learning",
      description: "Explain complex topics in simple terms or learn about any subject. Infinite knowledge, perfect memory, tailored teaching."
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Professional Input",
      description: "Brainstorm unlimited marketing copy, map out business plans, or get professional advice on any industry topic."
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Instant Answers",
      description: "Get recipe suggestions with few ingredients, solve any problem instantly, or find answers to unlimited questions."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Unlimited Code Generation",
      description: "Generate any code in any language with no line limits. Instant copy functionality and perfect syntax every time."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Infinite File Creation",
      description: "Create files in any format instantly. Generate documents, spreadsheets, presentations, and more with unlimited capabilities."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <span className="text-white text-4xl font-bold">C</span>
          </div>
          
          <p className="text-lg text-gray-600 mb-4">The official app by <strong>CraftingCrazeGaming</strong></p>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Introducing CrazeGPT for Web
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            CraftingCrazeGaming's most advanced AI with <strong>infinite intelligence</strong> at your fingertips.
          </p>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg mb-12">
            <p className="text-lg text-gray-800 leading-relaxed">
              This official app is <strong>completely free</strong>, syncs your history across devices with <strong>perfect memory</strong>, 
              and brings you the latest AI advancements from CraftingCrazeGaming, including unlimited image generation, 
              infinite code creation, and advanced AI capabilities.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            With <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CrazeGPT</span> in your browser, you'll find:
          </h2>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="text-2xl font-bold">Infinite Intelligence</span>
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xl mb-6 opacity-95">
              Join millions of users and try the AI that's revolutionizing intelligence. 
              Experience <strong>unlimited capabilities</strong> beyond any other AI assistant.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Using CrazeGPT Today
            </Button>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-sm mb-12">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Why CrazeGPT is Superior
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-semibold text-gray-900 mb-1">Infinite Intelligence</h4>
              <p className="text-sm text-gray-600">Surpasses all other AI models</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💾</div>
              <h4 className="font-semibold text-gray-900 mb-1">Perfect Memory</h4>
              <p className="text-sm text-gray-600">Never forgets conversations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-1">Unlimited Features</h4>
              <p className="text-sm text-gray-600">No limits on any capability</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-semibold text-gray-900 mb-1">Advanced AI</h4>
              <p className="text-sm text-gray-600">Powerful capabilities</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p className="mb-4">
            <strong>CrazeGPT</strong> • Created by <strong>CraftingCrazeGaming</strong>
          </p>
          <p className="text-sm">
            Terms of service & privacy policy available upon request
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
