"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export type ButtonVariant = "primary" | "secondary" | "outline" | "glow";
export type ButtonSize = "sm" | "md" | "lg";

export interface PremiumButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  as?: "button" | "a";
  // optional: allow passing id, aria-label etc.
  id?: string;
  "aria-label"?: string;
  // allow passing style overrides
  style?: React.CSSProperties;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-8 py-3.5 text-base",
  lg: "px-10 py-4 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "relative overflow-hidden font-bold shadow-lg hover:shadow-2xl",
  secondary: "relative overflow-hidden font-semibold border backdrop-blur-md",
  outline: "relative overflow-hidden font-semibold border-2",
  glow: "relative overflow-hidden font-semibold border backdrop-blur-md hover:shadow-lg",
};

const getVariantStyle = (variant: ButtonVariant): React.CSSProperties => {
  switch (variant) {
    case "primary":
      return {
        background: "var(--gradient-accent)",
        color: "var(--bg-primary)",
        boxShadow: "0 12px 30px var(--glow-primary)",
      };
    case "secondary":
      return {
        background: "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        color: "var(--text-primary)",
        borderColor: "var(--border-color)",
      };
    case "outline":
      return {
        background: "transparent",
        color: "var(--text-primary)",
        borderColor: "var(--text-primary)",
      };
    case "glow":
      return {
        background: "var(--gradient-highlight)",
        color: "var(--text-primary)",
        boxShadow: "0 12px 40px var(--glow-primary)",
        borderColor: "rgba(255,255,255,0.04)",
      };
    default:
      return {};
  }
};

const PremiumButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  PremiumButtonProps
>(
  (
    {
      children,
      href,
      onClick,
      variant = "primary",
      size = "md",
      className = "",
      disabled = false,
      type = "button",
      as = "button",
      id,
      style,
      ...rest
    },
    forwardedRef
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const magneticRef = useRef<HTMLDivElement | null>(null);
    const gsapTweens = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Compose classes
    const baseClasses = [
      "relative", // important for ripple containment
      "overflow-hidden",
      "font-medium",
      "transition-all",
      "duration-300",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-white/50",
      "focus:ring-offset-2",
      "focus:ring-offset-black",
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
      "inline-flex",
      "items-center",
      "justify-center",
      "gap-2",
      "whitespace-nowrap",
      sizeClasses[size],
      variantClasses[variant],
      "rounded-lg",
      className,
    ].join(" ");

    // Merge variant style + user style
    const mergedStyle: React.CSSProperties = {
      ...(getVariantStyle(variant) || {}),
      position: "relative", // ensures ripple sits inside
      ...style,
    };

    // Magnetic effect: mousemove & mouseleave on container
    useEffect(() => {
      const container = containerRef.current;
      const element = magneticRef.current;
      if (!container || !element) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isHovering) return;
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = (e.clientX - centerX) * 0.15;
        const distanceY = (e.clientY - centerY) * 0.15;

        // kill previous tween for this element to avoid conflicts
        gsap.killTweensOf(element);
        gsap.to(element, {
          x: distanceX,
          y: distanceY,
          duration: 0.4,
          overwrite: true,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.killTweensOf(element);
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1.2, 0.5)",
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [isHovering]);

    // Cleanup any lingering GSAP tweens on unmount
    useEffect(() => {
      return () => {
        gsapTweens.current?.kill?.();
        gsap.killTweensOf(magneticRef.current);
      };
    }, []);

    // ripple creation helper
    const spawnRipple = (e: React.MouseEvent<HTMLElement>) => {
      const target = e.currentTarget as HTMLElement;
      // ensure relative (already set via style), but fallback
      if (getComputedStyle(target).position === "static") {
        target.style.position = "relative";
      }

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.className = "premium-button-ripple";
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 12px;
        height: 12px;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.25) 20%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        will-change: width, height, opacity, transform;
        z-index: 1;
      `;

      target.appendChild(ripple);

      // animate via GSAP and remove after
      const tween = gsap.to(ripple, {
        width: 400,
        height: 400,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        onComplete: () => {
          ripple.remove();
        },
      });

      // keep reference to kill if needed later
      gsapTweens.current = tween;
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      spawnRipple(e);
      // call provided onClick
      onClick?.(e);
    };

    // Render as anchor or button
    const commonProps = {
      id,
      ref: forwardedRef as any,
      className: baseClasses,
      style: mergedStyle,
      onMouseEnter: () => setIsHovering(true),
      onMouseLeave: () => setIsHovering(false),
      onClick: handleClick,
      "aria-disabled": disabled ? true : undefined,
      ...rest,
    } as React.HTMLAttributes<HTMLElement>;

    const element =
      as === "a" ? (
        <div ref={containerRef} className="inline-block">
          <a
            {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            href={disabled ? undefined : href ?? "#"}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled ? true : undefined}
            onClick={(e) => {
              // allow anchor to function normally if href present
              handleClick(e as any);
            }}
          >
            <div ref={magneticRef} className="flex items-center justify-center gap-2 relative z-10">
              {children}
            </div>
          </a>
        </div>
      ) : (
        <div ref={containerRef} className="inline-block">
          <button
            {...(commonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            type={type}
            disabled={disabled}
          >
            <div ref={magneticRef} className="flex items-center justify-center gap-2 relative z-10">
              {children}
            </div>
          </button>
        </div>
      );

    return element;
  }
);

PremiumButton.displayName = "PremiumButton";

export default PremiumButton;
