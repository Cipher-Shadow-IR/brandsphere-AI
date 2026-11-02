"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export interface TourStep {
  id: string;
  route: string;
  targetSelector: string;
  title: string;
  description: string;
  badge: string;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  nextRoute?: string;
}

export const ALL_TOUR_STEPS: TourStep[] = [
  // 1. Landing Page
  {
    id: "landing-cta",
    route: "/",
    targetSelector: "#tour-hero-scan",
    title: "Launch Scanner Directly",
    description: "Start pre-publication brand scanning with AI rule verification directly from the home portal.",
    badge: "Step 1 of 10 · Welcome",
    placement: "bottom",
    nextRoute: "/dashboard"
  },

  // 2. Dashboard
  {
    id: "dash-seed",
    route: "/dashboard",
    targetSelector: "#tour-seed-demo",
    title: "Seed Demo Submissions",
    description: "Populates multi-industry compliance drafts (High-Risk, Fintech, Social) with one click.",
    badge: "Step 2 of 10 · Quickstart",
    placement: "bottom",
  },
  {
    id: "dash-filters",
    route: "/dashboard",
    targetSelector: "#tour-status-filters",
    title: "Multi-Status Filter Hub",
    description: "Filter governance assets by Pending Review, Approved, Needs Revision, or Rejected.",
    badge: "Step 3 of 10 · Overview",
    placement: "bottom",
  },
  {
    id: "dash-upload-cta",
    route: "/dashboard",
    targetSelector: "#tour-scan-cta",
    title: "Start Pre-Publication Scan",
    description: "Click here to launch the multi-dimensional AI Scanner on new drafts.",
    badge: "Step 4 of 10 · Ingestion",
    placement: "left",
    nextRoute: "/upload"
  },

  // 3. Upload Studio
  {
    id: "upload-presets",
    route: "/upload",
    targetSelector: "#tour-preset-buttons",
    title: "Quick-Load Demo Scenarios",
    description: "Click a preset like 'High-Risk Draft' or 'Compliant Draft' to load realistic test content immediately.",
    badge: "Step 5 of 10 · Presets",
    placement: "bottom"
  },
  {
    id: "upload-dropzone",
    route: "/upload",
    targetSelector: "#tour-binary-dropzone",
    title: "Multi-Format Document Parsing",
    description: "Upload native PDF, Word (.docx), or PowerPoint (.pptx) with page-by-page text extraction.",
    badge: "Step 6 of 10 · Ingestion",
    placement: "top"
  },
  {
    id: "upload-scan-btn",
    route: "/upload",
    targetSelector: "#tour-scan-submit",
    title: "Run Deep Governance Audit",
    description: "Click this button to scan content across regex deterministic rules, Google Gemini LLM reasoning, and WCAG checks.",
    badge: "Step 7 of 10 · Execution",
    placement: "top"
  },
  {
    id: "upload-results-cta",
    route: "/upload",
    targetSelector: "#tour-upload-complete-cta",
    title: "Proceed to Review Studio",
    description: "Analysis is ready! Click 'Open in Collaborative Review Studio' to remediate issues with human-in-the-loop workflows.",
    badge: "Step 8 of 10 · Workflow",
    placement: "top",
    nextRoute: "/review"
  },

  // 4. Review Studio
  {
    id: "review-role-switcher",
    route: "/review",
    targetSelector: "#tour-role-switcher",
    title: "Persona Role Switching",
    description: "Switch between Legal Counsel, Brand Manager, and Copywriter to test role-gated decisions.",
    badge: "Step 9 of 10 · Collaboration",
    placement: "bottom"
  },
  {
    id: "review-remediation",
    route: "/review",
    targetSelector: "#tour-remediation-card",
    title: "1-Click AI Remediation & Certify",
    description: "Apply suggested compliant fixes with live diff updates and grant cryptographic SHA-256 approval.",
    badge: "Step 10 of 10 · Resolution",
    placement: "left"
  },

  // 5. Guidelines
  {
    id: "guidelines-hub",
    route: "/guidelines",
    targetSelector: "#tour-guidelines-tabs",
    title: "Canonical Knowledge Hub",
    description: "Inspect enterprise policies, certified factual claims, and approved brand tokens.",
    badge: "Reference · Knowledge Base",
    placement: "bottom"
  },

  // 6. Analytics
  {
    id: "analytics-export",
    route: "/analytics",
    targetSelector: "#tour-analytics-export",
    title: "Executive Export Reports",
    description: "Export compliance telemetry and Guideline Clarity Index in PDF, Word, Markdown, or CSV.",
    badge: "Reference · Telemetry",
    placement: "left"
  }
];

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  startTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  hasSeenTour: boolean;
  totalSteps: number;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(false);

  // Normalize current base pathname (e.g., "/review?id=123" -> "/review")
  const baseRoute = useMemo(() => {
    if (!pathname) return "/";
    const path = pathname.split("?")[0];
    return path === "" ? "/" : path;
  }, [pathname]);

  // Helper: Find the best visible step for the current route and DOM state
  const findBestStepForRoute = useCallback((route: string) => {
    // Collect all candidate steps for this route
    const matchingIndices: number[] = [];
    ALL_TOUR_STEPS.forEach((step, idx) => {
      if (step.route === route) {
        matchingIndices.push(idx);
      }
    });

    if (matchingIndices.length === 0) return 0;

    // Check which candidate target elements actually exist currently in the DOM
    for (const idx of matchingIndices) {
      const step = ALL_TOUR_STEPS[idx];
      if (typeof document !== "undefined" && document.querySelector(step.targetSelector)) {
        return idx;
      }
    }

    // Default to the first candidate for this route
    return matchingIndices[0];
  }, []);

  // Initialize from localStorage and state recovery
  useEffect(() => {
    try {
      const savedSeen = localStorage.getItem("brandsphere_tour_seen");
      if (savedSeen === "true") setHasSeenTour(true);

      const savedActive = localStorage.getItem("brandsphere_tour_active");
      if (savedActive === "true") {
        setIsActive(true);
        // On refresh, immediately lock onto the current page's matching step!
        const bestStep = findBestStepForRoute(baseRoute);
        setCurrentStepIndex(bestStep);
      }
    } catch {}
  }, [baseRoute, findBestStepForRoute]);

  // When pathname changes while tour is active:
  // Automatically synchronize step to the current page's step so pop-up NEVER stays on previous page!
  useEffect(() => {
    if (!isActive) return;

    const currentStepObj = ALL_TOUR_STEPS[currentStepIndex];
    // If the active step belongs to a different route than where the user is right now,
    // adapt immediately to the current page's step!
    if (!currentStepObj || currentStepObj.route !== baseRoute) {
      const bestStep = findBestStepForRoute(baseRoute);
      setCurrentStepIndex(bestStep);
    }
  }, [baseRoute, isActive, currentStepIndex, findBestStepForRoute]);

  // Persist tour active state
  useEffect(() => {
    try {
      localStorage.setItem("brandsphere_tour_active", isActive ? "true" : "false");
      localStorage.setItem("brandsphere_tour_step", currentStepIndex.toString());
    } catch {}
  }, [isActive, currentStepIndex]);

  const startTour = useCallback(() => {
    // Start directly with the current page's step!
    const bestStep = findBestStepForRoute(baseRoute);
    setCurrentStepIndex(bestStep);
    setIsActive(true);
  }, [baseRoute, findBestStepForRoute]);

  const pauseTour = useCallback(() => {
    setIsActive(false);
  }, []);

  const resumeTour = useCallback(() => {
    // Resuming always prioritizes the step for whatever page the user is currently looking at
    const bestStep = findBestStepForRoute(baseRoute);
    setCurrentStepIndex(bestStep);
    setIsActive(true);
  }, [baseRoute, findBestStepForRoute]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < ALL_TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      const nextStepObj = ALL_TOUR_STEPS[nextIdx];
      setCurrentStepIndex(nextIdx);

      if (nextStepObj.route !== baseRoute) {
        router.push(nextStepObj.route);
      }
    } else {
      setIsActive(false);
      setHasSeenTour(true);
      try {
        localStorage.setItem("brandsphere_tour_seen", "true");
        localStorage.setItem("brandsphere_tour_active", "false");
      } catch {}
    }
  }, [currentStepIndex, baseRoute, router]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      const prevStepObj = ALL_TOUR_STEPS[prevIdx];
      setCurrentStepIndex(prevIdx);

      if (prevStepObj.route !== baseRoute) {
        router.push(prevStepObj.route);
      }
    }
  }, [currentStepIndex, baseRoute, router]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < ALL_TOUR_STEPS.length) {
      const targetStep = ALL_TOUR_STEPS[index];
      setCurrentStepIndex(index);
      if (targetStep.route !== baseRoute) {
        router.push(targetStep.route);
      }
    }
  }, [baseRoute, router]);

  // Keyboard shortcut: ESC to pause/close
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        pauseTour();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, pauseTour]);

  // Auto-advance listener: If user clicks an active highlighted button/link directly,
  // automatically advance to the next step so instructions stay in sync!
  useEffect(() => {
    if (!isActive) return;
    const currentStepObj = ALL_TOUR_STEPS[currentStepIndex];
    if (!currentStepObj) return;

    const targetEl = document.querySelector(currentStepObj.targetSelector);
    if (!targetEl) return;

    const handleTargetClick = () => {
      // Small timeout to allow DOM/route transition to initiate
      setTimeout(() => {
        if (currentStepIndex < ALL_TOUR_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, 150);
    };

    targetEl.addEventListener("click", handleTargetClick, { once: true });
    return () => {
      targetEl.removeEventListener("click", handleTargetClick);
    };
  }, [isActive, currentStepIndex]);

  const currentStep = ALL_TOUR_STEPS[currentStepIndex] || null;

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        startTour,
        pauseTour,
        resumeTour,
        nextStep,
        prevStep,
        goToStep,
        hasSeenTour,
        totalSteps: ALL_TOUR_STEPS.length,
      }}
    >
      {children}
      <TourOverlay />
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}

