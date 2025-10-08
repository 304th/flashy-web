'use client';

import { ReactNode, Suspense } from 'react';
import { ProgressBar } from '@/packages/progress-bar';

const options = {
  showSpinner: false,
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ProgressBar
          height="1px"
          color="#1bf3a4"
          options={options}
          showOnShallow={false}
          delay={250}
        />
      </Suspense>
    </>
  );
};
