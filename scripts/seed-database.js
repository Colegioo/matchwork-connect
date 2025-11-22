/**
 * Script para popular o banco de dados com usuários e dados mockados
 * 
 * IMPORTANTE: Este script deve ser executado APÓS configurar o Supabase
 * e aplicar as migrations.
 * 
 * Uso: node scripts/seed-database.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Chave de serviço necessária

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Dados dos candidatos mockados
const mockCandidates = [
  {
    email: 'ana.silva@email.com',
    password: 'senha123',
    profile: {
      full_name: 'Ana Silva',
      birth_date: '1995-03-15',
      location: 'São Paulo, SP',
      contact_email: 'ana.silva@email.com',
      contact_phone: '(11) 98765-4321',
      education: 'Graduação em Ciência da Computação - USP',
      experience: '3 anos como desenvolvedora frontend em startup de tecnologia',
      soft_skills: ['Comunicação', 'Trabalho em equipe', 'Criatividade', 'Adaptabilidade'],
      hard_skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Git', 'Figma'],
      objectives: 'Busco uma posição que me permita crescer como desenvolvedora full-stack e trabalhar em projetos inovadores',
      strengths: 'Rápida aprendizagem, proatividade, atenção aos detalhes',
      weaknesses: 'Ansiedade em apresentações públicas',
    }
  },
  {
    email: 'carlos.mendes@email.com',
    password: 'senha123',
    profile: {
      full_name: 'Carlos Mendes',
      birth_date: '1992-07-22',
      location: 'Rio de Janeiro, RJ',
      contact_email: 'carlos.mendes@email.com',
      contact_phone: '(21) 97654-3210',
      education: 'Graduação em Engenharia de Software - UFRJ, MBA em Gestão de Projetos',
      experience: '5 anos como desenvolvedor backend, 2 anos como tech lead',
      soft_skills: ['Liderança', 'Resolução de problemas', 'Comunicação', 'Mentoria'],
      hard_skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Node.js', 'REST APIs'],
      objectives: 'Procuro oportunidades como arquiteto de software ou tech lead em empresas que valorizam inovação',
      strengths: 'Experiência em arquitetura de sistemas, liderança técnica',
      weaknesses: 'Perfeccionismo excessivo às vezes',
    }
  },
  {
    email: 'beatriz.costa@email.com',
    password: 'senha123',
    profile: {
      full_name: 'Beatriz Costa',
      birth_date: '1998-11-08',
      location: 'Belo Horizonte, MG',
      contact_email: 'beatriz.costa@email.com',
      contact_phone: '(31) 96543-2109',
      education: 'Graduação em Design Gráfico - UFMG',
      experience: '2 anos como UX/UI Designer em agência digital',
      soft_skills: ['Empatia', 'Criatividade', 'Colaboração', 'Pensamento crítico'],
      hard_skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'User Research', 'Prototyping'],
      objectives: 'Quero trabalhar em produtos digitais que impactem positivamente a vida das pessoas',
      strengths: 'Habilidade em entender necessidades dos usuários, design centrado no usuário',
      weaknesses: 'Dificuldade em dizer não a novos projetos',
    }
  },
  {
    email: 'diego.oliveira@email.com',
    password: 'senha123',
    profile: {
      full_name: 'Diego Oliveira',
      birth_date: '1990-05-30',
      location: 'Porto Alegre, RS',
      contact_email: 'diego.oliveira@email.com',
      contact_phone: '(51) 95432-1098',
      education: 'Graduação em Análise de Sistemas - PUCRS, Certificação AWS Solutions Architect',
      experience: '7 anos em DevOps e infraestrutura cloud',
      soft_skills: ['Organização', 'Trabalho sob pressão', 'Comunicação', 'Proatividade'],
      hard_skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux', 'Python', 'Bash'],
      objectives: 'Busco posições sênior em DevOps com foco em arquitetura cloud e automação',
      strengths: 'Expertise em cloud computing, automação de processos',
      weaknesses: 'Impaciência com processos burocráticos',
    }
  },
  {
    email: 'eduarda.santos@email.com',
    password: 'senha123',
    profile: {
      full_name: 'Eduarda Santos',
      birth_date: '1996-09-12',
      location: 'Curitiba, PR',
      contact_email: 'eduarda.santos@email.com',
      contact_phone: '(41) 94321-0987',
      education: 'Graduação em Sistemas de Informação - UFPR',
      experience: '3 anos como desenvolvedora mobile',
      soft_skills: ['Flexibilidade', 'Trabalho em equipe', 'Curiosidade', 'Resiliência'],
      hard_skills: ['React Native', 'Flutter', 'JavaScript', 'Dart', 'Firebase', 'Git', 'REST APIs'],
      objectives: 'Procuro oportunidades para trabalhar com desenvolvimento mobile em produtos inovadores',
      strengths: 'Experiência multiplataforma, atenção à UX mobile',
      weaknesses: 'Tendência a subestimar prazos',
    }
  },
];

// Dados das empresas mockadas
const mockCompanies = [
  {
    email: 'rh@techstart.com.br',
    password: 'senha123',
    profile: {
      company_name: 'TechStart Inovação',
      cnpj: '12.345.678/0001-90',
      company_vision: 'Revolucionar o mercado de tecnologia com soluções inovadoras e acessíveis',
      company_values: 'Inovação, Colaboração, Transparência, Impacto Social',
      location: 'São Paulo, SP',
      contact_email: 'rh@techstart.com.br',
      contact_phone: '(11) 3000-1000',
    }
  },
  {
    email: 'talentos@cloudsolutions.com.br',
    password: 'senha123',
    profile: {
      company_name: 'CloudSolutions Brasil',
      cnpj: '23.456.789/0001-01',
      company_vision: 'Ser referência em soluções cloud na América Latina',
      company_values: 'Excelência, Inovação, Sustentabilidade, Diversidade',
      location: 'Rio de Janeiro, RJ',
      contact_email: 'talentos@cloudsolutions.com.br',
      contact_phone: '(21) 3100-2000',
    }
  },
  {
    email: 'jobs@designlab.com.br',
    password: 'senha123',
    profile: {
      company_name: 'Design Lab Studio',
      cnpj: '34.567.890/0001-12',
      company_vision: 'Criar experiências digitais memoráveis e centradas no usuário',
      company_values: 'Criatividade, Empatia, Qualidade, Colaboração',
      location: 'Belo Horizonte, MG',
      contact_email: 'jobs@designlab.com.br',
      contact_phone: '(31) 3200-3000',
    }
  },
];

async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Criar usuários candidatos
  console.log('👤 Criando candidatos...');
  for (const candidate of mockCandidates) {
    try {
      // Criar usuário de autenticação
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: candidate.email,
        password: candidate.password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`  ❌ Erro ao criar usuário ${candidate.email}:`, authError.message);
        continue;
      }

      // Criar perfil de candidato
      const { error: profileError } = await supabase
        .from('candidates')
        .insert({
          user_id: authData.user.id,
          ...candidate.profile,
        });

      if (profileError) {
        console.error(`  ❌ Erro ao criar perfil de ${candidate.email}:`, profileError.message);
      } else {
        console.log(`  ✅ ${candidate.profile.full_name} criado(a) com sucesso`);
      }
    } catch (error) {
      console.error(`  ❌ Erro inesperado ao criar ${candidate.email}:`, error);
    }
  }

  console.log('\n🏢 Criando empresas...');
  const companyIds = [];
  
  for (const company of mockCompanies) {
    try {
      // Criar usuário de autenticação
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: company.email,
        password: company.password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`  ❌ Erro ao criar usuário ${company.email}:`, authError.message);
        continue;
      }

      // Criar perfil de empresa
      const { data: companyData, error: profileError } = await supabase
        .from('companies')
        .insert({
          user_id: authData.user.id,
          ...company.profile,
        })
        .select()
        .single();

      if (profileError) {
        console.error(`  ❌ Erro ao criar perfil de ${company.email}:`, profileError.message);
      } else {
        console.log(`  ✅ ${company.profile.company_name} criada com sucesso`);
        companyIds.push({ name: company.profile.company_name, id: companyData.id });
      }
    } catch (error) {
      console.error(`  ❌ Erro inesperado ao criar ${company.email}:`, error);
    }
  }

  // 2. Criar vagas
  if (companyIds.length > 0) {
    console.log('\n💼 Criando vagas...');
    
    const jobs = [
      {
        company: 'TechStart Inovação',
        job_title: 'Desenvolvedor(a) Frontend React',
        job_description: 'Buscamos desenvolvedor(a) frontend apaixonado(a) por criar interfaces incríveis. Você trabalhará em projetos inovadores usando React e TypeScript.',
        employment_type: 'full_time',
        salary_type: 'monthly',
        salary_min: 6000,
        salary_max: 9000,
        workload_hours: 40,
        location: 'São Paulo, SP',
        requirements: 'Experiência com React, TypeScript, HTML, CSS. Conhecimento em Git.',
        preferences: 'Experiência com Figma, testes automatizados, metodologias ágeis',
      },
      {
        company: 'TechStart Inovação',
        job_title: 'Tech Lead Full-Stack',
        job_description: 'Procuramos tech lead para liderar time de desenvolvimento full-stack. Responsável por arquitetura, mentoria e desenvolvimento.',
        employment_type: 'full_time',
        salary_type: 'monthly',
        salary_min: 12000,
        salary_max: 18000,
        workload_hours: 40,
        location: 'São Paulo, SP',
        requirements: 'Experiência em liderança técnica, Node.js, React, PostgreSQL, arquitetura de software',
        preferences: 'Experiência com AWS, Docker, Kubernetes, metodologias ágeis',
      },
      {
        company: 'CloudSolutions Brasil',
        job_title: 'DevOps Engineer Sênior',
        job_description: 'Vaga para DevOps Engineer com foco em infraestrutura cloud AWS. Trabalho com automação, CI/CD e Kubernetes.',
        employment_type: 'full_time',
        salary_type: 'monthly',
        salary_min: 10000,
        salary_max: 15000,
        workload_hours: 40,
        location: 'Rio de Janeiro, RJ',
        requirements: 'Experiência sólida com AWS, Kubernetes, Docker, Terraform, CI/CD',
        preferences: 'Certificações AWS, experiência com multi-cloud, Python',
      },
      {
        company: 'Design Lab Studio',
        job_title: 'UX/UI Designer',
        job_description: 'Designer para criar experiências digitais incríveis. Trabalho colaborativo com desenvolvedores e product managers.',
        employment_type: 'full_time',
        salary_type: 'monthly',
        salary_min: 5000,
        salary_max: 8000,
        workload_hours: 40,
        location: 'Belo Horizonte, MG',
        requirements: 'Experiência com Figma, Adobe XD, user research, prototipagem',
        preferences: 'Portfolio robusto, experiência com design systems, conhecimento de frontend',
      },
    ];

    for (const job of jobs) {
      const company = companyIds.find(c => c.name === job.company);
      if (!company) continue;

      const { company: _, ...jobData } = job;
      
      const { error } = await supabase
        .from('job_listings')
        .insert({
          company_id: company.id,
          ...jobData,
        });

      if (error) {
        console.error(`  ❌ Erro ao criar vaga ${job.job_title}:`, error.message);
      } else {
        console.log(`  ✅ Vaga "${job.job_title}" criada com sucesso`);
      }
    }
  }

  console.log('\n✨ Seed concluído!\n');
  console.log('📝 Credenciais de acesso:');
  console.log('\nCandidatos:');
  mockCandidates.forEach(c => {
    console.log(`  - ${c.email} / ${c.password}`);
  });
  console.log('\nEmpresas:');
  mockCompanies.forEach(c => {
    console.log(`  - ${c.email} / ${c.password}`);
  });
}

seedDatabase().catch(console.error);
