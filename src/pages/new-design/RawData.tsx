import { Fragment } from 'react';
import { Container } from '@/components/container';
import { RecentUploads } from '../public-profile/profiles/default';



const RawDataPage = () => {
  return (
    <Fragment>
      <Container>
      < RecentUploads title="File đã được tải lên" />
      </Container>
    </Fragment>
  );
};

export { RawDataPage };