// routes/api/availability-notify.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();

      const response = await fetch(
        "https://master--ferragemfloresta.myvtex.com/_v/createAvailabilityNotify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`VTEX API error: ${response.status}`);
      }

      const result = await response.text();

      return new Response(JSON.stringify({ success: true, message: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
