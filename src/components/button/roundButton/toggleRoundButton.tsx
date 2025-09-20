import type { ReactNode } from 'react';

import type { ToggleButtonProps } from '@/components/button/toggleButton';

import * as S from './roundButton.styled';

export interface ToggleRoundButtonProps
  extends Omit<ToggleButtonProps, 'variant' | 'size'> {
  size?: 'md' | 'lg';
  children?: ReactNode;
}

const ToggleRoundButton = ({
  size = 'md',
  children,
  ...rest
}: ToggleRoundButtonProps) => {
  return (
    <S.StyledToggleRoundButton
      variant="round"
      size={size}
      {...rest} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </S.StyledToggleRoundButton>
  );
};

export default ToggleRoundButton;
