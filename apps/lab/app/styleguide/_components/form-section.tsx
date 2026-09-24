"use client";

import { useState } from "react";
import { Checkbox } from "./forms/checkbox";
import { Field } from "./forms/field";
import { Input } from "./forms/input";
import { Radio } from "./forms/radio";
import { Select } from "./forms/select";
import { Switch } from "./forms/switch";
import { Textarea } from "./forms/textarea";
import { StyleguideSection } from "./styleguide-section";

function ControlGrid({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="type-h4">{title}</h3>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  );
}

export function FormSection() {
  const [newsletter, setNewsletter] = useState(true);

  return (
    <StyleguideSection
      description="Lab-local labeled primitives. Labels sit above fields. Placeholder text is never the label. States are shown side by side so they do not depend on hover."
      id="forms"
      title="Forms"
    >
      <div className="space-y-14">
        <ControlGrid title="Text input">
          <Field htmlFor="name-empty" label="Name">
            <Input id="name-empty" name="name-empty" />
          </Field>
          <Field htmlFor="name-filled" label="Name">
            <Input defaultValue="Mira Chen" id="name-filled" name="name-filled" />
          </Field>
          <Field htmlFor="name-focus" label="Name">
            <Input id="name-focus" name="name-focus" specimenState="focus" />
          </Field>
          <Field htmlFor="name-disabled" label="Name">
            <Input disabled defaultValue="Locked value" id="name-disabled" name="name-disabled" />
          </Field>
          <Field error="Enter a studio name." htmlFor="name-error" label="Name">
            <Input aria-invalid defaultValue="??" id="name-error" name="name-error" />
          </Field>
        </ControlGrid>

        <ControlGrid title="Textarea">
          <Field htmlFor="notes-empty" label="Project notes">
            <Textarea id="notes-empty" name="notes-empty" />
          </Field>
          <Field htmlFor="notes-filled" label="Project notes">
            <Textarea
              defaultValue="Keep the type scale in Lab globals.css. Do not duplicate sizes in the specimen data."
              id="notes-filled"
              name="notes-filled"
            />
          </Field>
          <Field htmlFor="notes-focus" label="Project notes">
            <Textarea id="notes-focus" name="notes-focus" specimenState="focus" />
          </Field>
          <Field error="Add a short note." htmlFor="notes-error" label="Project notes">
            <Textarea aria-invalid id="notes-error" name="notes-error" />
          </Field>
          <Field htmlFor="notes-disabled" label="Project notes">
            <Textarea disabled defaultValue="Read only" id="notes-disabled" name="notes-disabled" />
          </Field>
        </ControlGrid>

        <ControlGrid title="Select">
          <Field htmlFor="preset-empty" label="Catalogue set">
            <Select defaultValue="" id="preset-empty" name="preset-empty">
              <option value="">Choose a set</option>
              <option value="motion">Motion</option>
              <option value="shell">Production shell</option>
            </Select>
          </Field>
          <Field htmlFor="preset-filled" label="Catalogue set">
            <Select defaultValue="motion" id="preset-filled" name="preset-filled">
              <option value="motion">Motion</option>
              <option value="shell">Production shell</option>
            </Select>
          </Field>
          <Field htmlFor="preset-focus" label="Catalogue set">
            <Select id="preset-focus" name="preset-focus" specimenState="focus">
              <option value="motion">Motion</option>
              <option value="shell">Production shell</option>
            </Select>
          </Field>
          <Field htmlFor="preset-disabled" label="Catalogue set">
            <Select disabled id="preset-disabled" name="preset-disabled">
              <option>Motion</option>
            </Select>
          </Field>
          <Field error="Pick a set." htmlFor="preset-error" label="Catalogue set">
            <Select aria-invalid defaultValue="" id="preset-error" name="preset-error">
              <option value="">Choose a set</option>
              <option value="motion">Motion</option>
            </Select>
          </Field>
        </ControlGrid>

        <ControlGrid title="Checkbox">
          <label className="flex items-center gap-3 text-sm">
            <Checkbox id="check-off" name="check-off" />
            Unchecked
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Checkbox defaultChecked id="check-on" name="check-on" />
            Checked
          </label>
          <label className="flex items-center gap-3 text-sm text-foreground/55">
            <Checkbox disabled id="check-disabled" name="check-disabled" />
            Disabled
          </label>
        </ControlGrid>

        <ControlGrid title="Radio">
          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium">Route set</legend>
            <label className="flex items-center gap-3 text-sm">
              <Radio defaultChecked id="route-home" name="route-set" value="home" />
              Reveal
            </label>
            <label className="flex items-center gap-3 text-sm">
              <Radio id="route-work" name="route-set" value="work" />
              Styleguide
            </label>
            <label className="flex items-center gap-3 text-sm text-foreground/55">
              <Radio disabled id="route-locked" name="route-locked" value="locked" />
              Disabled
            </label>
          </fieldset>
        </ControlGrid>

        <ControlGrid title="Toggle">
          <div className="flex items-center gap-3">
            <Switch
              aria-labelledby="toggle-live-label"
              checked={newsletter}
              id="toggle-live"
              onCheckedChange={setNewsletter}
            />
            <span className="text-sm" id="toggle-live-label">
              {newsletter ? "Selected" : "Off"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Switch aria-labelledby="toggle-off-label" checked={false} id="toggle-off" />
            <span className="text-sm" id="toggle-off-label">
              Off
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              aria-labelledby="toggle-disabled-label"
              checked
              disabled
              id="toggle-disabled"
            />
            <span className="text-sm text-foreground/55" id="toggle-disabled-label">
              Disabled
            </span>
          </div>
        </ControlGrid>
      </div>
    </StyleguideSection>
  );
}
