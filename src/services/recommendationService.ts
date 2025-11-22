import { supabase } from "@/integrations/supabase/client";

export interface JobListing {
  id: string;
  company_id: string;
  job_title: string;
  job_description: string;
  employment_type: string;
  salary_type: string;
  salary_min: number;
  salary_max: number;
  workload_hours: number;
  location: string;
  requirements: string;
  preferences: string;
  is_active: boolean;
  company?: {
    company_name: string;
    company_vision: string;
    company_values: string;
    location: string;
  };
}

export interface Candidate {
  id: string;
  user_id: string;
  full_name: string;
  location: string;
  soft_skills: string[];
  hard_skills: string[];
  objectives: string;
  strengths: string;
  experience: string;
}

interface MatchScore {
  job: JobListing;
  score: number;
  reasons: string[];
}

/**
 * Calcula score de compatibilidade entre candidato e vaga
 */
function calculateMatchScore(candidate: Candidate, job: JobListing): MatchScore {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // 1. Compatibilidade de localização (20 pontos)
  if (candidate.location.toLowerCase().includes(job.location.toLowerCase()) ||
      job.location.toLowerCase().includes(candidate.location.toLowerCase())) {
    score += 20;
    reasons.push("Mesma localização");
  } else {
    // Verifica se pelo menos o estado é o mesmo
    const candidateState = candidate.location.split(',').pop()?.trim();
    const jobState = job.location.split(',').pop()?.trim();
    if (candidateState && jobState && candidateState === jobState) {
      score += 10;
      reasons.push("Mesmo estado");
    }
  }

  // 2. Compatibilidade de hard skills (40 pontos)
  const jobRequirements = (job.requirements || '').toLowerCase();
  const jobPreferences = (job.preferences || '').toLowerCase();
  const candidateSkills = candidate.hard_skills.map(s => s.toLowerCase());
  
  let skillMatches = 0;
  let totalSkills = candidateSkills.length;
  
  candidateSkills.forEach(skill => {
    if (jobRequirements.includes(skill) || jobPreferences.includes(skill)) {
      skillMatches++;
    }
  });

  if (totalSkills > 0) {
    const skillScore = (skillMatches / totalSkills) * 40;
    score += skillScore;
    if (skillMatches > 0) {
      reasons.push(`${skillMatches} skills compatíveis`);
    }
  }

  // 3. Compatibilidade de soft skills (15 pontos)
  const candidateSoftSkills = candidate.soft_skills.map(s => s.toLowerCase());
  let softSkillMatches = 0;

  candidateSoftSkills.forEach(skill => {
    if (jobRequirements.includes(skill) || 
        jobPreferences.includes(skill) || 
        job.job_description.toLowerCase().includes(skill)) {
      softSkillMatches++;
    }
  });

  if (candidateSoftSkills.length > 0) {
    const softSkillScore = (softSkillMatches / candidateSoftSkills.length) * 15;
    score += softSkillScore;
    if (softSkillMatches > 0) {
      reasons.push(`${softSkillMatches} soft skills alinhadas`);
    }
  }

  // 4. Alinhamento de objetivos com descrição da vaga (15 pontos)
  const objectives = candidate.objectives.toLowerCase();
  const jobDescription = job.job_description.toLowerCase();
  const jobTitle = job.job_title.toLowerCase();

  // Verifica palavras-chave comuns
  const keywordMatches = [
    'full-stack', 'frontend', 'backend', 'mobile', 'devops', 
    'data', 'design', 'ux', 'ui', 'segurança', 'cloud', 'lead'
  ].filter(keyword => 
    objectives.includes(keyword) && (jobDescription.includes(keyword) || jobTitle.includes(keyword))
  );

  if (keywordMatches.length > 0) {
    score += 15;
    reasons.push("Objetivos alinhados com a vaga");
  } else if (objectives.length > 20) {
    // Pontuação parcial se há objetivos definidos
    score += 5;
  }

  // 5. Experiência relevante (10 pontos)
  const experience = candidate.experience.toLowerCase();
  if (experience.includes('anos')) {
    // Extrai anos de experiência
    const yearsMatch = experience.match(/(\d+)\s*anos?/);
    if (yearsMatch) {
      const years = parseInt(yearsMatch[1]);
      
      // Júnior: 0-2 anos, Pleno: 3-5 anos, Sênior: 6+ anos
      const isJuniorJob = jobTitle.includes('júnior') || jobTitle.includes('junior');
      const isSeniorJob = jobTitle.includes('sênior') || jobTitle.includes('senior') || jobTitle.includes('lead');
      
      if (isJuniorJob && years <= 3) {
        score += 10;
        reasons.push("Experiência adequada para nível júnior");
      } else if (isSeniorJob && years >= 5) {
        score += 10;
        reasons.push("Experiência sênior compatível");
      } else if (!isJuniorJob && !isSeniorJob && years >= 2 && years <= 6) {
        score += 10;
        reasons.push("Experiência plena compatível");
      } else if (years >= 1) {
        score += 5;
        reasons.push("Possui experiência relevante");
      }
    }
  }

  // Normaliza o score para 0-100
  const finalScore = Math.min(Math.round(score), maxScore);

  return {
    job,
    score: finalScore,
    reasons: reasons.length > 0 ? reasons : ["Perfil interessante para a vaga"]
  };
}

