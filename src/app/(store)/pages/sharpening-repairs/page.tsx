import { SharpeningService } from "@/widgets/sharpening-service";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Knife Sharpening & repairs - Kissaki Knives",
    description: 
        "Professional mail-in knife sharpening and repair service. Hand-sharpenend on Japanase whetstones. EU shipping included. 6–8 business day turnaround."
}

export default function SharpeningRepairsPage() {
    return <SharpeningService />;
}