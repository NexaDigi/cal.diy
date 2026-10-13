# Runbook do Fork Cal.com

## Clonar o fork

O monorepo e grande. Preferir clone parcial:

```powershell
git clone --filter=blob:none --single-branch --branch main https://github.com/NexaDigi/cal.diy.git repo
```

Se precisar reduzir ainda mais:

```powershell
git clone --filter=blob:none --sparse --single-branch --branch main https://github.com/NexaDigi/cal.diy.git repo
Set-Location repo
git sparse-checkout set apps/web packages prisma docker-compose.yaml Dockerfile package.json yarn.lock turbo.json
```

## Sincronizar upstream

```powershell
git remote add upstream https://github.com/calcom/cal.diy.git
git fetch upstream main
git checkout main
git merge upstream/main
```

## Build/deploy esperado

Ainda nao executar em producao sem validar o Dockerfile atual do fork.

Checklist minimo:

```powershell
git status
docker build -t ghcr.io/nexadigi/cal-diy:test .
docker run --rm ghcr.io/nexadigi/cal-diy:test node --version
```

Depois disso, criar tag versionada e atualizar a stack `calcom`.

