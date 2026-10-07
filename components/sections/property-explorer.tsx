"use client";

import { useMemo, useState } from "react";
import { site } from "@/site.config";
import { scrollToTarget } from "@/lib/scroll";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { SearchPanel, type SearchMode } from "@/components/sections/search-panel";

/** Owns the search state so the floating panel can filter the featured list */
export function PropertyExplorer() {
  const { featured, sections } = site;
  const [mode, setMode] = useState<SearchMode>("buy");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("any");
  const [max, setMax] = useState("any");

  const types = useMemo(() => Array.from(new Set(featured.listings.map((l) => l.type))), [featured.listings]);

  const visible = useMemo(() => {
    const q = location.trim().toLowerCase();
    return featured.listings.filter((l) => {
      if (mode === "buy" && l.status !== "sale") return false;
      if (mode === "rent" && l.status !== "rent") return false;
      if (mode !== "sell" && q && !`${l.location} ${l.title}`.toLowerCase().includes(q)) return false;
      if (type !== "any" && l.type !== type) return false;
      if (mode !== "sell" && max !== "any" && l.priceValue > Number(max)) return false;
      return true;
    });
  }, [featured.listings, mode, location, type, max]);

  const reset = () => {
    setLocation("");
    setType("any");
    setMax("any");
  };

  const changeMode = (next: SearchMode) => {
    setMode(next);
    setMax("any");
  };

  const submit = () => {
    if (mode === "sell") {
      window.dispatchEvent(
        new CustomEvent("contact:prefill", {
          detail: {
            interest: "sell",
            message: location.trim() ? `I'd like a valuation for: ${location.trim()}` : "",
          },
        }),
      );
      scrollToTarget("#contact");
      return;
    }
    scrollToTarget("#listings", -40);
  };

  return (
    <>
      {sections.search ? (
        <SearchPanel
          mode={mode}
          onModeChange={changeMode}
          location={location}
          onLocationChange={setLocation}
          type={type}
          onTypeChange={setType}
          types={types}
          max={max}
          onMaxChange={setMax}
          onSubmit={submit}
        />
      ) : null}
      {sections.featured ? (
        <FeaturedProperties
          listings={mode === "sell" && !sections.search ? featured.listings : visible}
          total={featured.listings.length}
          onReset={reset}
        />
      ) : null}
    </>
  );
}
