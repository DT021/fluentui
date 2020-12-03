import { Avatar } from '@fluentui/react-northstar';
import * as _ from 'lodash';
import * as React from 'react';

function getInitials() {
  return 'JD';
}

const AvatarMinimalPerf = () => (
  <>
    {_.times(5000, key => (
      <Avatar
        name={`John Doe ${key}`}
        getInitials={getInitials}
        key={key}
        status={{
          state: 'success',
          title: 'Available',
        }}
      />
    ))}
  </>
);

AvatarMinimalPerf.iterations = 1000;
AvatarMinimalPerf.filename = 'AvatarMinimal.perf.tsx';

export default AvatarMinimalPerf;
