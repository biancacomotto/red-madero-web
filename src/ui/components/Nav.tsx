import { useTravel } from '@/hooks/useTravel'
import { NAV } from '@/lib/content'

/**
 * Plain section links and a dark "Descargar" button at the top right of the hero card. It
 * carries `data-hero-content`, so it fades out with the rest of the header instead of
 * floating over the sections below.
 */
export function Nav() {
  const travel = useTravel()
  const links = NAV.filter((link) => link.href !== '#descargar')
  return (
    <nav data-hero-content className="site-nav" aria-label="Secciones">
      <ul className="site-nav-links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={travel}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <a href="#descargar" onClick={travel} className="site-nav-cta">
        Descargar la app
      </a>
    </nav>
  )
}
