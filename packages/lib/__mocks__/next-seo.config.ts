vi.mock("@calcom/lib/next-seo.config", () => ({
  default: {
    headSeo: {
      siteName: "Nexa Agenda",
    },
    defaultNextSeo: {
      title: "Nexa Agenda",
      description: "Scheduling infrastructure for everyone.",
    },
  },
  seoConfig: {
    headSeo: {
      siteName: "Nexa Agenda",
    },
  },
  buildSeoMeta: vi.fn().mockReturnValue({}),
}));
