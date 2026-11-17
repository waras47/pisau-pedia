import { CheckoutSuccessContent } from "@/widgets/checkout-success";

interface CheckoutSuccessPageProps {
  searchParams: { order?: string };
}

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  return <CheckoutSuccessContent orderId={searchParams.order} />;
}
