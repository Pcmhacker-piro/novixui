import { createFileRoute } from "@tanstack/react-router";
import { MigrationPage } from "@/components/docs/migration-page";

export const Route = createFileRoute("/docs/migration/chakra-ui")({
  component: ChakraMigration,
  head: () => ({ meta: [{ title: "Migrate from Chakra UI · Novix UI" }, { name: "description", content: "Move from Chakra style props to Nova's utility classes and CSS tokens." }] }),
});

function ChakraMigration() {
  return (
    <MigrationPage
      eyebrow="Migration"
      title="From Chakra UI"
      description="Chakra uses style props and a runtime theme. Nova uses Tailwind utility classes and CSS-first tokens — smaller runtime, sharper defaults."
      overview="The mental leap is trading style props for utility classes. Everything else — accessibility, composition, controlled/uncontrolled patterns — feels familiar."
      install={`bun add @novix-ui/react tailwindcss\n# incremental: keep @chakra-ui/react installed during migration`}
      mapping={[
        { from: "Button", to: "Button", notes: "Variants: solid/subtle → primary/secondary/ghost." },
        { from: "IconButton", to: "IconButton", notes: "Same shape, stricter aria-label." },
        { from: "Input / FormControl", to: "Input + Label", notes: "Compose instead of a monolith." },
        { from: "Box / Flex", to: "<div> + Tailwind utilities", notes: "No runtime style prop engine." },
        { from: "useColorMode", to: "useTheme", notes: "Same idea, no CSS-in-JS." },
      ]}
      diffBefore={`<Button colorScheme="brand" leftIcon={<Search />}>
  Search
</Button>`}
      diffAfter={`import { Button } from "@novix-ui/react";
import { Search } from "lucide-react";

<Button variant="primary" leadingIcon={<Search />}>Search</Button>`}
      traps={[
        "Chakra's dark mode toggles a data attribute at the top of the tree. Nova ships an equivalent ThemeProvider — wire it in your root once.",
        "Style props like <Box mt={4}> become <div className='mt-4'>. Grep for 'as=' and 'sx=' to find them.",
        "Chakra's default border radius is 6px; Nova is 10–14px squircle-ish. Don't hard-code radii — inherit from tokens.",
      ]}
      callouts={[{ variant: "note", title: "No emotion, no runtime CSS", body: "Nova's styling is compiled Tailwind — no runtime style engine, no theme context walk on every render." }]}
    />
  );
}
