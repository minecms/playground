/**
 * Тонкая обёртка над Hugeicons: каждая иконка экспортируется как обычный
 * React-компонент с lucide-совместимым API (className, размер через size).
 * `HugeiconsIcon` без хуков — server-component-safe.
 */
import {
  Alert02Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Menu02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type HugeiconsIconProps, type IconSvgElement } from '@hugeicons/react';

export type IconProps = Omit<HugeiconsIconProps, 'icon'>;

function createIcon(icon: IconSvgElement) {
  return function Icon(props: IconProps) {
    return <HugeiconsIcon icon={icon} {...props} />;
  };
}

export const ArrowLeft = createIcon(ArrowLeft01Icon);
export const ChevronDown = createIcon(ArrowDown01Icon);
export const Info = createIcon(InformationCircleIcon);
export const TriangleAlert = createIcon(Alert02Icon);
export const AlertCircle = createIcon(AlertCircleIcon);
export const CheckCircle = createIcon(CheckmarkCircle02Icon);
export const Menu = createIcon(Menu02Icon);
export const Close = createIcon(Cancel01Icon);
