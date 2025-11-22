-- Criação de enums para tipos de dados
CREATE TYPE user_role AS ENUM ('company', 'candidate');
CREATE TYPE employment_type AS ENUM ('freelance', 'contract', 'full_time');
CREATE TYPE salary_type AS ENUM ('hourly', 'monthly');
CREATE TYPE subscription_plan AS ENUM ('freemium', 'premium');

-- Tabela de perfis de empresas
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  company_vision TEXT,
  company_values TEXT,
  location TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  subscription_plan subscription_plan DEFAULT 'freemium' NOT NULL,
  monthly_jobs_posted INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de vagas oferecidas
CREATE TABLE public.job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  employment_type employment_type NOT NULL,
  salary_type salary_type NOT NULL,
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  workload_hours INTEGER NOT NULL,
  location TEXT NOT NULL,
  requirements TEXT,
  preferences TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de perfis de candidatos
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  profile_photo_url TEXT,
  location TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  education TEXT,
  experience TEXT,
  soft_skills TEXT[],
  hard_skills TEXT[],
  objectives TEXT,
  strengths TEXT,
  weaknesses TEXT,
  subscription_plan subscription_plan DEFAULT 'freemium' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de matches (quando empresa e candidato se interessam mutuamente)
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  job_listing_id UUID REFERENCES public.job_listings(id) ON DELETE CASCADE NOT NULL,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(company_id, candidate_id, job_listing_id)
);

-- Tabela de swipes (registra quem deu like em quem)
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL,
  swiper_type user_role NOT NULL,
  target_id UUID NOT NULL,
  target_type user_role NOT NULL,
  job_listing_id UUID REFERENCES public.job_listings(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(swiper_id, target_id, job_listing_id)
);

-- Tabela de mensagens do chat
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL,
  sender_type user_role NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para companies
CREATE POLICY "Empresas podem ver seus próprios dados"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Empresas podem atualizar seus próprios dados"
  ON public.companies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Empresas podem inserir seus próprios dados"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para job_listings
CREATE POLICY "Empresas podem ver suas próprias vagas"
  ON public.job_listings FOR SELECT
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Candidatos podem ver vagas ativas"
  ON public.job_listings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Empresas podem criar vagas"
  ON public.job_listings FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Empresas podem atualizar suas vagas"
  ON public.job_listings FOR UPDATE
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- Políticas RLS para candidates
CREATE POLICY "Candidatos podem ver seus próprios dados"
  ON public.candidates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Candidatos podem atualizar seus próprios dados"
  ON public.candidates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Candidatos podem inserir seus próprios dados"
  ON public.candidates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para matches
CREATE POLICY "Empresas podem ver seus matches"
  ON public.matches FOR SELECT
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Candidatos podem ver seus matches"
  ON public.matches FOR SELECT
  USING (candidate_id IN (SELECT id FROM public.candidates WHERE user_id = auth.uid()));

CREATE POLICY "Sistema pode criar matches"
  ON public.matches FOR INSERT
  WITH CHECK (true);

-- Políticas RLS para swipes
CREATE POLICY "Usuários podem ver seus próprios swipes"
  ON public.swipes FOR SELECT
  USING (swiper_id = auth.uid());

CREATE POLICY "Usuários podem criar swipes"
  ON public.swipes FOR INSERT
  WITH CHECK (swiper_id = auth.uid());

-- Políticas RLS para chat_messages
CREATE POLICY "Participantes do match podem ver mensagens"
  ON public.chat_messages FOR SELECT
  USING (
    match_id IN (
      SELECT id FROM public.matches 
      WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
         OR candidate_id IN (SELECT id FROM public.candidates WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Participantes do match podem enviar mensagens"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    match_id IN (
      SELECT id FROM public.matches 
      WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
         OR candidate_id IN (SELECT id FROM public.candidates WHERE user_id = auth.uid())
    )
  );

-- Função e trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Bucket de storage para fotos de perfil
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para fotos de perfil
CREATE POLICY "Usuários podem ver fotos de perfil"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Usuários podem fazer upload de suas fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem atualizar suas fotos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar suas fotos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );