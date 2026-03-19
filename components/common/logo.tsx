import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Image 
      src="/images/bcas-logo.png"
      alt="Bioconstructores Asociados SAS"
      height={80}
      width={80}
      priority
      className={cn('size-16.25 object-contain', className)}
    />
  )
}