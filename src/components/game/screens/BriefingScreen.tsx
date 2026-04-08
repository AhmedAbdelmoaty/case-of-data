import { motion } from "framer-motion";
import storeFrontImg from "@/assets/scenes/store-front.png";

interface BriefingScreenProps {
  onNavigate: (screen: string) => void;
}

export const BriefingScreen = ({ onNavigate }: BriefingScreenProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      </div>

      <motion.div
        className="relative z-10 max-w-lg mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-5xl mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          🔍
        </motion.div>

        <h1 className="text-2xl font-bold text-foreground mb-4">هيا نبدأ التحليل</h1>

        <p className="text-muted-foreground text-sm leading-relaxed mb-8" dir="rtl">
          ابدأ بالبيانات، خد فكرة عامة عن اللي اتغير الأسبوع ده.
          <br />
          دور في الأدلة والبيانات وقابل فريق العمل… وحاول توصل للسبب الحقيقي.
        </p>

        <motion.button
          onClick={() => onNavigate("dashboard")}
          className="px-8 py-3 rounded-xl font-bold text-lg text-primary-foreground"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚀 تابع التحليل
        </motion.button>
      </motion.div>
    </div>
  );
};
