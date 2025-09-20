import type { ReactNode } from 'react';

import type { ToggleButtonProps } from '@/components/button/toggleButton';

import * as S from './iconButton.styled';

export interface ToggleIconButtonProps
  extends Omit<ToggleButtonProps, 'variant' | 'ariaLabel'> {
  ariaLabel: string;
  children?: ReactNode;
}

const ToggleIconButton = ({
  ariaLabel,
  children,
  ...rest
}: ToggleIconButtonProps) => {
  return (
    <S.StyledToggleIconButton
      variant="icon"
      ariaLabel={ariaLabel}
      {...rest} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </S.StyledToggleIconButton>
  );
};

export default ToggleIconButton;
