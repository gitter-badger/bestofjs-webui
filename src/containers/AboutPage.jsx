import React from 'react';
import { connect } from 'react-redux';

import About from '../components/about/About';
import populate from '../helpers/populate';
import log from '../helpers/log';
import getStaticContent from '../staticContent';

const AboutPage = React.createClass({

  render() {
    log('Render the <AboutPage> container', this.props);
    const { staticContent, project, count } = this.props;
    return (
      <About
        project={project}
        staticContent={staticContent}
        count={count}
      />
    );
  }

});

function mapStateToProps(state) {
  const {
    entities: { projects, tags, links },
    githubProjects: { popularProjectIds }
  } = state;

  const project = popularProjectIds
    .map(id => projects[id])
    .slice(0, 1)
    .map(populate(tags, links));

  return {
    project: project[0],
    staticContent: getStaticContent(),
    count: Object.keys(projects).length
  };
}

export default connect(mapStateToProps, {
})(AboutPage);
