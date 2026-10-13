"use server";

import { randomUUID } from "node:crypto";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { prisma } from "@calcom/prisma";
import { MembershipRole } from "@calcom/prisma/enums";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const teamsPath = (teamId?: number, message?: string) => {
  const params = new URLSearchParams();
  if (teamId) params.set("team", String(teamId));
  if (message) params.set("message", message);
  const query = params.toString();
  return query ? `/teams?${query}` : "/teams";
};

const cleanTeamName = (value: FormDataEntryValue | null) => value?.toString().trim() ?? "";

const getCurrentUserId = async () => {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (!session?.user?.id) redirect("/auth/login");
  return session.user.id;
};

const getOwnedTeam = async (teamId: number, userId: number) => {
  return prisma.membership.findFirst({
    where: {
      teamId,
      userId,
      accepted: true,
      role: MembershipRole.OWNER,
      team: { isOrganization: false },
    },
    select: { teamId: true },
  });
};

const getTeamId = (formData: FormData) => {
  const teamId = Number(formData.get("teamId"));
  return Number.isInteger(teamId) && teamId > 0 ? teamId : null;
};

async function assertOwner(teamId: number) {
  const userId = await getCurrentUserId();
  const membership = await getOwnedTeam(teamId, userId);
  if (!membership) redirect(teamsPath(teamId, "Você não tem permissão para administrar este time."));
  return userId;
}

export async function createTeam(formData: FormData) {
  const userId = await getCurrentUserId();
  const name = cleanTeamName(formData.get("name"));

  if (name.length < 2 || name.length > 80) {
    redirect(teamsPath(undefined, "Informe um nome de time entre 2 e 80 caracteres."));
  }

  const slugBase =
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "time";

  const team = await prisma.team.create({
    data: {
      name,
      slug: `${slugBase}-${randomUUID().slice(0, 8)}`,
      timeZone: "America/Sao_Paulo",
      members: {
        create: {
          userId,
          accepted: true,
          role: MembershipRole.OWNER,
        },
      },
    },
    select: { id: true },
  });

  revalidatePath("/teams");
  redirect(teamsPath(team.id, "Time criado. Agora você pode adicionar membros."));
}

export async function addMember(formData: FormData) {
  const teamId = getTeamId(formData);
  if (!teamId) redirect(teamsPath(undefined, "Time inválido."));
  await assertOwner(teamId);

  const email = cleanTeamName(formData.get("email")).toLowerCase();
  if (!email || !email.includes("@")) {
    redirect(teamsPath(teamId, "Informe o e-mail de um usuário já cadastrado."));
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });

  if (!user) {
    redirect(
      teamsPath(
        teamId,
        "Este e-mail ainda não possui conta. Crie o usuário primeiro e depois adicione-o ao time."
      )
    );
  }

  await prisma.membership.upsert({
    where: { userId_teamId: { userId: user.id, teamId } },
    create: {
      userId: user.id,
      teamId,
      accepted: true,
      role: MembershipRole.MEMBER,
    },
    update: { accepted: true },
  });

  revalidatePath("/teams");
  redirect(teamsPath(teamId, "Membro adicionado ao time."));
}

export async function updateMemberRole(formData: FormData) {
  const teamId = getTeamId(formData);
  const membershipId = Number(formData.get("membershipId"));
  const role = formData.get("role");
  if (!teamId || !Number.isInteger(membershipId)) redirect(teamsPath(undefined, "Dados inválidos."));
  await assertOwner(teamId);

  if (role !== MembershipRole.MEMBER && role !== MembershipRole.ADMIN) {
    redirect(teamsPath(teamId, "O proprietário do time não pode ser alterado nesta tela."));
  }

  const membership = await prisma.membership.findFirst({
    where: { id: membershipId, teamId, accepted: true },
    select: { role: true },
  });
  if (!membership || membership.role === MembershipRole.OWNER) {
    redirect(teamsPath(teamId, "Não foi possível alterar este membro."));
  }

  await prisma.membership.update({
    where: { id: membershipId },
    data: { role },
  });

  revalidatePath("/teams");
  redirect(teamsPath(teamId, "Função do membro atualizada."));
}

export async function removeMember(formData: FormData) {
  const teamId = getTeamId(formData);
  const membershipId = Number(formData.get("membershipId"));
  if (!teamId || !Number.isInteger(membershipId)) redirect(teamsPath(undefined, "Dados inválidos."));
  await assertOwner(teamId);

  const membership = await prisma.membership.findFirst({
    where: { id: membershipId, teamId },
    select: { role: true },
  });
  if (!membership || membership.role === MembershipRole.OWNER) {
    redirect(teamsPath(teamId, "O proprietário do time não pode ser removido."));
  }

  await prisma.membership.delete({ where: { id: membershipId } });

  revalidatePath("/teams");
  redirect(teamsPath(teamId, "Membro removido do time."));
}
