import { motion } from "framer-motion";
import { skillGroups } from "../data/archive";

const EASE = [0.22, 1, 0.36, 1] as const;

const skillIcons: Record<string, string> = {
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  JavaScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  TypeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  Bash: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg",
  "Node.js / Express":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  Django:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg",
  MongoDB:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  PostgreSQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  Docker:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "MERN platforms":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "Telegram bots": "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
  "Django portals":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg",
  Automation:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg",
  "Quant tools":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg",
  "Automata / CS":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
  "Distributed DB":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
};

export default function Inventory() {
  return (
    <section
      id="inventory"
      className="relative border-t border-line px-6 py-28 md:px-10 md:py-40"
    >
      {/* Header — made more visible & clear */}
      <div className="mb-14 md:mb-20">
        <span className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 font-body text-[13px] font-bold uppercase tracking-[0.2em] text-paper backdrop-blur-sm md:px-6 md:py-2.5 md:text-[15px]">
          (02 — Inventory)
        </span>
        <motion.h2
          className="font-display text-5xl font-medium uppercase leading-[0.95] tracking-tight text-paper md:text-8xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          The stack,
          <br />
          on <span className="text-acid">record.</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-8">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: gi * 0.12, ease: EASE }}
          >
            <div className="mb-6 flex items-center justify-between gap-3 border-b-2 border-paper/80 pb-4">
              <h3 className="font-display text-2xl font-medium uppercase tracking-tight text-paper">
                {group.title}
              </h3>
              <span className="inline-flex shrink-0 items-center rounded-full border border-acid/20 bg-acid/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-acid md:text-[11px]">
                {group.note}
              </span>
            </div>
            <ul className="border-t border-line">
              {group.skills.map((skill, i) => (
                <motion.li
                  key={skill.name}
                  data-cursor="hover"
                  className="group flex items-center justify-between gap-4 border-b border-line py-4"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                >
                  <div className="flex items-center gap-3">
                    <motion.img
                      src={skillIcons[skill.name]}
                      alt={`${skill.name} logo`}
                      className="h-10 w-10 shrink-0 bg-transparent object-contain md:h-12 md:w-12"
                      loading="lazy"
                      decoding="async"
                      animate={{ y: [0, -3.5, 0] }}
                      transition={{
                        duration: 2.2 + (i % 3) * 0.35,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.12,
                      }}
                      whileHover={{ scale: 1.12, rotate: 3 }}
                      onError={(e) => {
                        const t = e.currentTarget as HTMLImageElement;
                        t.style.display = "none";
                      }}
                    />
                    <span className="text-base font-medium tracking-tight text-paper/90 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-paper md:text-lg">
                      {skill.name}
                    </span>
                  </div>
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-acid/60 transition-colors duration-300 group-hover:bg-acid group-hover:shadow-[0_0_8px_rgba(217,255,74,0.6)]"
                    aria-hidden="true"
                  />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
