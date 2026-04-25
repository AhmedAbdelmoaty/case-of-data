import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flag, LogOut, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface CompletedPlayer {
  id: string;
  first_name: string;
  last_name: string;
  completed_at: string;
}

const AdminBoard = () => {
  const { session, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<CompletedPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session || !isAdmin) {
      navigate("/admin/login", { replace: true });
    }
  }, [session, isAdmin, authLoading, navigate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("completed_players")
      .select("*")
      .order("completed_at", { ascending: true });
    if (!error && data) setPlayers(data as CompletedPlayer[]);
    setLoading(false);
  };

  useEffect(() => {
    if (session && isAdmin) load();
  }, [session, isAdmin]);

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
    <div className="min-h-screen bg-background py-8 px-4">
      <motion.div
        className="max-w-xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Flag className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Completed Players</h1>
              <p className="text-xs text-muted-foreground">Admin View</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              title="تحديث"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
              title="تسجيل خروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">جاري التحميل...</div>
          ) : players.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              لسه مفيش لاعبين خلصوا اللعبة.
            </div>
          ) : (
            <ol className="divide-y divide-border">
              {players.map((p, i) => (
                <motion.li
                  key={p.id}
                  className="flex items-center gap-4 px-5 py-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <span className="w-8 text-sm font-mono text-muted-foreground tabular-nums">
                    {i + 1}.
                  </span>
                  <span className="text-foreground font-medium" dir="auto">
                    {p.first_name} {p.last_name}
                  </span>
                </motion.li>
              ))}
            </ol>
          )}
        </div>

        {players.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            إجمالي: {players.length}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminBoard;
