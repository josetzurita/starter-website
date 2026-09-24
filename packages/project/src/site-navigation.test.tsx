/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./components/site-header";
import { SkipLink } from "./components/skip-link";
import { MAIN_CONTENT_ID } from "./components/route-transition-types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

describe("site navigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("points the skip link at main content", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe(
      `#${MAIN_CONTENT_ID}`,
    );
  });

  it("marks the current page and closes mobile navigation on Escape", async () => {
    render(
      <SiteHeader
        items={[
          { href: "/", label: "Home" },
          { href: "/work", label: "Work" },
        ]}
        brand={<span>Brand</span>}
      />,
    );

    expect(screen.getAllByRole("link", { name: "Home" })[0]?.getAttribute("aria-current")).toBe(
      "page",
    );

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(await screen.findByRole("dialog", { name: "Navigation" })).toBeTruthy();
    expect(document.getElementById("mobile-navigation")?.hasAttribute("data-lenis-prevent")).toBe(
      true,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();
  });
});
