# Instruções de Configuração - MatchWork Connect

## Funcionalidades Implementadas

### ✅ Sistema de Recomendações Estilo Tinder

Foi implementado um sistema completo de recomendações de vagas para candidatos, incluindo:

1. **Algoritmo de Matching Inteligente** que considera:
   - Compatibilidade de localização (20 pontos)
   - Hard skills (40 pontos)
   - Soft skills (15 pontos)
   - Alinhamento de objetivos (15 pontos)
   - Experiência relevante (10 pontos)

2. **Interface Estilo Tinder** com:
   - Cards de vagas com informações detalhadas
   - Sistema de swipe (esquerda = não interesse, direita = interesse)
   - Animações suaves de transição
   - Score de compatibilidade visual
   - Razões do match explicadas

3. **Dados Mockados** incluindo:
   - 5 candidatos com perfis variados
   - 3 empresas
   - 4 vagas com requisitos diferentes

## Como Configurar e Testar

### Passo 1: Instalar Dependências

```bash
cd matchwork-connect
npm install
```

### Passo 2: Configurar Supabase

1. Acesse o [Supabase](https://supabase.com) e crie um novo projeto
2. Copie a URL do projeto e a chave anônima (anon key)
3. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### Passo 3: Aplicar Migrations

No dashboard do Supabase:

1. Vá em **SQL Editor**
2. Execute os arquivos de migration na ordem:
   - `supabase/migrations/20251122053546_54188c5d-833c-4f25-b7f2-910663e4d289.sql`
   - `supabase/migrations/20251122053609_6ec24166-9a11-4f55-af3a-f5dffbaeec18.sql`

### Passo 4: Popular Banco com Dados Mockados

#### Opção A: Via Script (Recomendado)

1. Obtenha a chave de serviço (service role key) no Supabase:
   - Settings → API → service_role key

2. Adicione ao arquivo `.env`:
```env
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_aqui
```

3. Execute o script:
```bash
node scripts/seed-database.js
```

#### Opção B: Manualmente via SQL

Execute o arquivo `supabase/migrations/20251122_seed_mock_data.sql` no SQL Editor do Supabase.

**IMPORTANTE**: A opção B cria apenas os perfis, mas não os usuários de autenticação. Você precisará criar os usuários manualmente no Supabase Auth.

### Passo 5: Iniciar Aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Credenciais de Teste

### Candidatos

| Email | Senha | Perfil |
|-------|-------|--------|
| ana.silva@email.com | senha123 | Desenvolvedora Frontend React |
| carlos.mendes@email.com | senha123 | Tech Lead Backend |
| beatriz.costa@email.com | senha123 | UX/UI Designer |
| diego.oliveira@email.com | senha123 | DevOps Engineer |
| eduarda.santos@email.com | senha123 | Desenvolvedora Mobile |

### Empresas

| Email | Senha | Nome |
|-------|-------|------|
| rh@techstart.com.br | senha123 | TechStart Inovação |
| talentos@cloudsolutions.com.br | senha123 | CloudSolutions Brasil |
| jobs@designlab.com.br | senha123 | Design Lab Studio |

## Como Usar

1. **Login**: Acesse `/auth` e faça login com uma das contas de candidato
2. **Dashboard**: Após o login, você verá o dashboard principal
3. **Descobrir Vagas**: Clique em "Começar a Explorar" para acessar a página de recomendações
4. **Swipe**: 
   - Clique no ❌ ou arraste para a esquerda para rejeitar
   - Clique no ❤️ ou arraste para a direita para demonstrar interesse
5. **Score**: Veja o percentual de compatibilidade e as razões do match em cada card

## Arquitetura Implementada

### Novos Arquivos Criados

```
src/
├── services/
│   └── recommendationService.ts    # Lógica de recomendações e matching
├── components/
│   └── JobCard.tsx                 # Card de vaga estilo Tinder
└── pages/
    └── Discover.tsx                # Página de descoberta de vagas

scripts/
└── seed-database.js                # Script para popular banco

supabase/migrations/
└── 20251122_seed_mock_data.sql    # Dados mockados (alternativa)
```

### Modificações em Arquivos Existentes

- `src/App.tsx`: Adicionada rota `/discover`
- `src/pages/Index.tsx`: Adicionado botão para acessar recomendações

## Funcionalidades Técnicas

### Sistema de Recomendações

O algoritmo de matching considera múltiplos fatores e atribui pontuações:

- **Localização**: Prioriza mesma cidade/estado
- **Hard Skills**: Compara skills do candidato com requisitos da vaga
- **Soft Skills**: Analisa compatibilidade de competências comportamentais
- **Objetivos**: Verifica alinhamento entre objetivos do candidato e descrição da vaga
- **Experiência**: Considera anos de experiência vs nível da vaga (júnior/pleno/sênior)

### Persistência de Swipes

Todos os swipes são salvos na tabela `swipes` do banco de dados, permitindo:
- Não mostrar vagas já visualizadas
- Detectar matches mútuos (quando empresa e candidato se curtem)
- Histórico de interações

### Interface Responsiva

A interface foi desenvolvida com Tailwind CSS e shadcn-ui, garantindo:
- Design moderno e profissional
- Responsividade em diferentes dispositivos
- Animações suaves e intuitivas
- Feedback visual claro

## Próximos Passos Sugeridos

1. **Sistema de Matches**: Página para visualizar matches mútuos
2. **Chat**: Sistema de mensagens entre candidatos e empresas
3. **Perfil do Candidato**: Página para editar informações pessoais
4. **Filtros**: Permitir filtrar vagas por localização, salário, etc.
5. **Notificações**: Alertas quando houver novo match
6. **Visão da Empresa**: Interface para empresas visualizarem candidatos

## Suporte

Para dúvidas ou problemas:
1. Verifique se todas as migrations foram aplicadas
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique o console do navegador para erros
4. Consulte a documentação do [Supabase](https://supabase.com/docs)
