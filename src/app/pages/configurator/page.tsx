import { type Metadata } from "next";

import { KnifeConfigurator } from "@/features/knife-configurator";

export const metadata: Metadata = {
  title: "Knife Configurator — Kissaki Knives",
  description: "Build your own custom Japanese knife, blade to handle.",
};

export default function ConfiguratorPage() {
  return <KnifeConfigurator />;
}
