import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import Field from '../../common/form/Field';
import ErrorMessage from '../../common/utils/ErrorMessage';
import RatingBox from './RatingBox';

import validate from './validate';

const ReviewForm = React.createClass({
  propTypes: {
    project: PropTypes.object,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  },
  render() {
    const {
      project,
      auth,
      fields: {
        comment,
        score
      },
      handleSubmit,
      valid,
      // errors,
      submitFailed,
      submitting,
      onSave // passed from parent component (<Create> / <Edit>)
    } = this.props;
    console.log('Render LinkReduxForm', this.props);
    return (
      <form
        onSubmit={ handleSubmit(onSave(project, auth.username)) }
        className={ `ui form${valid ? '' : ' error'}` }
      >

      <Field
        label="Your rating:"
        showError={ submitFailed && score.error }
        errorMessage={ score.error }
      >
        <RatingBox score={ score } />
      </Field>

        <Field
          label="Your comment:"
          showError={ submitFailed && comment.error }
          errorMessage={ comment.error }
        >
          <textarea rows="8" {...comment} />
        </Field>

        { !valid && submitFailed &&
          <ErrorMessage>Fix invalid fields!</ErrorMessage>
        }

        <div className="form-action-bar">
          <button
            className={ `ui btn${submitting ? ' loading button' : ''}` }
            disabled={ submitting }
            type="submit"
          >
            <span className={`octicon octicon-cloud-upload`}></span>
            {' '}
            SAVE
          </button>
        </div>
      </form>
    );
  }
});
const ReviewReduxForm = reduxForm({
  form: 'review',
  fields: ['comment', 'score'],
  validate
})(ReviewForm);

export default ReviewReduxForm;