/**
 * Busca recomendações de vagas para um candidato
 */
export async function getJobRecommendations(candidateUserId: string): Promise<MatchScore[]> {
  try {
    // 1. Buscar dados do candidato
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('user_id', candidateUserId)
      .single();

    if (candidateError || !candidate) {
      console.error('Erro ao buscar candidato:', candidateError);
      return [];
    }

    // 2. Buscar vagas ativas
    const { data: jobs, error: jobsError } = await supabase
      .from('job_listings')
      .select(`
        *,
        company:companies(
          company_name,
          company_vision,
          company_values,
          location
        )
      `)
      .eq('is_active', true);

    if (jobsError || !jobs) {
      console.error('Erro ao buscar vagas:', jobsError);
      return [];
    }

    // 3. Buscar swipes já realizados pelo candidato
    const { data: existingSwipes } = await supabase
      .from('swipes')
      .select('target_id, job_listing_id')
      .eq('swiper_id', candidateUserId)
      .eq('swiper_type', 'candidate');

    const swipedJobIds = new Set(
      existingSwipes?.map(s => s.job_listing_id).filter(Boolean) || []
    );

    // 4. Filtrar vagas já visualizadas
    const unseenJobs = jobs.filter(job => !swipedJobIds.has(job.id));

    // 5. Calcular score para cada vaga
    const scoredJobs = unseenJobs.map(job => 
      calculateMatchScore(candidate, job as JobListing)
    );

    // 6. Ordenar por score (maior para menor)
    scoredJobs.sort((a, b) => b.score - a.score);

    return scoredJobs;
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error);
    return [];
  }
}

/**
 * Registra um swipe (like ou dislike)
 */
export async function recordSwipe(
  swiperId: string,
  targetId: string,
  jobListingId: string,
  isLike: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('swipes')
      .insert({
        swiper_id: swiperId,
        swiper_type: 'candidate',
        target_id: targetId,
        target_type: 'company',
        job_listing_id: jobListingId,
        is_like: isLike
      });

    if (error) {
      console.error('Erro ao registrar swipe:', error);
      return false;
    }

    // Se foi like, verificar se há match
    if (isLike) {
      await checkAndCreateMatch(swiperId, targetId, jobListingId);
    }

    return true;
  } catch (error) {
    console.error('Erro ao registrar swipe:', error);
    return false;
  }
}

/**
 * Verifica se há match mútuo e cria o registro
 */
async function checkAndCreateMatch(
  candidateUserId: string,
  companyId: string,
  jobListingId: string
): Promise<void> {
  try {
    // Buscar ID do candidato
    const { data: candidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('user_id', candidateUserId)
      .single();

    if (!candidate) return;

    // Verificar se a empresa também deu like
    const { data: companySwipe } = await supabase
      .from('swipes')
      .select('*')
      .eq('swiper_id', companyId)
      .eq('swiper_type', 'company')
      .eq('target_id', candidate.id)
      .eq('target_type', 'candidate')
      .eq('job_listing_id', jobListingId)
      .eq('is_like', true)
      .single();

    // Se há match mútuo, criar registro
    if (companySwipe) {
      await supabase
        .from('matches')
        .insert({
          company_id: companyId,
          candidate_id: candidate.id,
          job_listing_id: jobListingId
        });
    }
  } catch (error) {
    console.error('Erro ao verificar match:', error);
  }
}
