import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CompanySignup from "@/components/auth/CompanySignup";
import CandidateSignup from "@/components/auth/CandidateSignup";
import CompanyLogin from "@/components/auth/CompanyLogin";
import CandidateLogin from "@/components/auth/CandidateLogin";
import { Users, Building2 } from "lucide-react";

const Auth = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [userType, setUserType] = useState<"company" | "candidate">("candidate");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-success/5 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            JobMatch
          </CardTitle>
          <CardDescription className="text-base">
            Conectando talentos com oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setUserType("candidate")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userType === "candidate"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">Candidato</p>
                  <p className="text-xs text-muted-foreground mt-1">Procurando emprego</p>
                </button>
                <button
                  onClick={() => setUserType("company")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userType === "company"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                >
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <p className="font-semibold text-sm">Empresa</p>
                  <p className="text-xs text-muted-foreground mt-1">Buscando talentos</p>
                </button>
              </div>

              <TabsContent value="login" className="mt-0">
                {userType === "company" ? <CompanyLogin /> : <CandidateLogin />}
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                {userType === "company" ? <CompanySignup /> : <CandidateSignup />}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
