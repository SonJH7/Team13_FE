import type { ReactNode } from 'react';

import type { ToggleButtonProps } from '@/components/button/toggleButton';

import * as S from './loginButton.styled';

export interface ToggleLoginButtonProps
  extends Omit<ToggleButtonProps, 'variant' | 'children'> {
  children?: ReactNode;
}

const ToggleLoginButton = ({
  children = '카카오로 시작하기',
  ...rest
}: ToggleLoginButtonProps) => {
  return (
    <S.StyledToggleLoginButton
      variant="login"
      {...rest} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </S.StyledToggleLoginButton>
  );
};

export default ToggleLoginButton;
