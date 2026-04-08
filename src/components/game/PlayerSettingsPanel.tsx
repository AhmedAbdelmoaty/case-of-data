import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, User, LogOut, RotateCcw, Building2, Volume2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SoundToggle } from "./SoundToggle";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";

interface PlayerSettingsPanelProps {
  onReplayBriefing: () => void;
  onResetProgress: () => void;
}

export const PlayerSettingsPanel = ({ onReplayBriefing, onResetProgress }: PlayerSettingsPanelProps) => {
  const { profile, signOut, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile?.display_name || "");
  const [editGender, setEditGender] = useState<"male" | "female">(profile?.gender as any || "male");
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    await updateProfile({
      display_name: editName.trim(),
      gender: editGender,
      avatar_choice: editGender === "male" ? "analyst" : "sara",
    });
    setSaving(false);
    setIsEditingProfile(false);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    onResetProgress();
    setConfirmReset(false);
    setIsOpen(false);
  };

  const avatarImg = profile?.gender === "female" ? saraImg : analystImg;

  return (
    <>
      {/* Settings button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-card/80 backdrop-blur-md border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        title="الإعدادات"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); setIsEditingProfile(false); setConfirmReset(false); }}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-r border-border z-[61] overflow-y-auto"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-foreground font-bold text-lg">⚙️ الإعدادات</h2>
                <button
                  onClick={() => { setIsOpen(false); setIsEditingProfile(false); setConfirmReset(false); }}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player profile section */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                    <img src={avatarImg} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-foreground font-bold">{profile?.display_name}</p>
                    <p className="text-muted-foreground text-xs">
                      {profile?.gender === "female" ? "محللة بيانات" : "محلل بيانات"}
                    </p>
                  </div>
                </div>

                {isEditingProfile ? (
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="الاسم"
                      dir="rtl"
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex gap-2">
                      {[
                        { id: "male" as const, label: "محلل", img: analystImg },
                        { id: "female" as const, label: "محللة", img: saraImg },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setEditGender(opt.id)}
                          className={`flex-1 flex items-center gap-2 p-2 rounded-lg border transition-all ${
                            editGender === opt.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <img src={opt.img} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <span className={`text-xs font-bold ${editGender === opt.id ? "text-primary" : "text-muted-foreground"}`}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving || !editName.trim()}
                        className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50"
                      >
                        {saving ? "جاري الحفظ..." : "حفظ"}
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3 py-2 rounded-lg bg-muted text-muted-foreground text-sm"
                      >
                        إلغاء
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => {
                      setEditName(profile?.display_name || "");
                      setEditGender(profile?.gender as any || "male");
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-2 text-primary text-sm hover:underline"
                  >
                    <User className="w-4 h-4" />
                    تعديل البروفايل
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 space-y-2">
                {/* Replay briefing */}
                <button
                  onClick={() => {
                    onReplayBriefing();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-foreground transition-colors text-right"
                >
                  <Building2 className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-bold">مكتب الشركة</p>
                    <p className="text-xs text-muted-foreground">إعادة مشاهدة اجتماع Pinnacle Consulting</p>
                  </div>
                </button>

                {/* Reset progress */}
                <button
                  onClick={handleReset}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-right ${
                    confirmReset
                      ? "bg-destructive/10 border border-destructive/30"
                      : "hover:bg-muted"
                  }`}
                >
                  <RotateCcw className={`w-5 h-5 ${confirmReset ? "text-destructive" : "text-muted-foreground"}`} />
                  <div>
                    <p className={`text-sm font-bold ${confirmReset ? "text-destructive" : "text-foreground"}`}>
                      {confirmReset ? "اضغط تاني للتأكيد" : "إعادة من البداية"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {confirmReset ? "هيتم مسح كل التقدم!" : "ابدأ اللعبة من الأول"}
                    </p>
                  </div>
                </button>

                {/* Logout */}
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 text-foreground transition-colors text-right"
                >
                  <LogOut className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-sm font-bold">تسجيل الخروج</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
