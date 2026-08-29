import { createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarGroup, Badge } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Playground } from "@/components/docs/playground";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/components/avatar")({
  component: AvatarDoc,
  head: () => ({
    meta: [
      { title: "Avatar · Novix UI" },
      { name: "description", content: "Deterministic initials, status indicators, and grouped stacks — the Nova Avatar primitive." },
      { property: "og:title", content: "Avatar · Novix UI" },
      { property: "og:description", content: "Deterministic initials, status indicators, and grouped stacks." },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "src", type: "string", description: "Image URL. Falls back to initials on error." },
  { name: "name", type: "string", description: "Full display name — used for initials and aria-label." },
  { name: "size", type: `"xs" | "sm" | "md" | "lg" | "xl" | "2xl"`, default: `"md"`, description: "Diameter of the avatar." },
  { name: "shape", type: `"circle" | "squircle"`, default: `"circle"`, description: "Circle for people, squircle for brands and workspaces." },
  { name: "ring", type: `"none" | "subtle" | "strong" | "accent"`, default: `"subtle"`, description: "Border treatment. Use accent for active-user emphasis." },
  { name: "status", type: `"online" | "offline" | "busy" | "away"`, description: "Corner presence indicator." },
];

function AvatarDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="Avatar"
      description="A person or workspace representation. Falls back gracefully from photo to initials, and communicates presence with a corner status dot."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "when", label: "When to use" },
        { id: "playground", label: "Playground" },
        { id: "sizes", label: "Sizes" },
        { id: "shapes", label: "Shapes" },
        { id: "status", label: "Status" },
        { id: "group", label: "Groups" },
        { id: "api", label: "API" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>An avatar with photo, name-derived initials fallback, and an online status dot.</DocLead>
        <ComponentPreview
          className="mt-6"
          code={`<Avatar src="https://i.pravatar.cc/96?img=12" name="Ada Lovelace" status="online" />`}
        >
          <Avatar src="https://i.pravatar.cc/96?img=12" name="Ada Lovelace" status="online" />
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Add via the Nova CLI, then import.</DocParagraph>
        <div className="mt-5 space-y-3">
          <CodeBlock code={`npx @novix-ui/cli add avatar`} />
          <CodeBlock code={`import { Avatar, AvatarGroup } from "@novix-ui/react";`} />
        </div>
      </DocSection>

      <DocSection id="when" title="When to use">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Use it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Comment authorship, mentions, and activity feeds</li>
              <li>Workspace and team switchers (squircle)</li>
              <li>Presence in collaboration tools</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Reach for something else</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Product or file thumbnails — use a plain image with squircle radius</li>
              <li>Brand logos on marketing — use a Card cover, not an Avatar</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection id="playground" title="Playground">
        <div className="mt-6">
          <Playground
            controls={[
              { kind: "select", key: "size", label: "Size", options: ["xs", "sm", "md", "lg", "xl", "2xl"], defaultValue: "md" },
              { kind: "select", key: "shape", label: "Shape", options: ["circle", "squircle"], defaultValue: "circle" },
              { kind: "select", key: "ring", label: "Ring", options: ["none", "subtle", "strong", "accent"], defaultValue: "subtle" },
              { kind: "select", key: "status", label: "Status", options: ["none", "online", "away", "busy", "offline"], defaultValue: "online" },
              { kind: "switch", key: "photo", label: "With photo", defaultValue: true },
            ]}
          >
            {(s) => (
              <Avatar
                src={s.photo ? "https://i.pravatar.cc/96?img=32" : undefined}
                name="Grace Hopper"
                size={s.size as "md"}
                shape={s.shape as "circle"}
                ring={s.ring as "subtle"}
                status={s.status === "none" ? undefined : (s.status as "online")}
              />
            )}
          </Playground>
        </div>
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <ComponentPreview
          code={`<Avatar size="xs" name="AB" />
<Avatar size="sm" name="AB" />
<Avatar size="md" name="AB" />
<Avatar size="lg" name="AB" />
<Avatar size="xl" name="AB" />
<Avatar size="2xl" name="AB" />`}
        >
          <Avatar size="xs" name="Ada Byron" />
          <Avatar size="sm" name="Ada Byron" />
          <Avatar size="md" name="Ada Byron" />
          <Avatar size="lg" name="Ada Byron" />
          <Avatar size="xl" name="Ada Byron" />
          <Avatar size="2xl" name="Ada Byron" />
        </ComponentPreview>
      </DocSection>

      <DocSection id="shapes" title="Shapes">
        <p className="text-sm text-muted-foreground">Use <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">squircle</code> for workspaces, teams, and brand tiles. Circle stays reserved for people.</p>
        <ComponentPreview
          className="mt-4"
          code={`<Avatar shape="circle" name="Grace Hopper" />
<Avatar shape="squircle" name="Novix UI" />`}
        >
          <Avatar shape="circle" name="Grace Hopper" />
          <Avatar shape="squircle" name="Novix UI" />
        </ComponentPreview>
      </DocSection>

      <DocSection id="status" title="Status indicators">
        <ComponentPreview
          code={`<Avatar name="A" status="online" />
<Avatar name="B" status="away" />
<Avatar name="C" status="busy" />
<Avatar name="D" status="offline" />`}
        >
          <Avatar name="A" status="online" />
          <Avatar name="B" status="away" />
          <Avatar name="C" status="busy" />
          <Avatar name="D" status="offline" />
        </ComponentPreview>
      </DocSection>

      <DocSection id="group" title="Groups">
        <p className="text-sm text-muted-foreground">Overlap avatars for collaborators. The group announces the total count and shows a "+N" tile past the limit.</p>
        <ComponentPreview
          className="mt-4"
          code={`<AvatarGroup max={3}>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Katherine Johnson" />
  <Avatar name="Margaret Hamilton" />
  <Avatar name="Radia Perlman" />
</AvatarGroup>`}
        >
          <AvatarGroup max={3}>
            <Avatar name="Ada Lovelace" />
            <Avatar name="Grace Hopper" />
            <Avatar name="Katherine Johnson" />
            <Avatar name="Margaret Hamilton" />
            <Avatar name="Radia Perlman" />
          </AvatarGroup>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>Always pass <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">name</code> — it becomes the accessible label and initials fallback.</li>
          <li>Status is exposed via a visually hidden <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">sr-only</code> string ("online", "busy", …).</li>
          <li>Images have empty alt attributes because the surrounding label is authoritative.</li>
        </ul>
        <Callout variant="accessibility" title="Never rely on color alone">
          The status dot uses color and shape (busy is squared, away is a crescent). If you add custom statuses, keep this pairing.
        </Callout>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "Choose one shape per surface", d: "Mixing circle and squircle in the same list reads as inconsistency, not variety." },
            { t: "Cap the group at 5", d: "Beyond that the density is noise. Use +N and defer detail to a hover popover." },
            { t: "Initials are a fallback, not a style", d: "Prefer real photos or generated art. Initials are the safety net when neither exists." },
            { t: "Ring communicates state", d: "Reserve the accent ring for the active or speaking user in real-time surfaces." },
          ].map((g) => (
            <div key={g.t} className="nova-card-surface rounded-xl p-4">
              <p className="text-sm font-semibold">{g.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{g.d}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="mistakes" title="Common mistakes">
        <ul className="mt-2 space-y-3 text-sm">
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Passing only an initial as <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">name</code>. Nova computes initials for you — pass the full display name.</span></li>
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Using an Avatar as a button. Wrap it in an <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">IconButton</code> or Link so the interactive semantics are correct.</span></li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Badge", href: "/docs/components/badge", desc: "Small status labels beside a user's name.", status: "stable" },
            { title: "Skeleton", href: "/docs/components/skeleton", desc: "Placeholder while avatars load.", status: "stable" },
            { title: "IconButton", href: "/docs/components/icon-button", desc: "Wrap avatars that act as menus.", status: "stable" },
          ].map((r) => (
            <a key={r.href} href={r.href} className="nova-card-surface group block rounded-xl p-4 transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.title}</p>
                <Badge variant="outline" size="sm">{r.status}</Badge>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{r.desc}</p>
            </a>
          ))}
        </div>
      </DocSection>
    </DocsShell>
  );
}
