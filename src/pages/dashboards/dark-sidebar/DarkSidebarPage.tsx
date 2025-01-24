import { Fragment } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { Link } from 'react-router-dom';
import { LightSidebarContent } from '../light-sidebar';

const DarkSidebarPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title="Dashboard" description="Central Hub for Personal Customization" />
          <ToolbarActions>
            <Link to="/public-profile/profiles/default" className="btn btn-sm btn-light">
              View Profile
            </Link>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <LightSidebarContent />
      </Container>
    </Fragment>
  );
};

export { DarkSidebarPage };
