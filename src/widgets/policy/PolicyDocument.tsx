import { Container } from "@/shared/ui/Container";

export interface PolicySection {
  heading: string;
  body: string[];
  list?: string[];
}

export interface PolicyContent {
  title: string;
  updated: string;
  intro: string;
  sections: PolicySection[];
}

export function PolicyDocument({ content }: { content: PolicyContent }) {
  return (
    <Container className="max-w-3xl py-16 sm:py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">{content.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{content.updated}</p>
      <p className="mt-6 text-muted-foreground">{content.intro}</p>

      <div className="mt-10 flex flex-col gap-8">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
            <div className="mt-3 flex flex-col gap-3 text-muted-foreground">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul className="list-disc pl-5">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
