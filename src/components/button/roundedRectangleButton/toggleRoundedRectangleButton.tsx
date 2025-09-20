import type { ReactNode } from 'react';

import type { ToggleButtonProps } from '@/components/button/toggleButton';

import * as S from './roundedRectangleButton.styled';

export interface ToggleRoundedRectangleButtonProps
  extends Omit<ToggleButtonProps, 'variant'> {
  colorSet?: S.RoundedRectangleColors;
  children?: ReactNode;
}

const ToggleRoundedRectangleButton = ({
  colorSet,
  children,
  ...rest
}: ToggleRoundedRectangleButtonProps) => {
  return (
    <S.StyledToggleRoundedRectangleButton
      variant="secondary"
      colorSet={colorSet}
      {...rest} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </S.StyledToggleRoundedRectangleButton>
  );
};

export default ToggleRoundedRectangleButton;
