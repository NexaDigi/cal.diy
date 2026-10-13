# Inventario Inicial

Data: 2026-08-08

## GitHub

- Conta autenticada localmente: `NexaDigi`
- Fork criado: `https://github.com/NexaDigi/cal.diy`
- Upstream: `https://github.com/calcom/cal.diy`
- Commit base local/archive: `b2c28a23ab5b53f2e3729657d23cccb50f64e18a`
- Commit que adicionou workflow Nexa GHCR: `427af1ced6a0a7a57897ac7d5696e0e36c1b750f`
- Source archive local: `source-archive/cal.diy-main`
- GitHub Actions build: `https://github.com/NexaDigi/cal.diy/actions/runs/31269087546`
- Resultado do build GHCR: sucesso
- Imagem publicada: `ghcr.io/nexadigi/cal-diy:20260808-b2c28a23`
- Manifest da imagem: validado com `docker manifest inspect`

## VPS

- Host: `SRVNexa`
- Sistema: Debian 11
- Docker: 29.7.2
- Swarm: ativo
- Edge publico: Traefik em 80/443

## Cal.com atual

- Stack: `calcom`
- Service: `calcom_calcom_app`
- Replicas apos validacao: `1/1`
- Dominio validado: `https://calendario.nexadigi.com.br/auth/login`
- Login HTML: `200`
- Asset CSS: `200`
- Asset JS: `200`
- Imagem ativa apos deploy do fork: `ghcr.io/nexadigi/cal-diy:20260808-b2c28a23@sha256:772dbdf64d17053c885a9f08ac27b5bb2fdf52cbd3648de7cc6dc702dda3209d`
- Imagem anterior para rollback: `calcom/cal.com:latest@sha256:ace3bb1219fb7306585ab9f4d94d41af7ee064c343db0498173436bbe857bd49`

## Ajuste aplicado

Foi adicionada a variavel:

```text
ALLOWED_HOSTNAMES="nexadigi.com.br"
```

no compose persistido do Portainer.

Backups criados na VPS:

- `/var/lib/docker/volumes/portainer_data/_data/compose/36/docker-compose.yml.bak.20260808-134051-calcom-allowed-hostnames`
- `/var/lib/docker/volumes/portainer_data/_data/compose/36/docker-compose.yml.bak.20260808-134333-calcom-allowed-hostnames-format-fix`
- `/var/lib/docker/volumes/portainer_data/_data/compose/36/docker-compose.yml.bak.20260808-143634-calcom-fork-image`
- `/root/calcom-fork-rollback-20260808-143634.txt`
- `/root/nexa-calcom-backups/20260808-151455`
- `/var/lib/docker/volumes/portainer_data/_data/compose/36/docker-compose.yml.bak.20260808-151904-remove-single-org-slug`
- `/root/calcom-remove-single-org-rollback-20260808-151904.txt`

## Deploy do fork

Data: 2026-08-08

Resultado:

- Pull da imagem na VPS: sucesso.
- `docker stack config`: sucesso.
- `docker stack deploy`: sucesso.
- Service `calcom_calcom_app`: `1/1`.
- Endpoint `/`: `307` para `/auth/login`.
- Endpoint `/auth/login`: `200`.
- CSS e JS do build novo: `200`.

## Backup pos-deploy antes de hardening

Diretorio:

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

Contagem do banco `calcom`:

```text
users|1
Profile|0
Team|0
ManagedOrganization|0
EventType|3
Booking|0
Credential|0
```

## Remocao do modo single-org

Data: 2026-08-08

Removido do compose:

```text
NEXT_PUBLIC_SINGLE_ORG_SLUG=Calcom TEST
```

Validacao:

```text
Service: calcom_calcom_app 1/1
NEXT_PUBLIC_SINGLE_ORG_SLUG=
ORGANIZATIONS_ENABLED=
https://calendario.nexadigi.com.br/auth/login -> 200
https://calendario.nexadigi.com.br/api/auth/session -> 200 {}
```

## Pendencias

- Substituir imagem `latest` por tag fixa publicada no GHCR.
- Decidir se o banco do Cal.com continua no Postgres compartilhado ou ganha Postgres dedicado.
- Revisar `NEXT_PUBLIC_SINGLE_ORG_SLUG=Calcom TEST`.
- Gerar VAPID keys se push notification for necessario.
- Configurar credenciais Google/Microsoft somente quando houver conta/projeto definidos.
