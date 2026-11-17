import { Metadata } from "next";

import { SharpeningService } from "@/widgets/sharpening-service";

export const metadata: Metadata = {
    title: "Knife Sharpening & repairs - Pisau Pedia",
    description: 
        "Professional mail-in knife sharpening and repair service. Hand-sharpenend on Japanase whetstones. EU shipping included. 6–8 business day turnaround."
}

export default function SharpeningRepairsPage() {
    return <SharpeningService />;
}