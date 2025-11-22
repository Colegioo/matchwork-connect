import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Heart, X, RotateCcw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JobCard from "@/components/JobCard";
import { getJobRecommendations, recordSwipe } from "@/services/recommendationService";
import type { JobListing } from "@/services/recommendationService";

interface MatchScore {
  job: JobListing;
  score: number;
  reasons: string[];
}

const Discover = () => {
  const [user, setUser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<MatchScore[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        loadRecommendations(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadRecommendations = async (userId: string) => {
    setLoading(true);
    try {
      const recs = await getJobRecommendations(userId);
      setRecommendations(recs);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as recomendações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSwipe = async (isLike: boolean) => {
    if (!user || currentIndex >= recommendations.length) return;

    const currentJob = recommendations[currentIndex];
    
    // Animação de swipe
    setSwipeDirection(isLike ? 'right' : 'left');
    
    // Registrar swipe no banco
    const success = await recordSwipe(
      user.id,
      currentJob.job.company_id,
      currentJob.job.id,
      isLike
    );

    if (!success) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua escolha",
        variant: "destructive",
      });
    } else if (isLike) {
      toast({
        title: "Curtiu! ❤️",
        description: `Você demonstrou interesse em ${currentJob.job.job_title}`,
      });
    }

    // Aguardar animação e avançar
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const handleReset = () => {
    if (user) {
      loadRecommendations(user.id);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-lg text-muted-foreground">Carregando suas recomendações...</p>
        </div>
      </div>
    );
  }

  const currentJob = recommendations[currentIndex];
  const hasMoreJobs = currentIndex < recommendations.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            JobMatch
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              Descubra Vagas
            </h2>
            <p className="text-muted-foreground">
              Vagas recomendadas especialmente para você
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {hasMoreJobs ? (
                <>
                  Vaga {currentIndex + 1} de {recommendations.length}
                </>
              ) : (
                'Você viu todas as vagas disponíveis'
              )}
            </p>
          </div>

          {hasMoreJobs && currentJob ? (
            <div className="space-y-6">
              <div
                className={`transition-all duration-300 ${
                  swipeDirection === 'left'
                    ? 'opacity-0 -translate-x-full'
                    : swipeDirection === 'right'
                    ? 'opacity-0 translate-x-full'
                    : 'opacity-100 translate-x-0'
                }`}
              >
                <JobCard
                  job={currentJob.job}
                  matchScore={currentJob.score}
                  matchReasons={currentJob.reasons}
                />
              </div>

              <div className="flex justify-center items-center gap-6">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-16 h-16 rounded-full border-2 border-destructive hover:bg-destructive hover:text-white transition-all"
                  onClick={() => handleSwipe(false)}
                >
                  <X className="w-8 h-8" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-20 h-20 rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-lg"
                  onClick={() => handleSwipe(true)}
                >
                  <Heart className="w-10 h-10" />
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  <X className="w-4 h-4 inline mr-1" />
                  Não tenho interesse
                  <span className="mx-4">•</span>
                  <Heart className="w-4 h-4 inline mr-1" />
                  Tenho interesse
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 py-12">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Você viu todas as vagas!</h3>
                <p className="text-muted-foreground mb-6">
                  Não há mais recomendações disponíveis no momento.
                </p>
                <Button onClick={handleReset} size="lg" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Recarregar Recomendações
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discover;
