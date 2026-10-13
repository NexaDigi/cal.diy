# Nexa Agenda - Base de desenvolvimento

## Fonte oficial

- Repositorio: `https://github.com/calcom/cal.diy`
- Branch: `main`
- Commit usado neste snapshot: `176037d0afbe572f870a3c702985e7cd83fe6c0c`
- Data de obtencao: 2026-08-08
- Arquivo preservado: `../artifacts/upstream/cal.diy-main-176037d.zip`

## Estrutura canonica

- `source/`: unica arvore de codigo usada para a edicao Nexa.
- `history/`: tentativas incompletas preservadas apenas para auditoria. Nao usar para desenvolvimento.
- `../artifacts/`: arquivos de origem e evidencias de build.

## Regras de trabalho

1. Alteracoes Nexa sao feitas somente em `source/`.
2. Nenhuma publicacao na VPS ocorre sem validacao local, imagem versionada e rollback registrado.
3. `NexaDigi/cal.diy` e o unico fork de destino. Nao criar forks paralelos.
4. A edicao Nexa nao cobra por usuario, membro, equipe ou assento. A comercializacao da Nexa cobre exclusivamente a implantacao e a operacao contratada da VPS.

## Ferramentas do projeto

- Gerenciador de pacotes: Yarn 4.12.0, fornecido em `source/.yarn/releases/`.
- Estrutura: monorepo com Turbo, Next.js e Prisma.
- Dependencias ainda nao foram instaladas nesta base local.
