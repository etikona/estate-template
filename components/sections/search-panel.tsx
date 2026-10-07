"use client";

import { ChevronDown } from "lucide-react";
import { site } from "@/site.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type SearchMode = "buy" | "rent" | "sell";

type Props = {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  location: string;
  onLocationChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  types: string[];
  max: string;
  onMaxChange: (value: string) => void;
  onSubmit: () => void;
};

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-6 py-5 md:px-8", className)}>
      <label htmlFor={htmlFor} className="mb-1 block text-xs text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectControl({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full cursor-pointer appearance-none bg-transparent pr-7 text-base text-foreground outline-none focus-visible:underline"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

/** Floating panel that overlaps the bottom of the hero */
export function SearchPanel({
  mode,
  onModeChange,
  location,
  onLocationChange,
  type,
  onTypeChange,
  types,
  max,
  onMaxChange,
  onSubmit,
}: Props) {
  const { search } = site;
  const ranges = mode === "rent" ? search.priceRanges.rent : search.priceRanges.sale;
  const selling = mode === "sell";

  return (
    <div className="container-x relative z-20 -mt-20 md:-mt-24">
      <div className="border bg-background shadow-[0_40px_90px_-40px_rgba(17,17,15,0.45)]">
        <Tabs value={mode} onValueChange={(v) => onModeChange(v as SearchMode)} className="border-b px-6 pt-5 md:px-8">
          <TabsList aria-label="Search type">
            <TabsTrigger value="buy">{search.tabs.buy}</TabsTrigger>
            <TabsTrigger value="rent">{search.tabs.rent}</TabsTrigger>
            <TabsTrigger value="sell">{search.tabs.sell}</TabsTrigger>
          </TabsList>
        </Tabs>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className={cn(
            "grid divide-y md:divide-x md:divide-y-0",
            selling ? "md:grid-cols-[1.6fr_1fr_auto]" : "md:grid-cols-[1.5fr_1fr_1fr_auto]",
          )}
        >
          <Field label={selling ? search.addressLabel : search.locationLabel} htmlFor="search-location">
            <Input
              id="search-location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder={selling ? search.addressPlaceholder : search.locationPlaceholder}
              autoComplete="off"
              className="h-9 border-0 shadow-none focus-visible:shadow-none"
            />
          </Field>

          <Field label={search.typeLabel} htmlFor="search-type">
            <SelectControl id="search-type" value={type} onChange={onTypeChange}>
              <option value="any">{search.anyTypeLabel}</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectControl>
          </Field>

          {!selling ? (
            <Field label={search.priceLabel} htmlFor="search-price">
              <SelectControl id="search-price" value={max} onChange={onMaxChange}>
                <option value="any">{search.anyPriceLabel}</option>
                {ranges.map((r) => (
                  <option key={r.max} value={String(r.max)}>
                    {r.label}
                  </option>
                ))}
              </SelectControl>
            </Field>
          ) : null}

          <div className="flex p-3 md:p-4">
            <Button type="submit" size="lg" className="w-full md:w-auto">
              {selling ? search.sellSubmit : search.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
