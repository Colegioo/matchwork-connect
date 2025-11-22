import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100),
  companyName: z.string().min(2, "Nome da empresa é obrigatório").max(255),
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ deve conter 14 dígitos"),
  location: z.string().min(2, "Localização é obrigatória").max(255),
  contactPhone: z.string().min(10, "Telefone inválido").max(20),
  companyVision: z.string().max(1000).optional(),
  companyValues: z.string().max(1000).optional(),
  jobTitle: z.string().min(2, "Título da vaga é obrigatório").max(255),
  jobDescription: z.string().min(10, "Descrição da vaga é obrigatória").max(2000),
  employmentType: z.enum(["freelance", "contract", "full_time"]),
  salaryType: z.enum(["hourly", "monthly"]),
  salaryMin: z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor inválido"),
  salaryMax: z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor inválido"),
  workloadHours: z.string().regex(/^\d+$/, "Carga horária inválida"),
  jobLocation: z.string().min(2, "Localização da vaga é obrigatória").max(255),
  requirements: z.string().max(1000).optional(),
  preferences: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

const CompanySignup = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employmentType: "full_time",
      salaryType: "monthly",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      const { error: companyError } = await supabase.from("companies").insert({
        user_id: authData.user.id,
        company_name: data.companyName,
        cnpj: data.cnpj,
        location: data.location,
        contact_email: data.email,
        contact_phone: data.contactPhone,
        company_vision: data.companyVision,
        company_values: data.companyValues,
      });

      if (companyError) throw companyError;

      const { data: companyData } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", authData.user.id)
        .single();

      if (companyData) {
        await supabase.from("job_listings").insert({
          company_id: companyData.id,
          job_title: data.jobTitle,
          job_description: data.jobDescription,
          employment_type: data.employmentType,
          salary_type: data.salaryType,
          salary_min: parseFloat(data.salaryMin),
          salary_max: parseFloat(data.salaryMax),
          workload_hours: parseInt(data.workloadHours),
          location: data.jobLocation,
          requirements: data.requirements,
          preferences: data.preferences,
        });
      }

      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao JobMatch",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha *</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Empresa *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="00000000000000" maxLength={14} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Cidade, Estado" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone de Contato *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 00000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="companyVision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visão da Empresa</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyValues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valores da Empresa</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-4 text-secondary">Dados da Primeira Vaga</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Título da Vaga *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Garçom, Barista, Cozinheiro" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Contrato *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="freelance">Freelancer</SelectItem>
                      <SelectItem value="contract">Contrato</SelectItem>
                      <SelectItem value="full_time">Tempo Integral</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Salário *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hourly">Por Hora</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salário Mínimo (R$) *</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaryMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salário Máximo (R$) *</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workloadHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carga Horária (h/semana) *</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local da Vaga *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Cidade, Estado" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Descrição da Vaga *</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} placeholder="Descreva as responsabilidades e atividades..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Requisitos</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} placeholder="Ex: Experiência mínima, certificações..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferences"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Preferências</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} placeholder="Ex: Disponibilidade, perfil desejado..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" variant="secondary" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar Conta
        </Button>
      </form>
    </Form>
  );
};

export default CompanySignup;
