import {
  AspectMedia,
  MediaFrame,
  ResponsiveImage,
  ResponsiveVideo,
} from "@cds/project";

export function ResponsiveMediaDemo() {
  return (
    <div data-testid="responsive-media-live" className="grid gap-8">
      <MediaFrame data-testid="media-frame">
        <ResponsiveImage
          alt="Measured specimen"
          src="/specimen.svg"
          width={720}
          height={240}
          sizes="(min-width: 768px) 40rem, 100vw"
        />
      </MediaFrame>
      <AspectMedia width={16} height={9} data-testid="aspect-media">
        <ResponsiveVideo
          poster="/specimen.svg"
          fallback={<p>Video could not load.</p>}
        >
          <source src="/missing.mp4" type="video/mp4" />
        </ResponsiveVideo>
      </AspectMedia>
    </div>
  );
}
