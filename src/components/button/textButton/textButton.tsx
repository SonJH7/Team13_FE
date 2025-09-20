import type { ReactNode } from 'react';

import type { ButtonProps } from '@/components/button/button';

import * as S from './textButton.styled';

export interface TextButtonProps extends Omit<ButtonProps, 'variant'> {
  children?: ReactNode;
}

const TextButton = ({ children, ...rest }: TextButtonProps) => {
  return (
    <S.StyledTextButton
      variant="text"
      {...rest} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </S.StyledTextButton>
  );
};

export default TextButton;
