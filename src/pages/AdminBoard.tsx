import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, LogOut, RotateCcw, Crown, Medal, Sparkles, Zap, Star, Flame, Rocket } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface CompletedPlayer {
  id: string;
  first_name: string;
  last_name: string;
  completed_at: string;
  duration_ms: number | null;
  qualified: boolean;
}

const formatDuration = (ms: number | null) => {
  if (!ms || ms < 0) return "—";
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];
const REST_EMOJIS = ["⭐", "🔥", "⚡", "💎", "🚀", "✨", "🎯", "🌟"];
const REST_ICONS = [Star, Flame, Zap, Sparkles, Rocket];

const AdminBoard = () => {
  const { session, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<CompletedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session || !isAdmin) navigate("/admin/login", { replace: true });
  }, [session, isAdmin, authLoading, navigate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("completed_players")
      .select("id, first_name, last_name, completed_at, duration_ms, qualified")
      .eq("qualified", true)
      .order("duration_ms", { ascending: true })
      .limit(100);
    if (!error && data) setPlayers(data as CompletedPlayer[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!session || !isAdmin) return;
    load();

    const channel = supabase
      .channel("leaderboard-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "completed_players" },
        (payload) => {
          const row = payload.new as CompletedPlayer;
          if (!row.qualified) return;
          setPlayers((prev) => {
            if (prev.find((p) => p.id === row.id)) return prev;
            const next = [...prev, row].sort(
              (a, b) => (a.duration_ms ?? Infinity) - (b.duration_ms ?? Infinity)
            );
            return next.slice(0, 100);
          });
          setNewId(row.id);
          setTimeout(() => setNewId((cur) => (cur === row.id ? null : cur)), 4000);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "completed_players" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, isAdmin]);

  const handleReset = async () => {
    setShowResetConfirm(false);
    const { error } = await supabase.from("completed_players").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) console.warn("Reset failed:", error.message);
    setPlayers([]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (authLoading || !session || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_hsl(220_50%_15%),_hsl(220_60%_5%))] text-foreground">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-amber-500/10 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-fuchsia-500/10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[30%] right-[20%] w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 lg:py-10">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3" dir="rtl">
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <Trophy className="w-10 h-10 lg:w-14 lg:h-14 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent tracking-tight">
                لوحة الأبطال
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <motion.span
                  className="inline-block w-2 h-2 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="text-xs lg:text-sm font-bold text-red-400 tracking-widest">LIVE</span>
                <span className="text-xs text-muted-foreground mx-2">•</span>
                <span className="text-xs lg:text-sm text-muted-foreground">{players.length} بطل</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all font-bold text-sm"
              title="إعادة تعيين"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline">RESET</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
              title="خروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground animate-pulse">جاري التحميل...</div>
        ) : players.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              🏆
            </motion.div>
            <p className="text-lg text-muted-foreground">في انتظار أول بطل...</p>
          </motion.div>
        ) : (
          <ol className="space-y-3" dir="rtl">
            <AnimatePresence initial={false}>
              {players.map((p, i) => (
                <PlayerRow key={p.id} player={p} rank={i} isNew={newId === p.id} />
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>

      {/* Reset confirm */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              className="bg-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold mb-2">إعادة تعيين القائمة؟</h3>
              <p className="text-sm text-muted-foreground mb-5">
                هتمسح كل اللاعبين من اللوحة. ده الإجراء ده مش بيرجع.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 font-bold text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm"
                >
                  مسح الكل
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============== Row ==============
const PlayerRow = ({
  player,
  rank,
  isNew,
}: {
  player: CompletedPlayer;
  rank: number;
  isNew: boolean;
}) => {
  const isFirst = rank === 0;
  const isPodium = rank < 3;
  const fullName = `${player.first_name} ${player.last_name}`;

  // Pick a stable rest emoji based on id
  const restEmoji = useMemo(() => {
    const seed = player.id.charCodeAt(0) + player.id.charCodeAt(1);
    return REST_EMOJIS[seed % REST_EMOJIS.length];
  }, [player.id]);
  const RestIcon = useMemo(() => {
    const seed = player.id.charCodeAt(2) + player.id.charCodeAt(3);
    return REST_ICONS[seed % REST_ICONS.length];
  }, [player.id]);

  // Style per rank
  let cardClass = "bg-white/5 border-white/10";
  let nameClass = "text-foreground";
  let glow = "";
  if (isFirst) {
    cardClass =
      "bg-gradient-to-r from-amber-500/30 via-yellow-400/25 to-amber-500/30 border-amber-300/60";
    nameClass = "text-amber-50";
    glow = "shadow-[0_0_40px_-10px_rgba(251,191,36,0.7)]";
  } else if (rank === 1) {
    cardClass =
      "bg-gradient-to-r from-slate-300/20 via-slate-200/15 to-slate-300/20 border-slate-200/40";
    nameClass = "text-slate-50";
    glow = "shadow-[0_0_25px_-12px_rgba(226,232,240,0.5)]";
  } else if (rank === 2) {
    cardClass =
      "bg-gradient-to-r from-orange-700/25 via-amber-700/20 to-orange-700/25 border-orange-400/40";
    nameClass = "text-orange-50";
    glow = "shadow-[0_0_25px_-12px_rgba(251,146,60,0.5)]";
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        boxShadow: isNew
          ? [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 60px rgba(251,191,36,0.7)",
              "0 0 0px rgba(255,255,255,0)",
            ]
          : undefined,
      }}
      exit={{ opacity: 0, x: -40, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`relative rounded-2xl border backdrop-blur-sm overflow-hidden ${cardClass} ${glow} ${
        isFirst ? "p-5 lg:p-6" : isPodium ? "p-4 lg:p-5" : "p-3.5 lg:p-4"
      }`}
    >
      {/* Confetti-ish sparkles for #1 */}
      {isFirst && (
        <>
          <motion.div
            className="absolute top-2 left-4 text-amber-300"
            animate={{ y: [0, -6, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <motion.div
            className="absolute bottom-2 right-8 text-yellow-200"
            animate={{ y: [0, -8, 0], rotate: [0, -20, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </>
      )}

      <div className="flex items-center gap-3 lg:gap-4">
        {/* Rank badge */}
        <motion.div
          className={`flex-shrink-0 flex items-center justify-center font-black tabular-nums ${
            isFirst
              ? "w-16 h-16 lg:w-20 lg:h-20 text-4xl lg:text-5xl"
              : isPodium
              ? "w-14 h-14 text-3xl"
              : "w-11 h-11 text-xl bg-white/5 rounded-xl border border-white/10"
          }`}
          animate={
            isFirst
              ? { scale: [1, 1.08, 1], rotate: [0, -5, 5, 0] }
              : isPodium
              ? { y: [0, -3, 0] }
              : undefined
          }
          transition={{
            duration: isFirst ? 2.2 : 2.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {isPodium ? (
            <span className="drop-shadow-lg">{RANK_EMOJIS[rank]}</span>
          ) : (
            <span className="text-muted-foreground">{rank + 1}</span>
          )}
        </motion.div>

        {/* Crown for #1 */}
        {isFirst && (
          <motion.div
            className="flex-shrink-0"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <Crown className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.8)]" />
          </motion.div>
        )}

        {/* Name */}
        <div className="flex-1 min-w-0" dir="auto">
          <p
            className={`font-extrabold truncate ${
              isFirst
                ? "text-2xl lg:text-4xl"
                : isPodium
                ? "text-xl lg:text-2xl"
                : "text-base lg:text-lg"
            } ${nameClass}`}
            style={{ fontFamily: "'Cairo', 'Tajawal', system-ui, sans-serif" }}
          >
            {fullName}
          </p>
        </div>

        {/* Side emoji/icon for non-podium */}
        {!isPodium && (
          <motion.div
            className="flex-shrink-0 text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: rank * 0.1 }}
          >
            {restEmoji}
          </motion.div>
        )}

        {/* Time */}
        <div
          className={`flex-shrink-0 font-mono font-bold tabular-nums ${
            isFirst
              ? "text-3xl lg:text-4xl text-amber-100"
              : isPodium
              ? "text-2xl text-foreground"
              : "text-lg text-muted-foreground"
          }`}
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          {formatDuration(player.duration_ms)}
        </div>
      </div>
    </motion.li>
  );
};

export default AdminBoard;
