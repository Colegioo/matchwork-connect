import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, LogOut, Sparkles } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            JobMatch
          </h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Bem-vindo ao JobMatch!</CardTitle>
              <CardDescription className="text-lg mt-2">
                Sua plataforma de matching entre empresas e talentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Para Empresas</CardTitle>
                    <CardDescription>
                      Encontre candidatos qualificados através de matching inteligente
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-success/20 hover:border-success/40 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-success" />
                    </div>
                    <CardTitle>Para Candidatos</CardTitle>
                    <CardDescription>
                      Descubra vagas que combinam com seu perfil profissional
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-lg p-8 text-center border-2 border-primary/20">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Descubra Vagas Perfeitas para Você!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Navegue por vagas recomendadas com base no seu perfil e preferências
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/discover")}
                  className="gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Começar a Explorar
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Você está logado como: <span className="font-semibold text-foreground">{user.email}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
