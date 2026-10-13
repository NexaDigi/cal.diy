# Pos-deploy Hardening

Data: 2026-08-08

## Estado validado

- Service: `calcom_calcom_app`
- Replicas: `1/1`
- Imagem ativa: `ghcr.io/nexadigi/cal-diy:20260808-b2c28a23@sha256:772dbdf64d17053c885a9f08ac27b5bb2fdf52cbd3648de7cc6dc702dda3209d`
- URL: `https://calendario.nexadigi.com.br/auth/login`
- HTML/CSS/JS: `200`

## Banco

Banco usado: `calcom` no service compartilhado `postgres_postgres`.

Contagem observada:

```text
users|1
Profile|0
Team|0
ManagedOrganization|0
EventType|3
Booking|0
Credential|0
```

## Backup antes de ajustes

```text
/root/nexa-calcom-backups/20260808-151455
```

Conteudo:

```text
calcom.pgcustom
docker-compose.yml
README.txt
SHA256SUMS
```

Hashes:

```text
4b0330904f06e504abfafaa6ef0f89b9ab48a9699a90717825157b1ef71fb6d8  calcom.pgcustom
75159045506be3cba6754301d53ec685b13332dcbe0c68fb419b62c28a35cfcd  docker-compose.yml
```

## Decisoes pendentes

### Single-org

Configuracao anterior:

```text
NEXT_PUBLIC_SINGLE_ORG_SLUG=Calcom TEST
```

Removido em 2026-08-08 apos backup.

Backups/rollback:

```text
/var/lib/docker/volumes/portainer_data/_data/compose/36/docker-compose.yml.bak.20260808-151904-remove-single-org-slug
/root/calcom-remove-single-org-rollback-20260808-151904.txt
```

Validacao apos remover:

```text
NEXT_PUBLIC_SINGLE_ORG_SLUG=
ORGANIZATIONS_ENABLED=
Service: 1/1
/auth/login: 200
/api/auth/session: 200 {}
```

### Google Calendar

Estado:

```text
GOOGLE_LOGIN_ENABLED e GOOGLE_API_CREDENTIALS nao estao ativos no compose.
GOOGLE_API_CREDENTIALS length no container: 0
GOOGLE_CALENDAR_API_KEY length no container: 0
GOOGLE_WEBHOOK_TOKEN length no container: 0
Credential|0 no banco.
```

O log ainda pode emitir `Error adding google credentials to DB: Unexpected end of JSON input` no startup. Como as variaveis estao vazias e `Credential|0`, tratar como pendencia de configuracao, nao falha de deploy.

Proximo passo: criar projeto Google Cloud, OAuth consent, credenciais Web e redirect URI publico antes de ativar.

### VAPID

Estado: chaves VAPID ausentes. Push notification fica desabilitado.

Proximo passo somente se notificacao web for requisito.

### Banco dedicado

Atualmente o Cal.com usa o Postgres compartilhado `postgres_postgres`. Para uso serio, preferir database/role isolados ou stack Postgres dedicada.
