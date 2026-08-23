import Rail from "@/components/Rail";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Writing from "@/components/Writing";
import Work from "@/components/Work";
import Research from "@/components/Research";
import Closing from "@/components/Closing";
import { person } from "@/lib/content";

const NAV = [
  { id: "top", label: "Overview" },
  { id: "work", label: "Selected work" },
  { id: "research", label: "Patents & papers" },
  { id: "writing", label: "Writing" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function Page() {
  return (
    <div className="mx-auto grid max-w-6xl gap-x-16 px-6 sm:px-10 lg:grid-cols-[16rem_1fr] lg:px-12">
      <Rail items={NAV} />

      <main className="pb-28 lg:pb-40">
        <Hero />
        <Work />
        <Research />
        <Writing />
        <Experience />

        <section id="contact" className="scroll-mt-16 pt-24 lg:pt-28">
          <h2 className="eyebrow mb-8 flex items-center gap-4">
            <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-signal" />
            Contact
          </h2>
          <p className="max-w-xl text-lg leading-relaxed">
            Best reached by email. I am happy to talk about LLMs, Inference Optimizations, all things ML and data science, production ML systems and design patterns for AI usecases on scalable infrastructure, pipelines and ML systems for enterprise codebases and applications, or agent architectures that have to survive an
            enterprise codebase.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <a className="text-signal underline-offset-4 hover:underline" href={`mailto:${person.email}`}>
              {person.email}
            </a>
            <a className="text-signal underline-offset-4 hover:underline" href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="text-signal underline-offset-4 hover:underline" href={person.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
          <Closing />
          <p className="eyebrow mt-16 border-t border-rule pt-6">{person.location}</p>
        </section>
      </main>
    </div>
  );
}
