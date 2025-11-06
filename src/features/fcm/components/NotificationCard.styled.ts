import styled from '@emotion/styled';

export const Card = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing4};
  padding: ${({ theme }) => `${theme.spacing5} ${theme.spacing5}`};
  border-radius: 24px;
  background: ${({ theme }) => theme.gray[0]};
  border: 1px solid ${({ theme }) => theme.border.default};
  box-shadow:
    0 12px 32px rgba(19, 95, 205, 0.08),
    0 4px 12px rgba(42, 48, 56, 0.04);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
      box-shadow:
        0 20px 40px rgba(19, 95, 205, 0.12),
        0 12px 24px rgba(42, 48, 56, 0.08);
    }
  }

  @media (max-width: 640px) {
    padding: ${({ theme }) => `${theme.spacing4} ${theme.spacing4}`};
    border-radius: 20px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing3};
`;

export const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text.default};
  font-size: ${({ theme }) => theme.subtitle1Bold.fontSize};
  font-weight: ${({ theme }) => theme.subtitle1Bold.fontWeight};
  line-height: ${({ theme }) => theme.subtitle1Bold.lineHeight};
`;

export const StatusDot = styled.span(({ theme }) => ({
  display: 'inline-flex',
  width: '12px',
  height: '12px',
  borderRadius: '999px',
  background: theme.gray[400],
  boxShadow: 'inset 0 0 0 1px rgba(85,93,109,0.12)',
  transition: 'background 0.2s ease, box-shadow 0.2s ease',
  '&[data-state="on"]': {
    background: theme.green[600],
    boxShadow:
      '0 0 0 2px rgba(102,187,106,0.2), 0 4px 12px rgba(0,166,81,0.25)',
  },
}));

export const Body = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing3};
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing2};
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.text.sub};
  font-size: ${({ theme }) => theme.label1Regular.fontSize};
  line-height: ${({ theme }) => theme.label1Regular.lineHeight};
`;

export const Code = styled.code`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 8px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.background.fill};
  border: 1px solid ${({ theme }) => theme.border.disabled};
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.text.default};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing3};
`;

export const Primary = styled.button`
  padding: ${({ theme }) => `${theme.spacing3} ${theme.spacing6}`};
  border-radius: 16px;
  border: 0;
  background: linear-gradient(
    120deg,
    ${({ theme }) => theme.blue[700]} 0%,
    ${({ theme }) => theme.blue[500]} 100%
  );
  color: ${({ theme }) => theme.gray[0]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.body1Bold.fontSize};
  font-weight: ${({ theme }) => theme.body1Bold.fontWeight};
  line-height: ${({ theme }) => theme.body1Bold.lineHeight};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  box-shadow: 0 10px 24px rgba(33, 124, 249, 0.35);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 32px rgba(33, 124, 249, 0.45);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  &:focus-visible {
    outline: 3px solid rgba(33, 124, 249, 0.35);
    outline-offset: 2px;
  }
`;

export const Ghost = styled.button`
  padding: ${({ theme }) => `${theme.spacing3} ${theme.spacing6}`};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.gray[0]};
  color: ${({ theme }) => theme.text.default};
  cursor: pointer;
  font-size: ${({ theme }) => theme.body1Bold.fontSize};
  font-weight: ${({ theme }) => theme.body1Bold.fontWeight};
  line-height: ${({ theme }) => theme.body1Bold.lineHeight};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(42, 48, 56, 0.12);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 3px solid rgba(33, 124, 249, 0.25);
    outline-offset: 2px;
  }
`;

export const Switch = styled.button(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing2,
  padding: '8px 14px',
  borderRadius: '999px',
  border: `1px solid ${theme.border.default}`,
  background: theme.background.default,
  color: theme.text.default,
  cursor: 'pointer',
  fontSize: theme.label1Bold.fontSize,
  fontWeight: theme.label1Bold.fontWeight,
  lineHeight: theme.label1Bold.lineHeight,
  transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
  '&[data-state="on"]': {
    background: theme.blue[100],
  },
  '&:hover': {
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none',
  },
  '&:focus-visible': {
    outline: '3px solid rgba(33, 124, 249, 0.35)',
    outlineOffset: '2px',
  },
}));

export const Live = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.placeholder};
  font-size: ${({ theme }) => theme.label1Regular.fontSize};
  line-height: ${({ theme }) => theme.label1Regular.lineHeight};
`;
