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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100),
  fullName: z.string().min(2, "Nome completo é obrigatório").max(255),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  location: z.string().min(2, "Localização é obrigatória").max(255),
  contactPhone: z.string().min(10, "Telefone inválido").max(20),
  education: z.string().max(1000).optional(),
  experience: z.string().max(2000).optional(),
  softSkills: z.string().max(500).optional(),
  hardSkills: z.string().max(500).optional(),
  objectives: z.string().max(1000).optional(),
  strengths: z.string().max(500).optional(),
  weaknesses: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

const CandidateSignup = () => {
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

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

      let photoUrl = null;
      if (profilePhoto) {
        const fileExt = profilePhoto.name.split(".").pop();
        const filePath = `${authData.user.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(filePath, profilePhoto, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("profile-photos")
          .getPublicUrl(filePath);

        photoUrl = urlData.publicUrl;
      }

      const softSkillsArray = data.softSkills
        ? data.softSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const hardSkillsArray = data.hardSkills
        ? data.hardSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const { error: candidateError } = await supabase.from("candidates").insert({
        user_id: authData.user.id,
        full_name: data.fullName,
        birth_date: data.birthDate,
        profile_photo_url: photoUrl,
        location: data.location,
        contact_email: data.email,
        contact_phone: data.contactPhone,
        education: data.education,
        experience: data.experience,
        soft_skills: softSkillsArray,
        hard_skills: hardSkillsArray,
        objectives: data.objectives,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
      });

      if (candidateError) throw candidateError;

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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 00000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>Foto de Perfil</FormLabel>
          <div className="mt-2">
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              <span className="text-sm">
                {profilePhoto ? profilePhoto.name : "Escolher foto"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formação Acadêmica</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} placeholder="Ex: Ensino Médio, Graduação, Cursos..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experiência Profissional</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="Descreva suas experiências anteriores..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="softSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soft Skills</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Comunicação, Trabalho em equipe (separar por vírgula)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hardSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hard Skills</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Excel, Inglês, Atendimento ao cliente (separar por vírgula)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="objectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivos Profissionais</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} placeholder="Quais são seus objetivos de carreira?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="strengths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontos Fortes</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weaknesses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontos a Desenvolver</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar Conta
        </Button>
      </form>
    </Form>
  );
};

export default CandidateSignup;