// -------------------------------------------------------------
// Visual Spotlight & Arrow Pointer Component
// -------------------------------------------------------------
function TourOverlay() {
  const { isActive, currentStep, currentStepIndex, totalSteps, nextStep, prevStep, pauseTour } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateRect = useCallback(() => {
    if (!isActive || !currentStep) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(currentStep.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);

      // Auto-scroll into view smoothly
      const isInViewport =
        rect.top >= 70 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 70;

      if (!isInViewport) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    if (!isActive) return;

    updateRect();
    const timer = setTimeout(updateRect, 200);
    const interval = setInterval(updateRect, 800);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [isActive, currentStep, updateRect]);

  if (!mounted || !isActive || !currentStep) return null;

  // Pop-up Card sizing & geometry
  const cardWidth = 310;
  const cardHeightEstimate = 180;
  const pad = 12;

  let tooltipTop = 100;
  let tooltipLeft = 20;
  let arrowPlacement: "top" | "bottom" | "left" | "right" = "top";
  let arrowOffset = 24;

  const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const winH = typeof window !== "undefined" ? window.innerHeight : 800;

  if (targetRect) {
    const isMobile = winW < 640;

    if (isMobile) {
      tooltipTop = Math.max(16, winH - cardHeightEstimate - 16);
      tooltipLeft = Math.max(12, (winW - cardWidth) / 2);
      arrowPlacement = "top";
    } else {
      const spaceBelow = winH - targetRect.bottom;
      const spaceAbove = targetRect.top;
      const spaceRight = winW - targetRect.right;
      const spaceLeft = targetRect.left;

      if (spaceLeft >= cardWidth + pad + 16 && spaceRight < cardWidth + pad) {
        // Place left
        arrowPlacement = "right";
        tooltipLeft = targetRect.left - cardWidth - pad - 6;
        tooltipTop = Math.max(16, Math.min(winH - cardHeightEstimate - 16, targetRect.top + 30));
        arrowOffset = Math.max(16, Math.min(cardHeightEstimate - 28, targetRect.top + 50 - tooltipTop));
      } else if (spaceBelow >= cardHeightEstimate + pad + 10) {
        // Place below target
        arrowPlacement = "top";
        tooltipTop = targetRect.bottom + pad + 6;
        tooltipLeft = Math.max(16, Math.min(winW - cardWidth - 16, targetRect.left + (targetRect.width / 2) - (cardWidth / 2)));
        arrowOffset = Math.max(16, Math.min(cardWidth - 28, targetRect.left + (targetRect.width / 2) - tooltipLeft));
      } else if (spaceAbove >= cardHeightEstimate + pad + 10) {
        // Place above target
        arrowPlacement = "bottom";
        tooltipTop = targetRect.top - cardHeightEstimate - pad - 6;
        tooltipLeft = Math.max(16, Math.min(winW - cardWidth - 16, targetRect.left + (targetRect.width / 2) - (cardWidth / 2)));
        arrowOffset = Math.max(16, Math.min(cardWidth - 28, targetRect.left + (targetRect.width / 2) - tooltipLeft));
      } else if (spaceLeft >= cardWidth + pad) {
        // Place to left
        arrowPlacement = "right";
        tooltipLeft = targetRect.left - cardWidth - pad - 6;
        tooltipTop = Math.max(16, Math.min(winH - cardHeightEstimate - 16, targetRect.top + (targetRect.height / 2) - (cardHeightEstimate / 2)));
        arrowOffset = Math.max(16, Math.min(cardHeightEstimate - 28, targetRect.top + (targetRect.height / 2) - tooltipTop));
      } else {
        // Place to right
        arrowPlacement = "left";
        tooltipLeft = targetRect.right + pad + 6;
        tooltipTop = Math.max(16, Math.min(winH - cardHeightEstimate - 16, targetRect.top + (targetRect.height / 2) - (cardHeightEstimate / 2)));
        arrowOffset = Math.max(16, Math.min(cardHeightEstimate - 28, targetRect.top + (targetRect.height / 2) - tooltipTop));
      }
    }
  } else {
    // If element is not rendered on this sub-view, center the card cleanly
    tooltipTop = Math.max(80, (winH - cardHeightEstimate) / 2);
    tooltipLeft = Math.max(16, (winW - cardWidth) / 2);
  }

  tooltipTop = Math.max(16, Math.min(winH - cardHeightEstimate - 16, tooltipTop));
  tooltipLeft = Math.max(16, Math.min(winW - cardWidth - 16, tooltipLeft));

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990]">
      {/* Target Focus Ring (Clean cut-out, no overall screen blur) */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-2xl transition-all duration-200 z-[9992]"
          style={{
            top: `${Math.max(8, targetRect.top - 4)}px`,
            left: `${Math.max(8, targetRect.left - 4)}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            border: "2.5px solid #f6a3ca",
            boxShadow: "0 0 0 3px rgba(246, 163, 202, 0.4), 0 4px 20px rgba(222, 208, 249, 0.6)",
          }}
        />
      )}

      {/* Compact Evaluator Popup Box */}
      <div
        className="fixed pointer-events-auto z-[9999] transition-all duration-200 ease-out"
        style={{
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
          width: `${cardWidth}px`,
        }}
      >
        {/* Directional Arrow Pointer pointing directly at target */}
        {targetRect && (
          <>
            {arrowPlacement === "top" && (
              <div
                className="absolute -top-2 w-0 h-0 transition-all pointer-events-none"
                style={{
                  left: `${arrowOffset - 6}px`,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderBottom: "8px solid #caaef2",
                }}
              >
                <div
                  className="absolute -left-[6px] top-[1px] w-0 h-0"
                  style={{
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderBottom: "7px solid #fffdf7",
                  }}
                />
              </div>
            )}
            {arrowPlacement === "bottom" && (
              <div
                className="absolute -bottom-2 w-0 h-0 transition-all pointer-events-none"
                style={{
                  left: `${arrowOffset - 6}px`,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "8px solid #caaef2",
                }}
              >
                <div
                  className="absolute -left-[6px] -top-[8px] w-0 h-0"
                  style={{
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "7px solid #fffdf7",
                  }}
                />
              </div>
            )}
            {arrowPlacement === "left" && (
              <div
                className="absolute -left-2 w-0 h-0 transition-all pointer-events-none"
                style={{
                  top: `${arrowOffset - 6}px`,
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderRight: "8px solid #caaef2",
                }}
              >
                <div
                  className="absolute left-[1px] -top-[6px] w-0 h-0"
                  style={{
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderRight: "7px solid #fffdf7",
                  }}
                />
              </div>
            )}
            {arrowPlacement === "right" && (
              <div
                className="absolute -right-2 w-0 h-0 transition-all pointer-events-none"
                style={{
                  top: `${arrowOffset - 6}px`,
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: "8px solid #caaef2",
                }}
              >
                <div
                  className="absolute -left-[8px] -top-[6px] w-0 h-0"
                  style={{
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: "7px solid #fffdf7",
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* Clean, Compact Claymorphism Card */}
        <div className="bg-[#fffdf7] rounded-2xl p-4 shadow-[0_12px_32px_rgba(31,24,35,0.18)] border-2 border-[#caaef2] text-[#1f1823] space-y-2.5">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#e6e8f4]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f6a3ca]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7963a7] px-2 py-0.5 rounded-full bg-[#ded0f9] border border-[#caaef2]">
                {currentStep.badge}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-[#716878] uppercase px-1.5 py-0.5 bg-[#e6e8f4] rounded border border-[#d6d9ea]">ESC</span>
              <button
                onClick={pauseTour}
                className="p-1 rounded-md text-[#5a5061] hover:text-[#1f1823] hover:bg-[#e6e8f4] transition-colors cursor-pointer"
                title="Exit / Pause Guide (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#1f1823] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#7963a7] shrink-0" />
              <span>{currentStep.title}</span>
            </h4>
            <p className="text-[11px] text-[#3b3240] leading-snug font-medium">
              {currentStep.description}
            </p>
          </div>

          {/* Card Footer: Step Indicators & Nav Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#e6e8f4]">
            <div className="flex items-center gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    i === currentStepIndex
                      ? "w-4 bg-[#7963a7]"
                      : i < currentStepIndex
                      ? "w-2 bg-[#c0efdc]"
                      : "w-1 bg-[#e6e8f4]"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {currentStepIndex > 0 && (
                <button
                  onClick={prevStep}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold text-[#3b3240] hover:text-[#1f1823] hover:bg-[#e6e8f4] transition-colors cursor-pointer flex items-center gap-0.5"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={nextStep}
                className="clay-pill-primary px-3 py-1 text-[11px] font-black flex items-center gap-1 text-[#1f1823] cursor-pointer"
              >
                <span>{currentStepIndex === totalSteps - 1 ? "Finish" : "Next"}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
