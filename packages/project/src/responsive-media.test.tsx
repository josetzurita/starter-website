/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AspectMedia } from "./components/aspect-media";
import { MediaFrame } from "./components/media-frame";
import { ResponsiveImage } from "./components/responsive-image";

vi.mock("next/image", () => ({
  default: ({
    alt,
    onError,
    width,
    height,
  }: {
    alt: string;
    onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    width?: number;
    height?: number;
  }) => (
    <img alt={alt} width={width} height={height} onError={onError} src="/broken.png" />
  ),
}));

describe("responsive media", () => {
  afterEach(() => {
    cleanup();
  });

  it("reserves layout from intrinsic aspect props", () => {
    render(
      <MediaFrame>
        <AspectMedia data-testid="aspect" width={16} height={9}>
          <p>Frame</p>
        </AspectMedia>
      </MediaFrame>,
    );
    expect(screen.getByTestId("aspect").style.aspectRatio).toBe("16 / 9");
  });

  it("renders the error fallback when an image fails", () => {
    render(
      <ResponsiveImage
        alt="Measured specimen"
        src="/broken.png"
        width={720}
        height={240}
        sizes="100vw"
        fallback={<p>Image could not load.</p>}
      />,
    );
    fireEvent.error(screen.getByRole("img", { name: "Measured specimen" }));
    expect(screen.getByText("Image could not load.")).toBeTruthy();
  });
});
