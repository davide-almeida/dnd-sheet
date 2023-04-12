import type { PropsWithChildren } from "react";

type ContainerUntitledProps = {
  ariaLabel: string;
};

export function ContainerUntitled({ ariaLabel, children }: PropsWithChildren<ContainerUntitledProps>): JSX.Element {
  return (
    <div className="container untitled" role="region" aria-label={ariaLabel}>
      {children}
    </div>
  );
}
