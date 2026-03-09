export type Locale = 'PT' | 'EN';

export interface ProjectTranslation {
  locale: Locale;
  title: string;
  summary: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface Project {
  slug: string;
  featured: boolean;
  mainImage: string;
  updatedAt: string;
  techs: Array<{ name: string; iconUrl: string | null }>;
  tags: Array<{ id: string; namePt: string; nameEn: string }>;
  metrics: Array<{ value: string; unit: string | null; order: number; labelPt: string; labelEn: string }>;
  translations: ProjectTranslation[];
}

export const PROJECTS: Project[] = [
  {
    slug: 'mcmv-minha-casa-minha-vida',
    featured: true,
    mainImage: '/projects/mcmv-minha-casa-minha-vida/cover.png',
    updatedAt: '2025-03-01T00:00:00.000Z',
    techs: [
      { name: 'NestJS', iconUrl: 'https://nestjs.com/img/logo-small.svg' },
      { name: 'Next.js', iconUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png' },
      { name: 'PostgreSQL', iconUrl: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg' },
      { name: 'Prisma', iconUrl: 'https://www.prisma.io/images/favicon-32x32.png' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
      { name: 'Docker', iconUrl: 'https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png' },
      { name: 'GitLab CI', iconUrl: null },
      { name: 'ExcelJS', iconUrl: null },
      { name: 'PDFKit', iconUrl: null },
      { name: 'MUI', iconUrl: null },
    ],
    tags: [
      { id: 'government', namePt: 'Governo', nameEn: 'Government' },
      { id: 'social-impact', namePt: 'Impacto Social', nameEn: 'Social Impact' },
      { id: 'automation', namePt: 'Automação', nameEn: 'Automation' },
      { id: 'reports', namePt: 'Relatórios', nameEn: 'Reports' },
    ],
    metrics: [
      { value: '8', unit: null, order: 0, labelPt: 'Municípios Implantados', labelEn: 'Municipalities Deployed' },
      { value: '0', unit: null, order: 1, labelPt: 'Planilhas Manuais', labelEn: 'Manual Spreadsheets' },
      { value: '12', unit: 'pg', order: 2, labelPt: 'Formulário Substituído', labelEn: 'Form Replaced' },
    ],
    translations: [
      {
        locale: 'PT',
        title: 'MCMV — Minha Casa Minha Vida',
        summary:
          'Sistema completo de habilitação e hierarquização de beneficiários do programa Minha Casa Minha Vida, implantado em 8 municípios, substituindo um processo manual de 12 páginas por um fluxo digital rastreável e conforme decreto.',
        situation:
          'A Prefeitura de Timon precisava digitalizar e automatizar o processo de habilitação e hierarquização de beneficiários do programa Minha Casa Minha Vida, que era feito manualmente em um formulário impresso de 12 páginas, sem rastreabilidade, sujeito a erros e sem conformidade com os critérios definidos em decreto municipal.',
        task: 'Desenvolver do zero o sistema MCMV — backend, frontend e banco de dados — responsável por cadastrar candidatos, aplicar os critérios de hierarquização conforme decreto, gerar rankings por modalidade e cota, e exportar relatórios oficiais em Excel e PDF para uso pela equipe da secretaria.',
        action: `## Modelagem e Motor de Hierarquização\n\nModelei o banco de dados com Prisma/PostgreSQL cobrindo candidatos, critérios nacionais, locais e especiais, cotas e hierarquizações versionadas. Implementei um motor de hierarquização configurável que pontua e ordena candidatos automaticamente com base nos critérios ativos.\n\n## Exportação e Relatórios\n\nDesenvolvi exportação de Excel com ExcelJS e geração de PDF de perfil de beneficiário com PDFKit, com layout otimizado para impressão monocromática.\n\n## Correção de Overflow de Bind Variables\n\nResolvi um overflow de variáveis bind no PostgreSQL causado por queries em lote com volume alto de candidatos, implementando chunking nas consultas:\n\n\`\`\`typescript\nasync function batchQuery<T>(ids: string[], batchSize = 500): Promise<T[]> {\n  const chunks = chunk(ids, batchSize);\n  const results = await Promise.all(\n    chunks.map(ids => prisma.candidate.findMany({ where: { id: { in: ids } } }))\n  );\n  return results.flat() as T[];\n}\n\`\`\`\n\n## Deploy\n\nConfigurei o ambiente de deploy com Docker e GitLab CI/CD.`,
        result:
          'O sistema foi implantado em 8 municípios — Timon, Floriano, Parnaíba, Caxias, Batalha, São Raimundo Nonato, União e Teresina — e passou a ser usado pelas equipes das secretarias para conduzir os processos oficiais de seleção do MCMV, eliminando planilhas manuais e garantindo rastreabilidade e conformidade com os editais locais.',
      },
      {
        locale: 'EN',
        title: 'MCMV — Brazilian Social Housing Program',
        summary:
          'Complete beneficiary registration and ranking system for the Minha Casa Minha Vida federal housing program, deployed across 8 municipalities, replacing a 12-page manual process with a traceable, decree-compliant digital workflow.',
        situation:
          'The City of Timon needed to digitize and automate the beneficiary registration and ranking process for the Minha Casa Minha Vida housing program, which was handled manually on a 12-page printed form — with no traceability, prone to errors and non-compliant with the criteria defined in local municipal decrees.',
        task: 'Build from scratch the MCMV system — backend, frontend and database — responsible for registering candidates, applying ranking criteria per decree, generating rankings by modality and quota, and exporting official reports in Excel and PDF for use by the municipal secretariat team.',
        action: `## Data Modeling and Ranking Engine\n\nDesigned the database schema with Prisma/PostgreSQL covering candidates, national/local/special criteria, quotas and versioned rankings. Built a configurable ranking engine that scores and orders candidates automatically based on active criteria.\n\n## Exports and Reports\n\nDeveloped Excel export with ExcelJS and beneficiary profile PDF generation with PDFKit, with a layout optimized for monochrome printing.\n\n## PostgreSQL Bind Variable Overflow Fix\n\nResolved a bind variable overflow in PostgreSQL caused by batch queries with a high volume of candidates by implementing query chunking.\n\n## Deployment\n\nConfigured the deployment environment with Docker and GitLab CI/CD.`,
        result:
          'The system was deployed across 8 municipalities — Timon, Floriano, Parnaíba, Caxias, Batalha, São Raimundo Nonato, União and Teresina — and is now used by secretariat teams to conduct official MCMV selection processes, eliminating manual spreadsheets and ensuring traceability and compliance with local edicts.',
      },
    ],
  },
  {
    slug: 'top-timon-orcamento-participativo',
    featured: true,
    mainImage: '/projects/top-timon-orcamento-participativo/cover.png',
    updatedAt: '2025-03-01T00:00:00.000Z',
    techs: [
      { name: 'NestJS', iconUrl: 'https://nestjs.com/img/logo-small.svg' },
      { name: 'Next.js', iconUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png' },
      { name: 'PostgreSQL', iconUrl: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg' },
      { name: 'Prisma', iconUrl: 'https://www.prisma.io/images/favicon-32x32.png' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
      { name: 'Docker', iconUrl: null },
      { name: 'MUI', iconUrl: null },
    ],
    tags: [
      { id: 'government', namePt: 'Governo', nameEn: 'Government' },
      { id: 'civic-tech', namePt: 'Civic Tech', nameEn: 'Civic Tech' },
      { id: 'social-impact', namePt: 'Impacto Social', nameEn: 'Social Impact' },
      { id: 'automation', namePt: 'Automação', nameEn: 'Automation' },
    ],
    metrics: [
      { value: '20', unit: 'dias', order: 0, labelPt: 'Tempo de Entrega', labelEn: 'Delivery Time' },
      { value: '0', unit: null, order: 1, labelPt: 'Intervenção Manual na Apuração', labelEn: 'Manual Tallying Interventions' },
    ],
    translations: [
      {
        locale: 'PT',
        title: 'TOP — Timon Orçamento Participativo',
        summary:
          'Sistema web completo que digitalizou todo o ciclo do orçamento participativo municipal de Timon — do cadastro de participantes até a apuração e divulgação de resultados — entregue em 20 dias.',
        situation:
          'A Prefeitura de Timon realizava o processo de Orçamento Participativo de forma descentralizada e sem controle — cadastros em planilhas, propostas recebidas por WhatsApp, votação presencial sem rastreabilidade e apuração manual. Não havia como auditar o processo nem garantir que as regras do edital fossem cumpridas.',
        task: 'Desenvolver do zero o TOP (Timon Orçamento Participativo), um sistema web completo que digitalizasse todo o ciclo do orçamento participativo municipal — do cadastro de participantes e entidades até a apuração, ranking e divulgação dos resultados. O sistema foi produzido dentro de 20 dias.',
        action: `## Cadastro e Validação\n\nModelei o fluxo completo de cadastro de participantes com validações de CPF, data de nascimento, CEP, idade mínima e proteção com reCAPTCHA. Desenvolvi o módulo de cadastro institucional de entidades comunitárias com upload de documentos obrigatórios, vinculação a edital ativo e controle de unicidade de CNPJ por edital.\n\n## Motor de Propostas\n\nImplementei o motor de submissão de propostas com regras automáticas de negócio: limite por entidade, teto orçamentário por zona urbana/rural, registro de tentativas inválidas e mensagens de erro claras.\n\n## Votação Digital\n\nDesenvolvi o módulo de votação digital com controle de período oficial, validação do eleitor, comprovante visual de voto e trilha auditável de cada submissão.\n\n## Apuração e Transparência\n\nImplementei apuração automática com ranking por zona considerando quantidade de votos e orçamento disponível.\n\n\`\`\`typescript\nasync apurar(editalId: string) {\n  const votos = await this.prisma.voto.groupBy({\n    by: ['propostaId'],\n    where: { editalId },\n    _count: { propostaId: true },\n    orderBy: { _count: { propostaId: 'desc' } },\n  });\n  return this.distribuirPorZona(votos, edital.orcamentoPorZona);\n}\n\`\`\``,
        result:
          'O processo de orçamento participativo de Timon passou de um fluxo caótico e inauditável para um ciclo padronizado, rastreável e defensável juridicamente. O TOP voltará a ser utilizado no ano de 2026.',
      },
      {
        locale: 'EN',
        title: 'TOP — Timon Participatory Budgeting',
        summary:
          "Full-cycle web system that digitized Timon's entire participatory budgeting process — from participant registration to result tallying and publication — delivered in 20 days.",
        situation:
          'The City of Timon ran its participatory budgeting process in a decentralized and uncontrolled way — registrations on spreadsheets, proposals received via WhatsApp, in-person voting with no traceability and manual tallying. There was no way to audit the process or ensure that the public notice rules were followed.',
        task: 'Build from scratch the TOP system, a complete web platform digitizing the entire municipal participatory budgeting cycle — from participant and organization registration through to tallying, ranking and result publication — delivered within 20 days.',
        action: `## Registration and Validation\n\nDesigned the full participant registration flow with CPF, date of birth, postal code and minimum age validations plus reCAPTCHA protection.\n\n## Proposal Engine\n\nImplemented the proposal submission engine with automatic business rules: per-organization limits, budget caps per urban/rural zone, invalid attempt logging and clear error messages.\n\n## Digital Voting\n\nBuilt the digital voting module with official period enforcement, voter validation, visual vote receipt and an auditable trail for every submission.\n\n## Tallying and Transparency\n\nImplemented automatic tallying with per-zone ranking considering vote count and available budget.`,
        result:
          "Timon's participatory budgeting went from a chaotic, unauditable process to a standardized, traceable and legally defensible cycle. The platform will be used again in 2026.",
      },
    ],
  },
  {
    slug: 'tiajuda-protecao-mulher',
    featured: true,
    mainImage: '/projects/tiajuda-protecao-mulher/cover.png',
    updatedAt: '2026-03-13T00:00:00.000Z',
    techs: [
      { name: 'NestJS', iconUrl: 'https://nestjs.com/img/logo-small.svg' },
      { name: 'Next.js', iconUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png' },
      { name: 'PostgreSQL', iconUrl: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg' },
      { name: 'Prisma', iconUrl: 'https://www.prisma.io/images/favicon-32x32.png' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
      { name: 'PDFKit', iconUrl: null },
      { name: 'ExcelJS', iconUrl: null },
      { name: 'MUI', iconUrl: null },
    ],
    tags: [
      { id: 'government', namePt: 'Governo', nameEn: 'Government' },
      { id: 'social-impact', namePt: 'Impacto Social', nameEn: 'Social Impact' },
      { id: 'reports', namePt: 'Relatórios', nameEn: 'Reports' },
    ],
    metrics: [
      { value: '4', unit: null, order: 0, labelPt: 'Órgãos Municipais Integrados', labelEn: 'Municipal Agencies Integrated' },
      { value: '100', unit: '%', order: 1, labelPt: 'Encaminhamentos Rastreáveis', labelEn: 'Traceable Referrals' },
    ],
    translations: [
      {
        locale: 'PT',
        title: 'TiAjuda — Proteção à Mulher',
        summary:
          'Sistema de proteção e acompanhamento de mulheres em situação de violência, centralizando o atendimento da rede municipal com histórico unificado por caso, encaminhamentos rastreáveis e dados gerenciais para políticas públicas.',
        situation:
          'O atendimento a mulheres em situação de violência nos órgãos municipais de Timon era fragmentado — sem histórico centralizado, sem rastreabilidade dos encaminhamentos e sem visibilidade gerencial sobre os casos.',
        task: 'Desenvolver o TiAjuda, um sistema de proteção e acompanhamento de mulheres em situação de violência, cobrindo todo o ciclo de atendimento — do registro inicial até o encaminhamento para a rede de apoio e o acompanhamento longitudinal do caso.',
        action: `## Registro e FONAR\n\nModelei o fluxo de registro estruturado de ocorrências e pedidos de apoio, com histórico completo vinculado à pessoa atendida. Implementei o FONAR (Formulário Nacional de Avaliação de Risco) como formulário multi-etapas, seguindo o padrão nacional para avaliação de risco em casos de violência doméstica.\n\n## Acompanhamento de Casos\n\nDesenvolvi o sistema de acompanhamento de casos com status, histórico de evolução e registro de todas as interações.\n\n## Encaminhamento para Rede de Apoio\n\nConstruí o fluxo de encaminhamento para a rede de apoio — assistência social, saúde, segurança, defesa da mulher e apoio jurídico — com rastreabilidade de para onde cada caso foi direcionado.\n\n## Gestão e Auditoria\n\nDesenvolvi gestão de usuários com controle de acesso por perfil e papel. Construí módulo administrativo com audit log completo e relatórios em PDF e Excel.\n\n\`\`\`typescript\n@Injectable()\nexport class AuditInterceptor implements NestInterceptor {\n  intercept(context: ExecutionContext, next: CallHandler) {\n    const req = context.switchToHttp().getRequest();\n    return next.handle().pipe(\n      tap(() => this.auditService.log({ userId: req.user.id, action: req.method, resource: req.path }))\n    );\n  }\n}\n\`\`\``,
        result:
          'O TiAjuda centralizou o atendimento da rede de proteção municipal — Secretaria da Mulher, CRAS/CREAS, Assistência Social e Guarda Municipal — com histórico unificado por caso, encaminhamentos rastreáveis e dados gerenciais para políticas públicas locais. Lançamento oficial em 13 de março de 2026.',
      },
      {
        locale: 'EN',
        title: 'TiAjuda — Women Protection System',
        summary:
          "Protection and case-tracking system for women in situations of violence, centralizing the municipal protection network's operations with unified case history, traceable referrals and management data for public policy.",
        situation:
          'Care for women in situations of violence across municipal agencies in Timon was fragmented — no centralized history, no traceability of referrals and no management visibility over cases.',
        task: 'Build TiAjuda, a protection and case-tracking system for women in situations of violence, covering the full care cycle — from initial registration through referral to the support network and longitudinal case follow-up.',
        action: `## Registration and FONAR\n\nDesigned the structured occurrence and support request registration flow with full history linked to the person being served. Implemented the FONAR (National Risk Assessment Form) as a multi-step form following the national standard for domestic violence risk assessment.\n\n## Case Tracking\n\nBuilt the case tracking system with status, evolution history and a record of all interactions.\n\n## Support Network Referrals\n\nBuilt the referral flow to the support network — social assistance, healthcare, law enforcement, women's defense and legal support.\n\n## Management and Audit\n\nBuilt role-based access control and an admin module with full audit log and PDF/Excel reports.`,
        result:
          "TiAjuda centralized care across the municipal protection network — the Women's Secretariat, CRAS/CREAS, Social Assistance and Municipal Guard — with unified case history and traceable referrals. Official launch on March 13, 2026.",
      },
    ],
  },
  {
    slug: 'medusa-sistema-medicao-idepi',
    featured: true,
    mainImage: '/projects/medusa-sistema-medicao-idepi/cover.png',
    updatedAt: '2025-03-01T00:00:00.000Z',
    techs: [
      { name: 'NestJS', iconUrl: 'https://nestjs.com/img/logo-small.svg' },
      { name: 'Next.js', iconUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png' },
      { name: 'PostgreSQL', iconUrl: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg' },
      { name: 'Prisma', iconUrl: 'https://www.prisma.io/images/favicon-32x32.png' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
      { name: 'ExcelJS', iconUrl: null },
      { name: 'PDFKit', iconUrl: null },
      { name: 'MUI', iconUrl: null },
      { name: 'Docker', iconUrl: 'https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png' },
    ],
    tags: [
      { id: 'government', namePt: 'Governo', nameEn: 'Government' },
      { id: 'automation', namePt: 'Automação', nameEn: 'Automation' },
      { id: 'reports', namePt: 'Relatórios', nameEn: 'Reports' },
    ],
    metrics: [
      { value: '18', unit: null, order: 0, labelPt: 'Documentos Gerados Automaticamente', labelEn: 'Auto-Generated Documents' },
      { value: '0', unit: null, order: 1, labelPt: 'Geração Manual por Medição', labelEn: 'Manual Generation per Cycle' },
      { value: '100', unit: '%', order: 2, labelPt: 'Rastreabilidade de Desvios', labelEn: 'Deviation Traceability' },
    ],
    translations: [
      {
        locale: 'PT',
        title: 'Medusa — Sistema de Medição de Obras (IDEPI)',
        summary:
          'Plataforma completa de gestão de contratos de engenharia para o IDEPI/PI, eliminando a geração manual de 18 documentos por medição e automatizando o controle de cronogramas, desvios e reajustes contratuais.',
        situation:
          'O IDEPI controlava contratos, cronogramas e medições de obras em planilhas soltas e gerava manualmente 18 documentos por medição — um processo demorado, sujeito a erro e sem rastreabilidade. Não havia como comparar previsto com realizado de forma confiável ou controlar reajustes contratuais sem risco de erro manual.',
        task: 'Desenvolver do zero o Sistema de Medição do IDEPI, cobrindo desde o cadastro de contratos e cronogramas até o controle de medições, acompanhamento físico-financeiro, reajustes, dashboards gerenciais e geração automática de todos os documentos do processo.',
        action: `## Modelagem de Contratos\n\nModelei a estrutura de contratos e ordens de serviço com itens vinculados a cronogramas e fases do projeto.\n\n## Módulo de Medições\n\nImplementei o módulo de medições, consolidando automaticamente o avanço físico e o valor medido financeiramente.\n\n## Geração Automática de Documentos\n\nDesenvolvi a geração automática dos 18 documentos que antes eram produzidos manualmente, eliminando completamente esse trabalho por medição.\n\n## Controle de Desvios\n\nDesenvolvi a comparação previsto x realizado com identificação automática de desvios.\n\n\`\`\`typescript\ncalcularDesvio(previsto: Decimal, realizado: Decimal): DesvioStatus {\n  const pct = realizado.div(previsto).mul(100);\n  if (pct.gte(95) && pct.lte(105)) return 'NO_PRAZO';\n  if (pct.gt(105)) return 'ADIANTADO';\n  if (pct.lt(50)) return 'PARALISADO';\n  return 'ATRASADO';\n}\n\`\`\`\n\n## Dashboards\n\nConstruí dashboards com visão de previsto x realizado acumulado, progresso por item e alertas de prazos vencidos.`,
        result:
          'O IDEPI eliminou a geração manual de 18 documentos por medição — passando de planilhas para um fluxo automatizado, com controle estruturado de cronogramas, desvios e reajustes contratuais.',
      },
      {
        locale: 'EN',
        title: 'Medusa — Engineering Measurement System (IDEPI)',
        summary:
          'Complete engineering contract management platform for IDEPI/PI, eliminating the manual generation of 18 documents per measurement cycle and automating schedule control, deviation tracking and contract readjustments.',
        situation:
          'IDEPI managed contracts, schedules and construction measurements in separate spreadsheets and manually produced 18 documents per measurement cycle — time-consuming, error-prone and untraceable.',
        task: 'Build from scratch the IDEPI Measurement System covering contract and schedule registration, measurement control, physical-financial tracking, readjustments, management dashboards and automatic generation of all process documents.',
        action: `## Contract Modeling\n\nDesigned the contract and service order structure with items linked to schedules and project phases.\n\n## Measurement Module\n\nBuilt the measurement module with automatic consolidation of physical progress and measured financial value.\n\n## Automatic Document Generation\n\nBuilt automatic generation of the 18 documents previously produced manually.\n\n## Deviation Control\n\nBuilt planned vs. actual comparison with automatic deviation identification.\n\n## Dashboards\n\nBuilt dashboards with cumulative planned vs. actual view, per-item progress and overdue deadline alerts.`,
        result:
          'IDEPI eliminated the manual generation of 18 documents per measurement cycle, moving from manual spreadsheets to an automated flow with structured schedule, deviation and contract readjustment control.',
      },
    ],
  },
  {
    slug: 'tiescuta-avaliacao-servicos',
    featured: false,
    mainImage: '/projects/tiescuta-avaliacao-servicos/cover.png',
    updatedAt: '2025-03-01T00:00:00.000Z',
    techs: [
      { name: 'NestJS', iconUrl: 'https://nestjs.com/img/logo-small.svg' },
      { name: 'Next.js', iconUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png' },
      { name: 'PostgreSQL', iconUrl: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg' },
      { name: 'Prisma', iconUrl: 'https://www.prisma.io/images/favicon-32x32.png' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
      { name: 'MUI', iconUrl: null },
    ],
    tags: [
      { id: 'government', namePt: 'Governo', nameEn: 'Government' },
      { id: 'civic-tech', namePt: 'Civic Tech', nameEn: 'Civic Tech' },
      { id: 'reports', namePt: 'Relatórios', nameEn: 'Reports' },
    ],
    metrics: [{ value: 'NPS', unit: null, order: 0, labelPt: 'Por Secretaria e Período', labelEn: 'Per Secretariat and Period' }],
    translations: [
      {
        locale: 'PT',
        title: 'TiEscuta — Avaliação de Serviços Públicos',
        summary:
          'Sistema de avaliação de serviços públicos municipais com NPS, coleta por QR code e gestão de tickets, substituindo a percepção subjetiva por evidência mensurável sobre a qualidade dos serviços.',
        situation:
          'A prefeitura de Timon não tinha forma estruturada de coletar a opinião dos cidadãos sobre os serviços municipais. O feedback era esporádico, informal e sem rastreabilidade.',
        task: 'Desenvolver o TiEscuta, um sistema de avaliação de serviços públicos municipais com NPS, coleta por QR code, gestão de tickets e acompanhamento gerencial dos resultados.',
        action: `## Coleta via QR Code\n\nImplementei coleta de avaliações via QR code, permitindo que o cidadão avaliasse o atendimento no momento em que ele acontecia, sem fricção.\n\n## NPS\n\nDesenvolvi o módulo de NPS com cálculo automático de score por secretaria, serviço e período.\n\n\`\`\`typescript\ncalcularNPS(avaliacoes: Avaliacao[]): number {\n  const promotores = avaliacoes.filter(a => a.nota >= 9).length;\n  const detratores = avaliacoes.filter(a => a.nota <= 6).length;\n  return Math.round(((promotores - detratores) / avaliacoes.length) * 100);\n}\n\`\`\`\n\n## Tickets e Painéis\n\nConstruí gestão de tickets de avaliações negativas e painéis gerenciais com evolução do NPS e relatórios exportáveis.`,
        result:
          'A prefeitura passou a ter dados reais e contínuos sobre a qualidade dos serviços municipais, com NPS por secretaria, rastreabilidade dos feedbacks negativos via tickets e insumo concreto para decisões de melhoria.',
      },
      {
        locale: 'EN',
        title: 'TiEscuta — Public Service Evaluation',
        summary:
          'Municipal public service evaluation system with NPS, QR code collection and ticket management, replacing subjective perception with measurable evidence about service quality.',
        situation:
          'The City of Timon had no structured way to collect citizen feedback on municipal services. Feedback was sporadic, informal and untraceable.',
        task: 'Build TiEscuta, a municipal public service evaluation system with NPS, QR code collection, ticket management and management dashboards.',
        action: `## QR Code Collection\n\nImplemented QR code-based evaluation collection, allowing citizens to rate a service at the exact moment it happened.\n\n## NPS\n\nBuilt the NPS module with automatic score calculation per secretariat, service and period.\n\n## Tickets and Dashboards\n\nBuilt negative evaluation ticket management and dashboards with NPS evolution and exportable reports.`,
        result:
          'The city now has real, continuous data on municipal service quality — with NPS per secretariat and traceability of negative feedback via tickets.',
      },
    ],
  },
  {
    slug: 'iptu-premiado-timon',
    featured: false,
    mainImage: '/projects/iptu-premiado-timon/cover.png',
    updatedAt: '2025-03-01T00:00:00.000Z',
    techs: [
      { name: 'NestJS', iconUrl: 'https://nestjs.com/img/logo-small.svg' },
      { name: 'Next.js', iconUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png' },
      { name: 'PostgreSQL', iconUrl: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg' },
      { name: 'Prisma', iconUrl: 'https://www.prisma.io/images/favicon-32x32.png' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
      { name: 'ExcelJS', iconUrl: null },
    ],
    tags: [
      { id: 'government', namePt: 'Governo', nameEn: 'Government' },
      { id: 'civic-tech', namePt: 'Civic Tech', nameEn: 'Civic Tech' },
      { id: 'automation', namePt: 'Automação', nameEn: 'Automation' },
    ],
    metrics: [
      { value: '100', unit: '%', order: 0, labelPt: 'Transparência no Sorteio', labelEn: 'Lottery Transparency' },
      { value: '0', unit: null, order: 1, labelPt: 'Intervenção Manual', labelEn: 'Manual Interventions' },
    ],
    translations: [
      {
        locale: 'PT',
        title: 'IPTU Premiado — Sorteio Municipal',
        summary:
          'Sistema completo do programa IPTU Premiado de Timon, cobrindo importação de contribuintes, validação de elegibilidade, sorteio público com interface animada e gestão de prêmios.',
        situation:
          'A Prefeitura de Timon queria incentivar a regularização do IPTU através de um programa de sorteio para contribuintes em dia, mas não havia nenhum sistema para isso. O processo precisava ser transparente e auditável.',
        task: 'Desenvolver o sistema completo do IPTU Premiado, cobrindo importação da base de contribuintes, validação de elegibilidade, sorteio público com interface animada e gestão dos prêmios.',
        action: `## Importação e Elegibilidade\n\nDesenvolvi a importação de contribuintes e imóveis a partir de planilhas Excel, com validação de elegibilidade automática baseada em situação fiscal.\n\n## Sorteio Auditável\n\nImplementei a lógica de sorteio com geração auditável dos ganhadores. Construí a interface pública com animações para transmissão ao vivo.\n\n\`\`\`typescript\nasync sortear(programaId: string): Promise<Ganhador[]> {\n  const elegiveis = await this.prisma.contribuinte.findMany({\n    where: { programaId, eligible: true, sorteado: false },\n  });\n  const ganhadores = fisherYatesSample(elegiveis, programa.qtdPremios);\n  await this.prisma.contribuinte.updateMany({\n    where: { id: { in: ganhadores.map(g => g.id) } },\n    data: { sorteado: true },\n  });\n  return ganhadores;\n}\n\`\`\`\n\n## Gestão de Prêmios\n\nDesenvolvi o módulo de gestão de prêmios com controle de entrega e histórico por ganhador.`,
        result:
          'O sorteio foi realizado publicamente com transparência total sobre os critérios de elegibilidade e rastreabilidade dos ganhadores — reforçando a credibilidade do programa.',
      },
      {
        locale: 'EN',
        title: 'IPTU Premiado — Municipal Property Tax Lottery',
        summary:
          "Complete system for Timon's IPTU Premiado program, covering taxpayer import, eligibility validation, public lottery with animated interface and prize management.",
        situation:
          'The City of Timon wanted to incentivize property tax compliance through a lottery program, but no system existed. The process needed to be transparent and auditable.',
        task: 'Build the complete IPTU Premiado system covering taxpayer import, eligibility validation, public lottery with animated interface and prize management.',
        action: `## Import and Eligibility\n\nBuilt taxpayer and property import from Excel with automatic eligibility validation based on tax standing.\n\n## Auditable Lottery\n\nImplemented lottery draw logic with auditable winner generation and a live broadcast-ready animated public interface.\n\n## Prize Management\n\nBuilt prize management with delivery tracking and per-winner history.`,
        result:
          "The lottery was publicly held with full transparency over eligibility criteria and winner traceability — reinforcing the program's credibility.",
      },
    ],
  },
  {
    slug: 'sapl-refactor-camara-timon',
    featured: false,
    mainImage: '/projects/sapl-refactor-camara-timon/cover.png',
    updatedAt: '2025-03-01T00:00:00.000Z',
    techs: [
      { name: 'Next.js', iconUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png' },
      { name: 'React', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
      { name: 'MUI', iconUrl: null },
    ],
    tags: [
      { id: 'government', namePt: 'Governo', nameEn: 'Government' },
      { id: 'migration', namePt: 'Migração', nameEn: 'Migration' },
    ],
    metrics: [
      { value: '0', unit: null, order: 0, labelPt: 'Regras de Negócio Alteradas', labelEn: 'Business Rules Changed' },
      { value: '100', unit: '%', order: 1, labelPt: 'Compatibilidade com Backend Original', labelEn: 'Original Backend Compatibility' },
    ],
    translations: [
      {
        locale: 'PT',
        title: 'SAPL — Modernização do Frontend Legislativo',
        summary:
          'Reconstrução completa do frontend do SAPL da Câmara Municipal de Timon, entregando interface moderna sobre backend original intacto sem alterar nenhuma regra de negócio.',
        situation:
          'A Câmara Municipal de Timon utilizava o SAPL com uma interface defasada, de difícil uso no dia a dia pelos servidores e parlamentares. A regra de negócio era sólida, mas a experiência de uso comprometia a adoção e a produtividade.',
        task: 'Em conjunto com outros dois desenvolvedores, refazer todo o frontend do SAPL mantendo o backend original intacto, cobrindo gestão de matérias, sessões, votações, tramitações, pautas e registros institucionais.',
        action: `## Análise do Sistema Legado\n\nAnalisei o backend original do SAPL para mapear APIs, fluxos e regras de negócio antes de iniciar a reconstrução, garantindo compatibilidade total.\n\n## Reconstrução Frontend\n\nContribuí na reconstrução em Next.js/React com MUI, mantendo compatibilidade total com o backend original sem alterar nenhuma regra de negócio.\n\n## Módulos Desenvolvidos\n\nDesenvolvi interfaces de gestão de matérias legislativas, proposições, tramitações, sessões, pautas, votações e telas institucionais de vereadores, expedientes, documentos, presença e ordens do dia.`,
        result:
          'A Câmara Municipal passou a operar com interface moderna sobre base funcional consolidada — preservando a maturidade do backend enquanto entregava ganho real de usabilidade.',
      },
      {
        locale: 'EN',
        title: 'SAPL — Legislative System Frontend Modernization',
        summary:
          "Complete frontend rebuild of the SAPL for Timon's City Council, delivering a modern interface on top of an untouched original backend without changing any business logic.",
        situation:
          "Timon's City Council used SAPL with an outdated interface hard to use day-to-day. The business logic was solid but the user experience undermined adoption and productivity.",
        task: 'Working with two other developers, rebuild the entire SAPL frontend while keeping the original backend intact, covering bill management, sessions, votes, workflows, agendas and institutional records.',
        action: `## Legacy System Analysis\n\nAnalyzed the original SAPL backend to map APIs, flows and existing business rules before starting the rebuild.\n\n## Frontend Rebuild\n\nContributed to the frontend rebuild in Next.js/React with MUI, maintaining full compatibility without touching any business rules.\n\n## Modules Delivered\n\nBuilt management interfaces for legislative bills, propositions, workflows, sessions, agendas, votes and institutional screens.`,
        result:
          'The City Council now operates with a modern interface on top of a solid functional foundation — preserving the original backend while delivering real usability gains.',
      },
    ],
  },
  {
    slug: 'etiquetix-impressao-etiquetas',
    featured: false,
    mainImage: '/projects/etiquetix-impressao-etiquetas/cover.png',
    updatedAt: '2025-03-01T00:00:00.000Z',
    techs: [
      { name: 'NestJS', iconUrl: 'https://nestjs.com/img/logo-small.svg' },
      { name: 'React', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
      { name: 'PostgreSQL', iconUrl: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg' },
      { name: 'Prisma', iconUrl: 'https://www.prisma.io/images/favicon-32x32.png' },
    ],
    tags: [
      { id: 'integration', namePt: 'Integração', nameEn: 'Integration' },
      { id: 'automation', namePt: 'Automação', nameEn: 'Automation' },
    ],
    metrics: [
      { value: '0', unit: null, order: 0, labelPt: 'Software Proprietário Necessário', labelEn: 'Proprietary Software Required' },
      { value: '100', unit: '%', order: 1, labelPt: 'Preview Antes de Imprimir', labelEn: 'Pre-Print Preview' },
    ],
    translations: [
      {
        locale: 'PT',
        title: 'Etiquetix — Impressão de Etiquetas para Restaurantes',
        summary:
          'Sistema de impressão de etiquetas com QR code, múltiplos layouts, preview visual em HTML e comunicação direta com impressora térmica ARGOX via protocolo PPLA — sem depender de software proprietário.',
        situation:
          'Restaurantes precisam imprimir etiquetas de identificação de produtos mas não tinham uma solução acessível que funcionasse com impressoras térmicas de baixo custo como a ARGOX OS-214 Plus. As alternativas eram caras, genéricas ou não suportavam o protocolo PPLA.',
        task: 'Desenvolver do zero o Etiquetix, um sistema de impressão de etiquetas com QR code, múltiplos layouts, preview visual em HTML e comunicação direta com impressora térmica via USB usando comandos PPLA.',
        action: `## Protocolo PPLA\n\nImplementei a comunicação direta com a impressora ARGOX OS-214 Plus via USB, construindo a camada de envio de comandos PPLA do zero após extenso debugging do protocolo.\n\n\`\`\`typescript\nfunction buildPPLALabel(data: LabelData): string {\n  const cmds: string[] = [];\n  cmds.push(\`S L\\n\`);\n  cmds.push(\`BARCODE QR \\\${data.x},\\\${data.y},\\\"\\\${data.qrContent}\\\",3,0\\n\`);\n  cmds.push(\`TEXT 1,0,\\\"\\\${data.productName}\\\",\\\${data.nameX},\\\${data.nameY}\\n\`);\n  cmds.push(\`E\\n\`);\n  return cmds.join('');\n}\n\`\`\`\n\n## Preview e Múltiplos Layouts\n\nDesenvolvi suporte a múltiplos tamanhos de layout e um sistema de preview visual em HTML para conferir antes de imprimir.\n\n## QR Code e Logo\n\nImplementei geração de QR code e conversão de logo para BMP compatível com o protocolo da impressora.`,
        result:
          'O Etiquetix entrega uma solução completa de impressão de etiquetas para restaurantes, com preview, QR code, múltiplos layouts e integração direta com impressora de baixo custo — sem software proprietário.',
      },
      {
        locale: 'EN',
        title: 'Etiquetix — Restaurant Label Printing System',
        summary:
          'Custom label printing system for restaurants with QR code, multiple layouts, HTML visual preview and direct ARGOX thermal printer communication via PPLA protocol.',
        situation:
          "Restaurants needed to print product labels but had no affordable solution compatible with low-cost thermal printers like the ARGOX OS-214 Plus. Existing alternatives were expensive, generic or didn't support PPLA.",
        task: 'Build from scratch Etiquetix, a restaurant label printing system with QR code generation, multiple layouts, HTML visual preview and direct USB communication using PPLA commands.',
        action: `## PPLA Protocol\n\nBuilt direct USB communication with the ARGOX OS-214 Plus printer, implementing the PPLA command layer from scratch after extensive debugging.\n\n## Multiple Layouts and Preview\n\nBuilt support for multiple label sizes and an HTML preview system for layout verification before printing.\n\n## QR Code and Logo\n\nImplemented QR code generation and logo conversion to BMP format compatible with the printer protocol.`,
        result:
          'Etiquetix delivers a complete label printing solution for restaurants — with pre-print preview, QR code, multi-layout support and direct thermal printer integration, without proprietary software.',
      },
    ],
  },
  {
    slug: 'integracao-nayax-saipos',
    featured: false,
    mainImage: '/projects/integracao-nayax-saipos/cover.png',
    updatedAt: '2025-03-01T00:00:00.000Z',
    techs: [
      { name: 'NestJS', iconUrl: 'https://nestjs.com/img/logo-small.svg' },
      { name: 'PostgreSQL', iconUrl: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg' },
      { name: 'Prisma', iconUrl: 'https://www.prisma.io/images/favicon-32x32.png' },
      { name: 'TypeScript', iconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
    ],
    tags: [
      { id: 'integration', namePt: 'Integração', nameEn: 'Integration' },
      { id: 'automation', namePt: 'Automação', nameEn: 'Automation' },
    ],
    metrics: [
      { value: '0', unit: null, order: 0, labelPt: 'Registros Manuais de Pagamento', labelEn: 'Manual Payment Registrations' },
      { value: '100', unit: '%', order: 1, labelPt: 'Garantia de Entrega', labelEn: 'Delivery Guarantee' },
    ],
    translations: [
      {
        locale: 'PT',
        title: 'Integração Nayax → Saipos',
        summary:
          'Integração entre o sistema de pagamentos Nayax e o sistema de pedidos Saipos com padrão outbox/fila, tratamento de duplicatas e Dead Letter Queue — eliminando o registro manual com garantia de entrega.',
        situation:
          'A empresa precisava integrar o Nayax com o Saipos, mas as plataformas não se comunicavam nativamente. Pagamentos não eram registrados automaticamente, gerando retrabalho manual e falta de rastreabilidade.',
        task: 'Desenvolver uma integração NestJS entre Nayax e Saipos garantindo que pagamentos fossem automaticamente refletidos como pedidos, com confiabilidade e rastreabilidade.',
        action: `## Padrão Outbox\n\nImplementei o padrão outbox com fila de jobs para garantir que nenhum pagamento fosse perdido em caso de falha:\n\n\`\`\`typescript\nasync processPayment(event: NayaxPaymentEvent) {\n  return this.prisma.$transaction(async (tx) => {\n    const payment = await tx.payment.create({ data: mapNayaxPayment(event) });\n    await tx.outbox.create({\n      data: { payload: payment, eventType: 'PAYMENT_RECEIVED', status: 'PENDING' }\n    });\n    return payment;\n  });\n}\n\`\`\`\n\n## Mapeamento e Deduplicação\n\nDesenvolvi mapeamento de tipos de pagamento entre os formatos Nayax e Saipos e tratamento de IDs duplicados.\n\n## Dead Letter Queue\n\nConstruí DLQ para isolar jobs que falharam repetidamente, permitindo análise e reprocessamento manual.`,
        result:
          'A integração entrou em produção eliminando o registro manual — com garantia de entrega via outbox/fila, tratamento de duplicatas e DLQ para rastreabilidade de falhas.',
      },
      {
        locale: 'EN',
        title: 'Nayax → Saipos Integration',
        summary:
          'Integration between the Nayax payment system and Saipos order management with outbox/queue pattern, duplicate handling and Dead Letter Queue — eliminating manual registration with delivery guarantees.',
        situation:
          'The company needed to integrate Nayax with Saipos, but the platforms had no native communication. Payments were not automatically recorded, generating manual rework and lack of traceability.',
        task: 'Build a NestJS-based integration between Nayax and Saipos ensuring payments were automatically reflected as orders, with reliability and traceability.',
        action: `## Outbox Pattern\n\nImplemented the outbox pattern with a job queue to ensure no payment was lost during temporary failures.\n\n## Mapping and Deduplication\n\nBuilt payment type mapping between Nayax and Saipos formats and duplicate order ID handling.\n\n## Dead Letter Queue\n\nBuilt a DLQ to isolate repeatedly failing jobs for manual analysis and reprocessing.`,
        result:
          'The integration went live eliminating manual payment registration — with delivery guarantees, duplicate handling and a DLQ for failure traceability.',
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug);
}
