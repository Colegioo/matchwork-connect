import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, DollarSign, Clock, Briefcase } from "lucide-react";
import { JobListing } from "@/services/recommendationService";

interface JobCardProps {
  job: JobListing;
  matchScore: number;
  matchReasons: string[];
}

const JobCard = ({ job, matchScore, matchReasons }: JobCardProps) => {
  const formatSalary = (min: number, max: number, type: string) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    });
    
    const period = type === 'monthly' ? '/mês' : '/hora';
    return `${formatter.format(min)} - ${formatter.format(max)} ${period}`;
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'full_time': 'Tempo Integral',
      'contract': 'Contrato',
      'freelance': 'Freelance'
    };
    return labels[type] || type;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente Match!';
    if (score >= 60) return 'Ótimo Match';
    if (score >= 40) return 'Bom Match';
    return 'Match Interessante';
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-2 select-none">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{job.job_title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <Building2 className="w-4 h-4" />
              {job.company?.company_name || 'Empresa'}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`${getScoreColor(matchScore)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
              {matchScore}% Match
            </div>
            <span className="text-xs text-muted-foreground font-semibold">
              {getScoreLabel(matchScore)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {getEmploymentTypeLabel(job.employment_type)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {job.workload_hours}h/semana
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            Faixa Salarial
          </h4>
          <p className="text-lg font-bold text-green-600">
            {formatSalary(job.salary_min, job.salary_max, job.salary_type)}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Sobre a Vaga</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {job.job_description}
          </p>
        </div>

        {job.company?.company_vision && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Visão da Empresa</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.company.company_vision}
            </p>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-sm mb-2">Requisitos</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.requirements}
          </p>
        </div>

        {job.preferences && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Diferenciais</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.preferences}
            </p>
          </div>
        )}

        {matchReasons.length > 0 && (
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
            <h4 className="font-semibold text-sm mb-2 text-primary">Por que você combina:</h4>
            <ul className="space-y-1">
              {matchReasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
