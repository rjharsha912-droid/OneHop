import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plane,
  Car,
  Building2,
  Ticket,
  Bike,
  CloudRain,
  Bus,
  MapPin,
  UtensilsCrossed,
  Hotel,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IllustrationRing } from "@/components/illustrations/IllustrationRing";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    title: "Your journey, simplified by AI",
    subtitle: "OneHop plans, compares, and optimizes everything for you — rides, stays, food, and more.",
    center: <Sparkles size={40} />,
    icons: [
      { icon: <Plane size={20} />, angle: 0, tone: "primary" as const },
      { icon: <Car size={20} />, angle: 72, tone: "info" as const },
      { icon: <Building2 size={20} />, angle: 144, tone: "warning" as const },
      { icon: <Ticket size={20} />, angle: 216, tone: "accent" as const },
      { icon: <Bike size={20} />, angle: 288, tone: "success" as const },
    ],
  },
  {
    title: "Beat the rain, traffic, and surge pricing",
    subtitle: "Real-time cab, bus, and bike comparisons — so your commute is never a guessing game.",
    center: <CloudRain size={40} />,
    icons: [
      { icon: <Car size={20} />, angle: 20, tone: "primary" as const },
      { icon: <Bus size={20} />, angle: 100, tone: "info" as const },
      { icon: <Bike size={20} />, angle: 180, tone: "success" as const },
      { icon: <MapPin size={20} />, angle: 260, tone: "accent" as const },
      { icon: <CloudRain size={20} />, angle: 340, tone: "warning" as const },
    ],
  },
  {
    title: "One chat plans your whole trip",
    subtitle: "Tell OneHop where you're going. Get a day-by-day plan with stays, food, and activities — adjusted live for weather.",
    center: <MapPin size={40} />,
    icons: [
      { icon: <Hotel size={20} />, angle: 0, tone: "primary" as const },
      { icon: <UtensilsCrossed size={20} />, angle: 72, tone: "warning" as const },
      { icon: <Plane size={20} />, angle: 144, tone: "info" as const },
      { icon: <Ticket size={20} />, angle: 216, tone: "accent" as const },
      { icon: <Bus size={20} />, angle: 288, tone: "success" as const },
    ],
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const markOnboardingSeen = useUIStore((s) => s.markOnboardingSeen);

  const finish = () => {
    markOnboardingSeen();
    navigate("/auth", { replace: true });
  };

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-app-bg">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-6 sm:max-w-lg">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={finish}
            className="text-sm font-semibold text-muted hover:text-ink"
          >
            Skip
          </button>
        </div>

        <div className="mt-6 flex-1">
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            {step === 0 ? (
              <>
                Your Journey, <br />
                Simplified by <span className="text-primary">AI</span>
              </>
            ) : (
              slide.title
            )}
          </h1>
          <p className="mt-3 max-w-sm text-[15px] text-muted">{slide.subtitle}</p>

          <div className="mt-10 sm:mt-14">
            <IllustrationRing center={slide.center} icons={slide.icons} />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  "h-2 rounded-full transition-all",
                  idx === step ? "w-6 bg-primary" : "w-2 bg-faint"
                )}
              />
            ))}
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          >
            {isLast ? "Get started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
