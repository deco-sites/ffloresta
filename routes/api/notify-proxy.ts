import { Handlers } from "$fresh/server.ts";

// Configurações FIXAS da VTEX (conforme você forneceu)
const VTEX_CONFIG = {
  accountName: "ferragemfloresta", // Nome da conta fixo
  environment: "vtexcommercestable", // Ambiente fixo
  appKey: "vtexappkey-ferragemfloresta-ABCDEF", // Substitua com sua AppKey real
  appToken: "XYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", // Substitua com seu AppToken real
};

interface NotifyMeData {
  skuId: number;
  name: string;
  email: string;
  createdAt: string;
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const data: NotifyMeData = await req.json();

      console.log("Recebendo dados:", data);

      // Validação básica
      if (!data.skuId || !data.name || !data.email) {
        return new Response(
          JSON.stringify({
            error: "Dados incompletos",
            message: "Por favor, preencha todos os campos.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // URL para a API do Masterdata VTEX (com configurações fixas)
      const url = `https://${VTEX_CONFIG.accountName}.${VTEX_CONFIG.environment}.com.br/api/dataentities/CA/documents`;

      console.log("Enviando dados para VTEX:", {
        url,
        data,
        hasAppKey: !!VTEX_CONFIG.appKey,
        hasAppToken: !!VTEX_CONFIG.appToken,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.vtex.ds.v10+json",
          "X-VTEX-API-AppKey": VTEX_CONFIG.appKey,
          "X-VTEX-API-AppToken": VTEX_CONFIG.appToken,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API VTEX:", response.status, errorText);

        let message = "Erro ao enviar os dados para a VTEX.";
        if (response.status === 400) {
          message = "Dados inválidos. Verifique as informações.";
        } else if (response.status === 403) {
          message =
            "Erro de autenticação com a VTEX. Verifique as credenciais.";
        } else if (response.status === 404) {
          message =
            "Entidade não encontrada na VTEX. Verifique se a entidade 'CA' existe.";
        }

        return new Response(JSON.stringify({ error: "VTEX_ERROR", message }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Dados enviados com sucesso!",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Erro no proxy VTEX:", error);
      return new Response(
        JSON.stringify({
          error: "INTERNAL_ERROR",
          message: "Erro interno do servidor. Tente novamente.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
