import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SignLayout({ children }: Props) {
  return (
    <div className='min-h-screen flex items-stretch justify-center relative overflow-hidden bg-gradient-to-br from-purple-7 via-purple-6 to-purple-5'>
      <div className='flex-1 max-w-2/5 relative flex items-center justify-center'>
        <div className='relative z-10 flex justify-center flex-col overflow-hidden min-w-400'>
          {children}
        </div>
        <div className='absolute -top-1/2 -bottom-1/2 -left-1/2 right-0 bg-purple-8 rotate-12 border-purple-3 border-r-4' />
      </div>
      <div />
      <div className='flex-1 flex justify-center items-center min-[700]:'>
        <div className='text-4xl font-bold text-center max-w-lg'>
          <div className='h-3 text-3xl text-left'>”</div>
          <p className='px-10 py-3 max-w-md text-left'>No gain, no pain! Wait, no... Well, kinda... But, no...</p>
          <div className='h-3 text-3xl text-right'>”</div>
        </div>
      </div>
    </div>
  )
}
