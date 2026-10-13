import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { prisma } from "@calcom/prisma";
import { MembershipRole } from "@calcom/prisma/enums";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import type { PageProps } from "app/_types";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { addMember, createTeam, removeMember, updateMemberRole } from "./actions";

const roleLabel: Record<MembershipRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MEMBER: "Membro",
};

const Page = async ({ searchParams }: PageProps) => {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });
  if (!session?.user?.id) redirect("/auth/login");

  const query = await searchParams;
  const message = typeof query.message === "string" ? query.message : null;
  const selectedTeamId = typeof query.team === "string" ? Number(query.team) : null;

  const memberships = await prisma.membership.findMany({
    where: {
      userId: session.user.id,
      accepted: true,
      team: { isOrganization: false },
    },
    orderBy: { team: { name: "asc" } },
    select: {
      role: true,
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          members: {
            where: { accepted: true },
            orderBy: [{ role: "asc" }, { user: { name: "asc" } }],
            select: {
              id: true,
              role: true,
              user: { select: { id: true, name: true, email: true, username: true } },
            },
          },
        },
      },
    },
  });

  const visibleTeams = selectedTeamId
    ? memberships.filter((membership) => membership.team.id === selectedTeamId)
    : memberships;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-semibold text-2xl text-emphasis">Times</h1>
        <p className="max-w-2xl text-default text-sm">
          Organize os usuários já cadastrados em times. Esta instalação não aplica cobrança por usuário,
          assento ou time.
        </p>
      </div>

      {message && (
        <p
          className="mb-6 rounded-md border border-subtle bg-subtle px-4 py-3 text-sm text-default"
          role="status">
          {message}
        </p>
      )}

      <section className="mb-8 border-b border-subtle pb-8">
        <h2 className="mb-3 font-semibold text-lg text-emphasis">Criar time</h2>
        <form action={createTeam as unknown as string} className="flex max-w-xl flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="team-name">
            Nome do time
          </label>
          <input
            className="h-10 flex-1 rounded-md border border-default bg-default px-3 text-sm text-emphasis"
            id="team-name"
            name="name"
            minLength={2}
            maxLength={80}
            placeholder="Ex.: Atendimento Nexa"
            required
          />
          <button
            className="h-10 rounded-md bg-emphasis px-4 font-medium text-sm text-inverted"
            type="submit">
            Criar time
          </button>
        </form>
      </section>

      {visibleTeams.length === 0 ? (
        <section className="border border-subtle px-5 py-8 text-center">
          <h2 className="font-semibold text-emphasis">Nenhum time criado</h2>
          <p className="mt-2 text-default text-sm">Crie o primeiro time para começar a reunir os usuários.</p>
        </section>
      ) : (
        <div className="space-y-8">
          {visibleTeams.map(({ team, role }) => {
            const isOwner = role === MembershipRole.OWNER;
            return (
              <section className="border border-subtle" key={team.id}>
                <div className="border-b border-subtle px-5 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-semibold text-lg text-emphasis">{team.name}</h2>
                    <span className="text-subtle text-xs">Seu acesso: {roleLabel[role]}</span>
                  </div>
                  <p className="mt-1 text-subtle text-xs">Identificador: {team.slug}</p>
                </div>

                {isOwner && (
                  <form action={addMember as unknown as string} className="border-b border-subtle px-5 py-4">
                    <input name="teamId" type="hidden" value={team.id} />
                    <label
                      className="mb-2 block font-medium text-sm text-emphasis"
                      htmlFor={`member-email-${team.id}`}>
                      Adicionar usuário cadastrado
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        className="h-10 flex-1 rounded-md border border-default bg-default px-3 text-sm text-emphasis"
                        id={`member-email-${team.id}`}
                        name="email"
                        placeholder="nome@empresa.com.br"
                        type="email"
                        required
                      />
                      <button
                        className="h-10 rounded-md border border-default px-4 font-medium text-sm text-emphasis"
                        type="submit">
                        Adicionar membro
                      </button>
                    </div>
                    <p className="mt-2 text-subtle text-xs">
                      O usuário precisa criar a própria conta antes de ser incluído no time.
                    </p>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="border-b border-subtle text-subtle">
                      <tr>
                        <th className="px-5 py-3 font-medium">Usuário</th>
                        <th className="px-5 py-3 font-medium">E-mail</th>
                        <th className="px-5 py-3 font-medium">Função</th>
                        <th className="px-5 py-3 font-medium">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.members.map((member) => {
                        const isTeamOwner = member.role === MembershipRole.OWNER;
                        return (
                          <tr className="border-b border-subtle last:border-0" key={member.id}>
                            <td className="px-5 py-3 text-emphasis">
                              {member.user.name || member.user.username || "Usuário sem nome"}
                            </td>
                            <td className="px-5 py-3 text-default">{member.user.email || "Sem e-mail"}</td>
                            <td className="px-5 py-3">
                              {isOwner && !isTeamOwner ? (
                                <form action={updateMemberRole as unknown as string} className="flex items-center gap-2">
                                  <input name="teamId" type="hidden" value={team.id} />
                                  <input name="membershipId" type="hidden" value={member.id} />
                                  <select
                                    className="h-9 rounded-md border border-default bg-default px-2 text-sm text-emphasis"
                                    defaultValue={member.role}
                                    name="role">
                                    <option value={MembershipRole.MEMBER}>Membro</option>
                                    <option value={MembershipRole.ADMIN}>Administrador</option>
                                  </select>
                                  <button
                                    className="font-medium text-emphasis text-xs underline"
                                    type="submit">
                                    Salvar
                                  </button>
                                </form>
                              ) : (
                                <span className="text-default">{roleLabel[member.role]}</span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              {isOwner && !isTeamOwner ? (
                                <form action={removeMember as unknown as string}>
                                  <input name="teamId" type="hidden" value={team.id} />
                                  <input name="membershipId" type="hidden" value={member.id} />
                                  <button className="font-medium text-error text-xs underline" type="submit">
                                    Remover
                                  </button>
                                </form>
                              ) : (
                                <span className="text-subtle">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Page;
