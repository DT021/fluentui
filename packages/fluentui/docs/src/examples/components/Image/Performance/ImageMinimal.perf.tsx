import { Image } from '@fluentui/react-northstar';
import * as _ from 'lodash';
import * as React from 'react';

const ImageMinimalPerf = () => (
  <>
    {_.times(5000, key => (
      <Image key={key} />
    ))}
  </>
);

ImageMinimalPerf.iterations = 5000;
ImageMinimalPerf.filename = 'ImageMinimal.perf.tsx';

export default ImageMinimalPerf;
