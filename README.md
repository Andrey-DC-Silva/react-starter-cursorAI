# React Starter — Full Stack

Aplicação web full-stack com **Next.js (App Router)**, **React**, **JavaScript**, **PostgreSQL** (Prisma), autenticação **JWT** em cookie httpOnly e **painel administrativo**.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19 + Next.js 15 (App Router) |
| API | Route Handlers REST (`/api/*`) |
| Auth | JWT (jose) + cookie httpOnly + bcrypt |
| Banco | PostgreSQL + Prisma ORM |
| Validação | Zod |
| Estilo | Tailwind CSS v4 |

## Estrutura de pastas

```
react-starter/
├── prisma/
│   ├── schema.prisma      # Modelos e migrations
│   └── seed.js            # Usuário admin inicial
├── src/
│   ├── app/               # Rotas (pages + API)
│   │   ├── (auth)/        # Login e registro
│   │   ├── admin/         # Painel administrativo
│   │   └── api/           # REST API
│   ├── components/        # UI reutilizável
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/               # Infraestrutura
│   │   ├── auth/          # JWT, sessão, guards
│   │   ├── api/           # Respostas padronizadas
│   │   └── validators/    # Schemas Zod
│   └── middleware.js      # Proteção de rotas admin
├── .env.example
└── package.json
```

## Pré-requisitos

- Node.js 20+
- PostgreSQL em execução

## Configuração

1. Instale dependências:

```bash
npm install
```

2. Copie o ambiente e ajuste a conexão:

```bash
cp .env.example .env
```

3. Aplique o schema e gere o client Prisma:

```bash
npm run db:push
```

4. Crie o usuário administrador:

```bash
npm run db:seed
```

Credenciais padrão do seed: `admin@example.com` / `Admin123!`

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## API REST

Todas as respostas seguem `{ success, data }` ou `{ success: false, error: { code, message } }`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login (define cookie JWT) |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Usuário autenticado |
| GET | `/api/admin/users` | Lista usuários (ADMIN) |

Autenticação na API: cookie `access_token` ou header `Authorization: Bearer <token>`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run db:push` | Sincroniza schema com o banco |
| `npm run db:migrate` | Migrations versionadas |
| `npm run db:seed` | Seed do admin |
| `npm run db:studio` | Prisma Studio |

## Próximos passos sugeridos

- Refresh tokens e rotação de sessão
- CRUD completo de usuários no admin
- Testes (Vitest + Playwright)
- Rate limiting e auditoria de login
- Deploy (Vercel + Neon/Supabase)

## Licença

MIT
