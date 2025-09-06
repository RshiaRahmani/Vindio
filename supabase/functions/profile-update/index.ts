import { createClient } from "npm:@supabase/supabase-js@2.39.1";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  // <-- service‑role key
);

Deno.serve(async (req: Request) => {
  if (req.method !== "PATCH") {
    return new Response(
      JSON.stringify({ error: "Only PATCH allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }
  
  // ----  CORS handling  -------------------------------------------------
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigins = ["http://localhost:3000", "http://localhost:3002"]; // add your prod URL(s) here

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
  
  if (req.method === "OPTIONS") {
    // pre‑flight response
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  // ----  Body parsing  --------------------------------------------------
  const { github_url } = await req.json();
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  
  // Verify the JWT and extract the user id (auth.uid())
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(token);
  
  if (authErr || !user) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing JWT" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  // ----  Update the profile  --------------------------------------------
  const { error } = await supabase
    .from("profiles")
    .update({ website: github_url }) // Using 'website' column as per our schema
    .eq("id", user.id)        // auth.uid()
    .single();
    
  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  return new Response(
    JSON.stringify({ success: true, github_url }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
