"use client";

import { Check, ChevronDown, Info } from "lucide-react";
import { useMemo, useState } from "react";

import {
  accessories,
  CURRENCY,
  getBladesByShape,
  handles,
  shapes,
} from "@/entities/configurator";
import { type Product } from "@/entities/product";
import { useCart } from "@/features/cart";
import { useLocaleCurrency } from "@/features/locale-currency";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";
import { cn } from "@/shared/lib/utils";

export function KnifeConfigurator() {
  const { addItem } = useCart();
  const { formatPrice } = useLocaleCurrency();

  const [shapeId, setShapeId] = useState<string | null>(null);
  const [bladeId, setBladeId] = useState<string | null>(null);
  const [handleId, setHandleId] = useState<string | null>(null);
  const [accessoryIds, setAccessoryIds] = useState<string[]>([]);
  const [openStep, setOpenStep] = useState(1);

  // Objek terpilih
  const shape = shapes.find((s) => s.id === shapeId) ?? null;
  const availableBlades = shapeId ? getBladesByShape(shapeId) : [];
  const blade = availableBlades.find((b) => b.id === bladeId) ?? null;
  const handle = handles.find((h) => h.id === handleId) ?? null;
  const chosenAccessories = accessories.filter((a) =>
    accessoryIds.includes(a.id),
  );

  // Sampai langkah mana user boleh membuka (reveal berurutan)
  const maxStep = useMemo(() => {
    if (handle) return 4;
    if (blade) return 3;
    if (shape) return 2;
    return 1;
  }, [shape, blade, handle]);

  const total = useMemo(() => {
    const base = blade?.price ?? 0;
    const handleDelta = handle?.priceDelta ?? 0;
    const acc = chosenAccessories.reduce((sum, a) => sum + a.price, 0);
    return base + handleDelta + acc;
  }, [blade, handle, chosenAccessories]);

  const canAdd = Boolean(shape && blade && handle);

  // — handlers —
  function selectShape(id: string) {
    setShapeId(id);
    setBladeId(null); // blade lama tak valid utk shape baru
    setOpenStep(2);
  }
  function selectBlade(id: string) {
    setBladeId(id);
    setOpenStep(3);
  }
  function selectHandle(id: string) {
    setHandleId(id);
    setOpenStep(4);
  }
  function toggleAccessory(id: string) {
    setAccessoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }
  function toggleStep(step: number) {
    if (step > maxStep) return; // belum boleh dibuka
    setOpenStep((cur) => (cur === step ? 0 : step));
  }

  // Helper: bungkus 1 komponen jadi Product (item terpisah di cart)
  function componentProduct(
    kind: "blade" | "handle" | "accessory",
    refId: string,
    name: string,
    category: string,
    price: number,
  ): Product {
    const slug = `${kind}-${refId}`;
    return {
      id: slug,
      slug,
      name,
      category,
      price,
      currency: CURRENCY,
      rating: 0,
      reviewCount: 0,
      component: { kind, refId },
    };
  }

  function handleAddToCart() {
    if (!shape || !blade || !handle) return;

    // Tiap komponen masuk cart sebagai item TERPISAH
    addItem(
      componentProduct("blade", blade.id, blade.name, "Blade", blade.price),
      1,
    );
    addItem(
      componentProduct(
        "handle",
        handle.id,
        `${handle.name} Handle`,
        "Handle",
        handle.priceDelta,
      ),
      1,
    );
    chosenAccessories.forEach((a) => {
      addItem(
        componentProduct("accessory", a.id, a.name, "Accessory", a.price),
        1,
      );
    });
  }

  return (
    <div className="pb-20">
      {/* ── Preview sticky ── */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <Container className="py-4">
          <p className="text-center text-sm font-medium uppercase tracking-widest2 text-muted-foreground">
            Knife Configurator — Build Your Own Knife
          </p>
          <div className="mx-auto mt-2 h-px w-10 bg-border" />

          <div className="relative mt-3">
            {blade?.image || shape?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blade?.image ?? shape?.image}
                alt={blade ? blade.name : shape?.name ?? "Selected knife"}
                className="aspect-[16/7] max-h-[30vh] w-full object-cover"
              />
            ) : (
              <PlaceholderImage
                ratio="wide"
                label="Select a shape to start"
                className="max-h-[30vh]"
              />
            )}
            <div className="mt-2 flex items-center justify-end gap-4">
              {blade ? (
                <span className="text-sm font-semibold">
                  {formatPrice(total, CURRENCY)}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => canAdd && handleAddToCart()}
                disabled={!canAdd}
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  canAdd
                    ? "text-accent hover:opacity-80"
                    : "cursor-not-allowed text-muted-foreground",
                )}
              >
                Confirm selection
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Langkah-langkah ── */}
      <Container className="mt-10 flex flex-col gap-4">
        {/* Step 1 — Shape */}
        <StepSection
          step={1}
          title="Select Shape"
          summary={shape ? `${shape.name} [${shape.category}]` : undefined}
          open={openStep === 1}
          reachable={maxStep >= 1}
          onToggle={() => toggleStep(1)}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {shapes.map((s) => (
              <OptionCard
                key={s.id}
                label={`${s.name} [${s.category}]`}
                previewLabel={s.name}
                image={s.image}
                active={shapeId === s.id}
                onClick={() => selectShape(s.id)}
              />
            ))}
          </div>
        </StepSection>

        {/* Step 2 — Blade (muncul setelah shape dipilih) */}
        {shape ? (
          <StepSection
            step={2}
            title="Select Blade"
            summary={blade ? blade.name : undefined}
            open={openStep === 2}
            reachable={maxStep >= 2}
            onToggle={() => toggleStep(2)}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {availableBlades.map((b) => (
                <OptionCard
                  key={b.id}
                  label={b.name}
                  previewLabel={`${b.steel} · ${b.lengthMm}mm`}
                  image={b.image}
                  price={b.price}
                  compareAtPrice={b.compareAtPrice}
                  active={bladeId === b.id}
                  onClick={() => selectBlade(b.id)}
                />
              ))}
            </div>
          </StepSection>
        ) : null}

        {/* Step 3 — Handle (muncul setelah blade dipilih) */}
        {blade ? (
          <StepSection
            step={3}
            title="Select Handle"
            summary={handle ? handle.name : undefined}
            open={openStep === 3}
            reachable={maxStep >= 3}
            onToggle={() => toggleStep(3)}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {handles.map((h) => (
                <OptionCard
                  key={h.id}
                  label={h.name}
                  previewLabel={h.material}
                  image={h.image}
                  price={h.priceDelta > 0 ? h.priceDelta : undefined}
                  priceIsDelta
                  active={handleId === h.id}
                  onClick={() => selectHandle(h.id)}
                />
              ))}
            </div>
          </StepSection>
        ) : null}

        {/* Step 4 — Accessories (opsional, muncul setelah handle dipilih) */}
        {handle ? (
          <StepSection
            step={4}
            title="Add Accessories (optional)"
            summary={
              chosenAccessories.length
                ? chosenAccessories.map((a) => a.name).join(", ")
                : undefined
            }
            open={openStep === 4}
            reachable={maxStep >= 4}
            onToggle={() => toggleStep(4)}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {accessories.map((a) => (
                <OptionCard
                  key={a.id}
                  label={a.name}
                  previewLabel="Accessory"
                  image={a.image}
                  price={a.price}
                  priceIsDelta
                  active={accessoryIds.includes(a.id)}
                  onClick={() => toggleAccessory(a.id)}
                />
              ))}
            </div>
          </StepSection>
        ) : null}

        {/* CTA akhir */}
        <div className="mt-6 flex flex-col items-center gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest2 text-muted-foreground">
              Total
            </span>
            <p className="text-2xl font-semibold">
              {formatPrice(total, CURRENCY)}
            </p>
          </div>
          <Button
            size="lg"
            disabled={!canAdd}
            onClick={handleAddToCart}
            className="w-full sm:w-auto"
          >
            Add to Cart
          </Button>
        </div>
      </Container>
    </div>
  );
}

