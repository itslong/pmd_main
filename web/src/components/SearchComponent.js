import React, { Component }from 'react';
import { withRouter } from 'react-router-dom';

import SearchForm from './SearchForm';
import { Input, Button, Table, Select } from './common';
import { SearchForItems } from './endpoints';
import Pager from './Pager';
import { SEARCH_RESULTS_PATH } from './frontendBaseRoutes';
import { renameStaticTableFields } from './fieldNameAliases';

const searchSizeLimits = [10, 30, 50]
const searchFilterAllOptions = [
  // {'all': 'all'},
  {parts: 'parts'},
  {tasks: 'tasks'},
  {categories: 'categories'},
  {jobs: 'jobs'},
];

const searchFilterStyle = {
  display: 'flex'
};

const searchSelectItemButtonName = {
  parts: 'part',
  tasks: 'task',
  categories: 'category'
};
/**
  searchType: pass in 'parts' to restrict to parts or default to all.
  shouldUpdateParent: 'overrides' the parent's data when true
*/
class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchType: this.props.searchType || 'all',
      searchFilterType: this.props.searchType,
      searchText: '',
      searchResults: [],
      shouldUpdateParent: this.props.shouldUpdateParent || false,
      totalResultsCount: 0,
      totalResultsPages: 0,
      nextPage: '',
      previousPgae: '',
      currentPageSize: 10,
      currentPageNum: 1,
      maxPageSize: 10,
      pageSizeLimits: this.props.pageSizeLimits || searchSizeLimits,
    };


    // this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.handleSearchText = this.handleSearchText.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.clearSearch = this.clearSearch.bind(this);

    this.handlePageNav = this.handlePageNav.bind(this);
    this.handlePageSizeLimitClick = this.handlePageSizeLimitClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearchByRoute = this.handleSearchByRoute.bind(this);
  }

  componentDidMount() {
    const { searchType } = this.state;

    if (this.props.location.state) {
      const { searchText } = this.props.location.state;
      this.setState({ searchText })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { currentPageNum, currentPageSize, searchText, searchType, searchFilterType, shouldUpdateParent } = this.state;
    
    if (currentPageSize != prevState.currentPageSize || currentPageNum != prevState.currentPageNum || (searchText !== prevState.searchText && searchText)) {
      // update pageSize and pageNum only if the searchText changed
      if (searchText !== prevState.searchText) {
        currentPageNum = 1;
        currentPageSize = 10;
      }

      // const searchEndpoint = (searchFilterType === 'all') ? '' : SearchForItems(searchText, searchType, currentPageNum, currentPageSize);

      const getResults = SearchForItems(searchText, searchType, currentPageNum, currentPageSize);

      getResults.then(data => {
        const { count, total_pages, next, previous, max_page_size, current_page, ...results } = data;
        this.setState({
          searchResults: results[searchType],
          totalResultsCount: count,
          totalResultsPages: total_pages,
          nextPage: next,
          previousPgae: previous,
          maxPageSize: max_page_size,
          currentPageNum: current_page
        });

        if (shouldUpdateParent) {
          this.props.displayResults();
        }
      });

    }
  }

  filterSearchResultsTableData() {
    const { searchResults } = this.state;
    const { searchType } = this.props;

    const singularizeSearchName = searchSelectItemButtonName[searchType];

    return renameStaticTableFields(searchResults, singularizeSearchName, 'search');
  }

  handleSearchText(searchVal) {
    const { shouldUpdateParent, searchText } = this.state;

    if (searchVal === searchText) {
      return null;
    }

    this.setState({ searchText: searchVal });
  }

  handleAddItem(e) {
    e.preventDefault();
    const item = this.state.searchResults.filter(item => {
      return item.id == e.target.id
    });
    // console.log(JSON.stringify(item))
    // console.log('the part: ' + JSON.stringify(part))
    this.props.handleAddItem(item[0]);

  }

  handlePageNav(selectedPage) {
    this.setState({
      currentPageNum: parseInt(selectedPage),
    });
  }

  handlePageSizeLimitClick(e) {
    const { currentPageSize } = this.state;
    const newPageSizeVal = parseInt(e.target.textContent);

    this.setState({ currentPageSize: newPageSizeVal });
  }

  handlePreviousPageClick() {
    const { currentPageNum } = this.state;

    if (currentPageNum > 1) {
      this.setState({ 
        currentPageNum: currentPageNum - 1,
      })
    }
  }

  handleNextPageClick() {
    const { currentPageNum } = this.state;

    this.setState({ 
      currentPageNum: currentPageNum + 1,
    })
  }

  clearSearch() {
    this.setState({
      totalResultsCount: 0,
      totalResultsPages: 0,
      searchResults: [],
      searchText: null,
    });

    if (this.props.resetSearch) {
      this.props.resetSearch();
    }
  }

  handleFilterChange(e) {
    const searchOption = e.target.selectedOptions[0].value;
    this.setState({
      searchFilterType: searchOption
    });
  }

  handleSearchByRoute() {
    // pass searchText, searchFilter
    // this.props.history.push('route', { searchText: searchText, searchType: searchType})
    const { searchText, searchFilterType } = this.state;
    if (searchFilterType === 'all') {
      this.props.history.push(SEARCH_RESULTS_PATH, {
        searchText
      })
    }
  }

  render() {
    const { 
      searchType, searchResults, searchText, displayResultsInParent,
      totalResultsPages, totalResultsCount, currentPageNum, currentPageSize, pageSizeLimits,
      previousPage, nextPage, shouldUpdateParent, maxPageSize
    } = this.state;
    
    const { tableConfigProps } = this.props;

    const addItemButton = <Button key={0} action={this.handleAddItem} title={`Select ${searchSelectItemButtonName[searchType]}`} type={'primary'} />;

    const searchFilterOptions = searchType !== 'all' ? 
      [{searchType: searchType}] 
      : searchFilterAllOptions;

    const searchFilterButton = <Select options={searchFilterOptions} type={'primary'} handleChange={this.handleFilterChange} />;

    const totalResultsDisplay = (totalResultsCount > 0 && searchText.length > 0) ? `Found a total of ${totalResultsCount} ${searchType}.` : '';

    const resultsFoundText = (searchText && searchResults.length == 0) ?
      `Could not find '${searchText}'. Try the name again.`
      : '';

    const tableHeaderText = (searchText && searchResults.length > 0) ?
      `Found ${searchResults.length} ${searchType}.` : '';

    const tableExtraColHeaders = shouldUpdateParent && tableConfigProps ? tableConfigProps.extraColHeaders : ['Action'];
    const tableExtraRowProps = shouldUpdateParent && tableConfigProps ? tableConfigProps.extraRowProps : [addItemButton];
    const tableExtraPropsLayout = shouldUpdateParent && tableConfigProps ? tableConfigProps.extraPropsLayout : 'separate';

    const shouldSearchByRoute = shouldUpdateParent ? null : this.handleSearchByRoute;  
    const loadSearchText = searchText !== '' ? searchText : '';

    const prevPageClick = previousPage != null ? this.handlePreviousPageClick : null;
    const nextPageClick = nextPage != null ? this.handleNextPageClick : null;

    const displaySearchPager = totalResultsCount > 0 ?
      <Pager
        totalItemsCount={totalResultsCount}
        totalPages={totalResultsPages}
        currentPageNum={currentPageNum}
        currentPageSize={currentPageSize}
        handlePageNav={this.handlePageNav}
        handlePreviousPageClick={prevPageClick}
        handleNextPageClick={nextPageClick}
        handlePageSizeLimitClick={this.handlePageSizeLimitClick}
        pageSizeLimits={pageSizeLimits}
        maxPageSize={maxPageSize}
      /> : '';

    // when clearSearch is clicked, hide the table
    const renamedSearchResults = searchResults.length > 0 ? this.filterSearchResultsTableData() : searchResults;

    const displayResultsTable = (searchResults.length > 0) ?
      <Table
        tableId={'search-results-table'}
        data={renamedSearchResults}
        fetchType={searchType}
        headerText={tableHeaderText}
        extraColHeaders={tableExtraColHeaders}
        extraRowProps={tableExtraRowProps}
        extraPropsLayout={tableExtraPropsLayout}
        numberOfLinks={1}
      /> : '';


    return (
      <div>
        <div style={searchFilterStyle}>
          { searchFilterButton }
          <SearchForm
            handleSearchText={this.handleSearchText}
            clearSearch={this.clearSearch}
            handleSearchAll={this.handleSearchByRoute}
            loadSearchText={loadSearchText}
          />
        </div>
        { totalResultsDisplay }
        { resultsFoundText }
        { displaySearchPager }
        { displayResultsTable }
      </div>
    )  
  }
  
};

export default withRouter(SearchComponent);
