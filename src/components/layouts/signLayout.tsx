import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SignLayout({ children }: Props) {
  return (
    <div>
      <div>
        <div>
          {children}
        </div>
      </div>
      <div />
      <div>
        <div>
          <p><q>No gain, no pain! Wait, no... Well, kinda... But, no...</q></p>
        </div>
      </div>
    </div>
  )
}