/* ───────────── sub-komponen ───────────── */

interface StepSectionProps {
  step: number;
  title: string;
  summary?: string;
  open: boolean;
  reachable: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function StepSection({
  step,
  title,
  summary,
  open,
  reachable,
  onToggle,
  children,
}: StepSectionProps) {
  return (
    <section className="border-b border-border pb-4">
      <button
        type="button"
        onClick={onToggle}
        disabled={!reachable}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs",
              summary
                ? "bg-accent text-accent-foreground"
                : "border border-border text-muted-foreground",
            )}
          >
            {summary ? <Check size={14} /> : step}
          </span>
          <span className="text-sm font-medium uppercase tracking-widest2">
            {step}. {title}
          </span>
          {summary && !open ? (
            <span className="text-sm text-muted-foreground">— {summary}</span>
          ) : null}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? <div className="pt-2">{children}</div> : null}
    </section>
  );
}

interface OptionCardProps {
  label: string;
  previewLabel: string;
  image?: string;
  price?: number;
  compareAtPrice?: number;
  priceIsDelta?: boolean;
  active: boolean;
  onClick: () => void;
}

function OptionCard({
  label,
  previewLabel,
  image,
  price,
  compareAtPrice,
  priceIsDelta,
  active,
  onClick,
}: OptionCardProps) {
  const { formatPrice } = useLocaleCurrency();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex flex-col gap-2 border p-3 text-left transition-colors",
        active
          ? "border-accent ring-1 ring-accent"
          : "border-border hover:border-foreground/40",
      )}
    >
      <Info
        size={16}
        className="absolute right-3 top-3 text-muted-foreground/60"
      />
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={previewLabel}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <PlaceholderImage ratio="landscape" label={previewLabel} />
      )}
      <span className="text-xs font-medium uppercase tracking-widest2">
        {label}
      </span>
      {price !== undefined ? (
        <span className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-accent">
            {priceIsDelta ? "+" : ""}
            {formatPrice(price, CURRENCY)}
          </span>
          {compareAtPrice ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(compareAtPrice, CURRENCY)}
            </span>
          ) : null}
        </span>
      ) : null}
    </button>
  );
}
