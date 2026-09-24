"use client";

import { CircleNotch } from "@phosphor-icons/react";
import { Button } from "@cds/ui";
import {
  BUTTON_MATRIX,
  BUTTON_SIZE_ROWS,
  BUTTON_SPECIMEN_STATES,
  type ButtonSpecimenState,
} from "../_data/styleguide-data";
import { SpecimenCell, SpecimenTable } from "./specimen-table";
import { StyleguideSection } from "./styleguide-section";

const STATE_LABELS: Record<ButtonSpecimenState, string> = {
  default: "Default",
  hover: "Hover",
  pressed: "Pressed",
  focus: "Focused",
  disabled: "Disabled",
  loading: "Loading",
};

function SpecimenButton({
  variant,
  size,
  state,
}: {
  variant: (typeof BUTTON_MATRIX)[number]["variant"];
  size: (typeof BUTTON_SIZE_ROWS)[number]["size"];
  state: ButtonSpecimenState;
}) {
  const isLoading = state === "loading";
  const isDisabled = state === "disabled" || isLoading;
  const forced =
    state !== "default" && state !== "disabled" && state !== "loading" ? state : undefined;

  return (
    <Button
      aria-busy={isLoading || undefined}
      data-specimen={forced}
      disabled={isDisabled}
      size={size}
      variant={variant}
    >
      {isLoading ? <CircleNotch aria-hidden className="size-4 animate-spin" weight="bold" /> : null}
      Action
    </Button>
  );
}

export function ButtonSection() {
  return (
    <StyleguideSection
      description="Forced specimen states use the production @cds/ui Button plus Lab CSS on data-specimen. Loading is a spinner child with aria-busy. Focus remains a visible ring."
      id="buttons"
      title="Buttons"
    >
      {BUTTON_MATRIX.map((row) => (
        <div className="mt-10 first:mt-0" key={row.variant}>
          <h3 className="type-h4">{row.label}</h3>
          <div className="mt-5">
            <SpecimenTable
              columns={["Size", ...BUTTON_SPECIMEN_STATES.map((state) => STATE_LABELS[state])]}
              minWidthClass="min-w-[72rem]"
            >
              {BUTTON_SIZE_ROWS.map((sizeRow) => (
                <tr key={`${row.variant}-${sizeRow.size}`}>
                  <SpecimenCell sticky>
                    <span className="type-mono">{sizeRow.label}</span>
                  </SpecimenCell>
                  {BUTTON_SPECIMEN_STATES.map((state) => (
                    <SpecimenCell key={state}>
                      <SpecimenButton size={sizeRow.size} state={state} variant={row.variant} />
                    </SpecimenCell>
                  ))}
                </tr>
              ))}
            </SpecimenTable>
          </div>
        </div>
      ))}
    </StyleguideSection>
  );
}
