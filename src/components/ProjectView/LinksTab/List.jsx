import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import LinkCard from '../../links/LinkCard';

const List = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  renderAddButton(project) {
    return (
      <Link to={ `/projects/${project.id}/links/add` } className="btn">
        <span className={`octicon octicon-plus`}></span>
        {' '}
        ADD A LINK
      </Link>
    );
  },
  renderLoginButton(onLogin, pending) {
    if (pending) return 'Loading...';
    return (
      <button className="btn" onClick={ onLogin }>
        <span className={`octicon octicon-mark-github`}></span>
        {' '}
        Sign in with Github to add a link
      </button>
    );
  },
  render() {
    const { project, auth, authActions } = this.props;
    const isLoggedin = auth.username !== '';
    const links = project.links || [];
    return (
      <div>
      <div className="project-tabs-content" style={{ marginBottom: '2em' }}>
        <div className="inner">
          <p>
            <span className="octicon octicon-info"></span>
            {' '}
            Find here intesting reading about {project.name} project:
          </p>
          <ul>
            <li>blog entries</li>
            <li>tutorials</li>
            <li>related projects</li>
            <li>real-world applications...</li>
          </ul>
        </div>
      </div>

        { links.length > 0 ? (
          <div className="project-link-container">
            {links.map(link =>
              <LinkCard
                link={link}
                project={project}
                key={link._id}
                editable={auth.username === link.createdBy}
                showProjects={false}
              />
            )}
          </div>
        ) : (
          <p>Be the first to add a link!</p>
        )}

        <div style={{ textAlign: 'center', paddingTop: '1em' }}>
          { isLoggedin ? (
            this.renderAddButton(project)
          ) : (
            this.renderLoginButton(authActions.login, auth.pending)
          ) }
        </div>
      </div>
    );
  }
});
export default List;
