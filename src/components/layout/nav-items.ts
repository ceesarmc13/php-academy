import {
  ChartColumn,
  CircleUser,
  Dumbbell,
  GraduationCap,
  House,
  Map as MapIcon,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Short purpose, used as tooltip and in the "Más" sheet. */
  description: string;
  /** Shown in the mobile bottom bar (max 4 + "Más"). */
  primaryMobile: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: House, description: "Tu día de aprendizaje", primaryMobile: true },
  { href: "/aprender", label: "Aprender", icon: MapIcon, description: "Itinerario y lecciones", primaryMobile: true },
  { href: "/practica", label: "Práctica", icon: Dumbbell, description: "Repaso y simulacros", primaryMobile: true },
  { href: "/terminal", label: "Terminal", icon: SquareTerminal, description: "Escribe y ejecuta PHP", primaryMobile: false },
  { href: "/profesor", label: "Profesor IA", icon: GraduationCap, description: "Tu tutor particular", primaryMobile: true },
  { href: "/estadisticas", label: "Estadísticas", icon: ChartColumn, description: "Tu progreso en datos", primaryMobile: false },
  { href: "/perfil", label: "Perfil", icon: CircleUser, description: "Cuenta y preferencias", primaryMobile: false },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
