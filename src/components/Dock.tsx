import { BehanceLogo, DotsThree, FileText, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { copy } from "@/content/copy";
import { contact } from "@/data/contact";

const icons = { GitHub: GithubLogo, Behance: BehanceLogo, LinkedIn: LinkedinLogo } as const;

const tile =
  "flex w-20 flex-col items-center gap-2 rounded-[calc(var(--radius-panel)-0.5rem)] px-2 py-3 text-caption transition-colors duration-(--dur-fast) hover:bg-wall";

/** A dots pill that springs open into the profile links and CV. Native popover: no JS. */
export default function Dock() {
  return (
    <>
      <button type="button" popoverTarget="dock" aria-label={copy.dock.open} className="pill pill-soft px-3.5">
        <DotsThree size={18} weight="bold" aria-hidden />
      </button>

      <div id="dock" popover="auto" className="dock rounded-[2rem] border border-line bg-mat p-2 shadow-[var(--shadow-lifted)]">
        <ul className="flex gap-1">
          {contact.links.map(({ label, href }) => {
            const Icon = icons[label as keyof typeof icons];
            return (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={tile}>
                  {Icon && <Icon size={24} aria-hidden />}
                  {label}
                </a>
              </li>
            );
          })}
          <li>
            <a href="/cv.pdf" download={copy.dock.cvFile} className={tile}>
              <FileText size={24} aria-hidden />
              {copy.dock.cv}
            </a>
          </li>
        </ul>
        <p className="mt-1 pb-1 text-center text-micro text-muted">{copy.dock.rights}</p>
      </div>
    </>
  );
}
