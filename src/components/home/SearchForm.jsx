import React from 'react'
import debounce from 'lodash/function/debounce'

const SearchForm = React.createClass({
  getInitialState() {
    return {
      text: this.props.searchText
    }
  },
  componentDidMount() {
    this.emitChangeDelayed = debounce(this.emitChange, 300)
  },
  emitChange(text) {
    this.props.onChange(text)
  },
  handleChange(e) {
    const text = e.target.value
    this.setState({
      text
    })
    this.emitChangeDelayed(text)
  },
  handleSubmit(e) {
    e.preventDefault()
    this.emitChange(this.state.text)
  },
  render() {
    return (
      <form id="searchbox" onSubmit={this.handleSubmit}>
        <input
          type="text"
          onChange={ this.handleChange }
          autoFocus
        />
        <span className="mega-octicon octicon-search icon"></span>
      </form>
    )
  }
})
export default SearchForm
