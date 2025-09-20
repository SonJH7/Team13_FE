import type { ReactNode } from 'react';

import type { ToggleButtonProps } from '@/components/button/toggleButton';

import * as S from './textButton.styled';

export interface ToggleTextButtonProps
  extends Omit<ToggleButtonProps, 'variant'> {
  children?: ReactNode;
}

const ToggleTextButton = ({ children, ...rest }: ToggleTextButtonProps) => {
  return (
    <S.StyledToggleTextButton
      variant="text"
      {...rest} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </S.StyledToggleTextButton>
  );
};

export default ToggleTextButton;
