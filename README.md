# Murialdo Content Studio

Aplicação Node.js (Express) para gerar conteúdo institucional escolar com OpenAI, retorno em JSON estruturado e histórico automático em arquivo JSON.

## Funcionalidades
- Geração de conteúdo institucional orientado a campanha.
- Saída estruturada em JSON para uso por outros sistemas.
- Histórico persistido em `data/history.json`.
- Frontend simples em HTML/CSS/JS servido por `/content`.
- Configurações prontas para Nginx e PM2.

## Como rodar
```bash
cp .env.example .env
npm install
npm run dev
```

Acesse:
- Frontend: `http://localhost:3000/content`
- Health: `http://localhost:3000/api/health`

## Endpoints
### `POST /api/content/generate`
Gera e salva conteúdo.

Exemplo de body:
```json
{
  "schoolName": "Colégio Murialdo",
  "audience": "Famílias com filhos no ensino fundamental",
  "objective": "Captação de matrículas",
  "tone": "Institucional acolhedor",
  "channels": ["instagram", "email"],
  "additionalContext": "Campanha segundo semestre"
}
```

### `GET /api/history`
Retorna histórico de gerações.

## Deploy
- PM2: `pm2 start ecosystem.config.cjs`
- Nginx: usar `config/nginx.conf` como base de reverse proxy.
