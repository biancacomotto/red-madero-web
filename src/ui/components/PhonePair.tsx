import type { ScreenId } from '@/screens'
import { PhoneFrame } from '@/ui/components/PhoneFrame'

interface PhonePairProps {
  left: ScreenId
  right: ScreenId
  className?: string
}

/** Two flat phones side by side, one a little lower, turned toward each other. */
export function PhonePair({ left, right, className = '' }: PhonePairProps) {
  return (
    <div className={`relative aspect-[0.86] w-full ${className}`}>
      <PhoneFrame screen={left} className="absolute top-[9%] left-[3%] w-[46%] -rotate-6" />
      <PhoneFrame screen={right} className="absolute top-0 right-[3%] w-[46%] rotate-6" />
    </div>
  )
}
