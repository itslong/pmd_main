import React, { Component } from 'react';

import { Input, Button } from './common';

const searchBarStyle = {
  display: 'flex',
  flexDirection: 'row'
};


class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // search val to reset
      // search type?
      searchVal: this.props.loadSearchText || '',
      prevSearch: '',

    }

    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
  }

  handleSubmitSearch(e) {
    e.preventDefault();
    const { searchVal, prevSearch } = this.state;
    const { handleSearchText, handleSearchAll } = this.props;

    // do nothing if no search text, even if toggled to 'all'
    if (searchVal === '' || handleSearchAll === null) {
      console.log('submit search null fired')
      return null;
    }

    this.setState({
      prevSearch: searchVal, 
      searchVal,
    }, () => {
      handleSearchText(searchVal);
      handleSearchAll();
    });
  }

  handleSearchInput(e) {
    this.setState({ searchVal: e.target.value });
  }

  handleClearSearch() {
    this.setState({
      searchVal: '',
      prevSearch: '',
    })

    this.props.clearSearch();
  }

  render() {
    const { searchVal, prevSearch } = this.state;

    const displaySearchText = 'You searched for: ';
    const displayPrevSearch = (prevSearch !== '') ? displaySearchText + "'" + prevSearch + "'" : '';

    const displaySearchTextFromRoute = searchVal ? searchVal : '';

    const clearSearchButton = (prevSearch !== '') ?
      <Button
        type={'reset-search'}
        title={'Reset Search'}
        action={this.handleClearSearch}
      /> : '';

    return (
      <div className={'search-form'} style={{ width: '50%' }}>
        <form style={searchBarStyle}>
          <Input
            type={'text'}
            title={''}
            value={displaySearchTextFromRoute}
            handleChange={this.handleSearchInput}
            placeholder={'Enter the item you want to search for.'}
          />
          
          <Button
            title={'Search'}
            type={'primary'}
            action={this.handleSubmitSearch}
          />

        </form>

        { clearSearchButton }
        { displayPrevSearch }

      </div>
    );
  }
  
};

export default SearchForm;

