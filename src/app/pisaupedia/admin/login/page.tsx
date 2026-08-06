import { LoginForm } from "@/features/auth/ui/LoginForm";

// Reuses one of the storefront's existing hero-quality product photos
// (already used in widgets/hero/HeroImageSlider.tsx) instead of a new/
// invented illustration — real photography of an actual Pisau Pedia knife.
const PANEL_IMAGE = "/dev-images/products/yama-gyuto-240.jpg";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Illustration panel */}
      <div className="relative flex h-56 shrink-0 items-end overflow-hidden bg-black sm:h-72 lg:h-auto lg:w-1/2 lg:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PANEL_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/40 lg:to-black/85" />

        <div className="relative z-10 flex w-full flex-col gap-3 p-6 sm:p-8 lg:max-w-xl lg:p-14">
          {/* self-start: without it, being a flex-col child stretches this
              image to the parent's full width (align-items defaults to
              stretch when width is "auto"), which distorts the logo since
              object-fit defaults to "fill". */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pisaupedialogo2.png" alt="Pisau Pedia" className="h-9 w-auto self-start sm:h-14 lg:h-20" />
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl lg:text-6xl">
            Kelola Pisau Pedia dengan mudah
          </h2>
          <p className="hidden text-base text-white/70 sm:block lg:text-xl">
            Pantau pesanan, produk, dan pelanggan dari satu tempat — kapan saja, di mana saja.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-white via-white to-emerald-50 px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-2xl font-semibold text-[#1a1d29] sm:text-3xl">Masuk ke Admin Panel</h1>
          <p className="mb-8 text-base text-gray-500">Masukkan email dan password akun admin Anda.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
