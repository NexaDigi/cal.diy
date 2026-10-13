# Nexa Agenda: times sem cobranca por assento

Esta adaptacao atende instalacoes auto-hospedadas da Nexa Comunicacao. O produto nao executa checkout, plano pago, limite de assentos ou cobranca por usuario/time.

## Escopo inicial

- Usuario autenticado cria um time e se torna seu proprietario.
- O proprietario adiciona usuarios que ja possuem conta na instancia.
- O proprietario pode promover um membro a administrador, rebaixar administrador a membro e remover membros.
- O proprietario nao pode ser removido ou alterado pela tela de membros.
- Administradores e membros podem visualizar os times aos quais pertencem, mas nao alteram a composicao.
- A opcao "Com minha equipe" do onboarding abre `/teams`; ela nao inicia checkout e nao usa um fluxo comercial removido do Cal.diy.

## Limite deliberado

Convites por e-mail ainda nao sao enviados. O fluxo inicial e criar a conta do colaborador e depois adiciona-lo pelo e-mail cadastrado. Isso evita anunciar entrega de convite antes de SMTP e modelo de e-mail estarem configurados e testados.

## Proximo incremento

Depois de validar esta tela, implementar convites pendentes com token e envio por SMTP configuravel, mantendo o mesmo modelo `Membership` e sem qualquer logica de billing.
