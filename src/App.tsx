import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "./lib/supabase";

export default function App() {
  const [status, setStatus] = useState("Checking Supabase connection…");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setStatus("Missing Supabase environment variables");
      setDetails("Copy .env.example to .env.local and add the project values.");
      return;
    }
    supabase.from("sample_people").select("id", { count: "exact", head: true }).then(({ count, error }) => {
      if (error) {
        setStatus("Supabase connected, but the schema is not ready");
        setDetails(error.message);
        return;
      }
      setStatus("Supabase connected");
      setDetails(`sample_people rows: ${count ?? 0}`);
    });
  }, []);

  return <main><h1>Horizon backend scaffold</h1><p>{status}</p><p>{details}</p><p>Simulated data. Not medical advice. Not diagnostic.</p></main>;
}
