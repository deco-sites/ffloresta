import type { AppContext } from "apps/vtex/mod.ts";

interface Props {
  emaill: string;
  name: string;
  politica: boolean;
}

export default async function action(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { emaill, name, politica } = props;

  try {
    await ctx.invoke.vtex.actions.masterdata.createDocument({
      data: { emaill, name, politica },
      acronym: "NL",
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
