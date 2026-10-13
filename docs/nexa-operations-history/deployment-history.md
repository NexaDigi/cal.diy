# Deploy

Esta pasta guarda o material de deploy do fork do Cal.com.

## Estado atual observado

- Stack Swarm: `calcom`
- Service: `calcom_calcom_app`
- Imagem anterior: `calcom/cal.com:latest`
- Imagem atual: `ghcr.io/nexadigi/cal-diy:0.0.3`
- Dominio: `https://calendario.nexadigi.com.br`
- Compose persistido no Portainer: `/var/lib/docker/volumes/portainer_data/_data/compose/36/docker-compose.yml`
- Rede Traefik/Swarm: `nexa`

## Alvo recomendado

Trocar o uso de `latest` por uma imagem propria e versionada:

```text
ghcr.io/nexadigi/cal-diy:0.0.3
```

ou outro registry definido depois.

## Fluxo seguro

1. Buildar imagem do fork.
2. Rodar smoke test local/container.
3. Enviar imagem para registry.
4. Fazer backup do compose do Portainer.
5. Atualizar apenas `image:` no compose da stack `calcom`.
6. Validar `docker stack config`.
7. Fazer `docker stack deploy -c <compose> calcom`.
8. Validar service `1/1` e endpoint publico.

## Arquivos

- `calcom-fork-stack.template.yml`: template Swarm/Traefik para a imagem propria do fork.

## Rollback rapido

Imagem anterior:

```text
calcom/cal.com:latest@sha256:ace3bb1219fb7306585ab9f4d94d41af7ee064c343db0498173436bbe857bd49
```

Backup do compose antes da troca:

```text
/var/lib/docker/volumes/portainer_data/_data/compose/36/docker-compose.yml.bak.20260808-143634-calcom-fork-image
```

Backup antes de remover single-org:

```text
/var/lib/docker/volumes/portainer_data/_data/compose/36/docker-compose.yml.bak.20260808-151904-remove-single-org-slug
```
