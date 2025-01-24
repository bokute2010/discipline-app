import { Fragment } from 'react';
import { Container } from '@/components/container';
import { StagingTable } from './StagingTable';



const StagingDataPage = () => {
  return (
    <Fragment>
      <Container>
        <StagingTable />
      </Container>
    </Fragment>
  );
};

export { StagingDataPage };