# Build e Publicacao da Imagem do Fork

Fonte local valida:

```text
C:\Users\pedro\OneDrive\Documentos\VPS NEXA\open-source-forks\calcom\source-archive\cal.diy-main
```

Commit base:

```text
b2c28a23ab5b53f2e3729657d23cccb50f64e18a
```

## Tag recomendada

```text
ghcr.io/nexadigi/cal-diy:20260808-b2c28a23
```

## Build local

Rodar a partir da pasta `source-archive/cal.diy-main`.

```powershell
docker build `
  --build-arg NEXT_PUBLIC_WEBAPP_URL=https://calendario.nexadigi.com.br `
  --build-arg NEXT_PUBLIC_API_V2_URL=https://calendario.nexadigi.com.br/api/v2 `
  --build-arg CALCOM_TELEMETRY_DISABLED=1 `
  --build-arg NEXTAUTH_SECRET=build-time-placeholder `
  --build-arg CALENDSO_ENCRYPTION_KEY=build-time-placeholder `
  --build-arg DATABASE_URL=postgresql://postgres:placeholder@postgres:5432/calcom `
  --build-arg NEXT_PUBLIC_SINGLE_ORG_SLUG= `
  --build-arg ORGANIZATIONS_ENABLED= `
  -t ghcr.io/nexadigi/cal-diy:20260808-b2c28a23 `
  .
```

Nao usar segredos reais como build args. Os valores sensiveis devem entrar no runtime pela stack.

## Login no GHCR

```powershell
gh auth token | docker login ghcr.io -u NexaDigi --password-stdin
```

## Push

```powershell
docker push ghcr.io/nexadigi/cal-diy:20260808-b2c28a23
```

## Build via GitHub Actions

Foi criado no fork o workflow manual:

```text
.github/workflows/nexa-build-cal-diy.yml
```

Commit do workflow:

```text
427af1ced6a0a7a57897ac7d5696e0e36c1b750f
```

Disparar:

```powershell
gh workflow run nexa-build-cal-diy.yml -R NexaDigi/cal.diy -f image_tag=20260808-b2c28a23
```

Monitorar:

```powershell
gh run list -R NexaDigi/cal.diy --workflow nexa-build-cal-diy.yml --limit 3
gh run watch -R NexaDigi/cal.diy <run-id>
```

Build executado:

```text
Run: https://github.com/NexaDigi/cal.diy/actions/runs/31269087546
Status: success
Imagem: ghcr.io/nexadigi/cal-diy:20260808-b2c28a23
Manifest: validado
```

Deploy executado na VPS:

```text
Service: calcom_calcom_app
Status: 1/1
Imagem ativa: ghcr.io/nexadigi/cal-diy:20260808-b2c28a23@sha256:772dbdf64d17053c885a9f08ac27b5bb2fdf52cbd3648de7cc6dc702dda3209d
Endpoint: https://calendario.nexadigi.com.br/auth/login
Resultado: 200
```

## Deploy

Antes de trocar a imagem em producao:

1. Capturar `docker service inspect calcom_calcom_app`.
2. Fazer backup do compose atual do Portainer.
3. Trocar somente `image:` para `ghcr.io/nexadigi/cal-diy:20260808-b2c28a23`.
4. Rodar `docker stack config`.
5. Rodar `docker stack deploy`.
6. Validar `docker service ls`, logs e `https://calendario.nexadigi.com.br/auth/login`.
