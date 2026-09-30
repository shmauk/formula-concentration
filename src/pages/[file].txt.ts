import type { APIRoute, GetStaticPaths } from "astro";
import { adsTxt } from "../components/ads/ads";
import { adsenseClient } from "../components/ads/adsense";

/** `/ads.txt`, only built when `PUBLIC_ADSENSE_CLIENT` is set. */
export const getStaticPaths = (() =>
  adsenseClient
    ? [{ params: { file: "ads" }, props: { client: adsenseClient } }]
    : []) satisfies GetStaticPaths;

export const GET: APIRoute<{ client: string }> = ({ props }) =>
  new Response(adsTxt(props.client), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
