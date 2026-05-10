import type { SVGProps } from 'react';

const SvgMock = (props: SVGProps<SVGSVGElement>) => (
  <svg data-testid="svg-react-mock" aria-label="svg-react-mock" {...props} />
);

export default SvgMock;
